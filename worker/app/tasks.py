import os
import uuid
from datetime import datetime, timedelta, timezone

from celery.utils.log import get_task_logger
import psycopg2
from psycopg2.extras import RealDictCursor

from app.celery_app import app
from app.services.twilio_service import TwilioRestException, send_sms as twilio_send_sms

logger = get_task_logger(__name__)


def _get_db_conn():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL required")
    return psycopg2.connect(database_url)


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def send_sms(self, to: str, body: str):
    try:
        message = twilio_send_sms(to, body)
        print("Sent SMS to %s (sid=%s)", to, message.sid)
        return {"status": "sent", "to": to, "sid": message.sid}
    except TwilioRestException as exc:
        # Don't retry permanent/client errors (e.g. invalid number, permission issues)
        status = getattr(exc, "status", None)
        logger.error("Twilio error sending SMS to %s: %s", to, exc)
        if status is not None and 400 <= status < 500:
            raise

        # Retry transient/server/network errors
        raise self.retry(exc=exc)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error sending SMS to %s", to)
        raise self.retry(exc=exc)


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def poll_due_auto_messages(self):
    """
    Runs every 60s (Celery Beat). Finds auto_messages due in the last 60s window:
      window_start = now - 1 minute
      window_end = now
    and enqueues send_auto_message for each.
    """
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(minutes=1)
    print(f"window_start: {window_start}")
    print(f"now: {now}")
    try:
        with _get_db_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT id
                    FROM auto_messages
                    WHERE text_id IS NULL
                      AND send_at >= %s
                      AND send_at <= %s
                    ORDER BY send_at ASC
                    LIMIT 500
                    """,
                    (window_start, now),
                )
                rows = cur.fetchall()

        for row in rows:
            send_auto_message.delay(row["id"])

        print("Polled auto_messages window [%s, %s], enqueued=%d" % (window_start, now, len(rows)))
        return {"enqueued": len(rows)}
    except Exception as exc:  # noqa: BLE001
        print("poll_due_auto_messages failed")
        raise self.retry(exc=exc)


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def send_auto_message(self, auto_message_id: str):
    """
    Sends a single auto_message via Twilio SMS and marks it sent.
    Uses a Postgres advisory lock to avoid double-sends if multiple poll cycles enqueue the same id.
    """
    now = datetime.now(timezone.utc)
    try:
        lock_key = uuid.UUID(auto_message_id).int % (2**63 - 1)
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"Invalid auto_message_id: {auto_message_id}") from exc

    try:
        with _get_db_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT pg_try_advisory_lock(%s) AS locked", (lock_key,))
                locked = cur.fetchone()["locked"]
                if not locked:
                    print("auto_message %s locked by another worker; skipping" % (auto_message_id,))
                    return {"status": "locked"}

                cur.execute(
                    """
                    SELECT
                      am.id,
                      am.kind,
                      am.send_at,
                      am.text_id,
                      am.reservation_id,
                      g.phone AS guest_phone,
                      p.checkin_msg,
                      p.checkout_msg,
                      r.is_active AS is_active
                    FROM auto_messages am
                    JOIN reservations r ON r.id = am.reservation_id
                    JOIN guests g ON g.id = r.guest_id
                    JOIN properties p ON p.id = r.property_id
                    WHERE am.id = %s
                    """,
                    (auto_message_id,),
                )
                am = cur.fetchone()
                if not am:
                    return {"status": "not_found"}
                if am["text_id"]:
                    return {"status": "already_sent"}
                if am["is_active"] == False:
                    return {"status": "reservation_not_active"}
                    
                # Ensure we only send when due (or slightly late); prevent early sends.
                if am["send_at"] and am["send_at"] > now:
                    return {"status": "too_early"}

                to = (am["guest_phone"] or "").strip()
                if not to:
                    raise ValueError("Guest phone missing")

                if am["kind"] == "checkin":
                    body = (am["checkin_msg"] or "").strip()
                elif am["kind"] == "checkout":
                    body = (am["checkout_msg"] or "").strip()
                else:
                    print("auto_message %s has unsupported kind=%s; skipping" % (auto_message_id, am["kind"]))
                    return {"status": "unsupported_kind"}

                if not body:
                    print("auto_message %s has empty body; skipping" % (auto_message_id,))
                    return {"status": "empty_body"}

                message = twilio_send_sms(to, body)
                print("Sent auto_message %s to %s (sid=%s)" % (auto_message_id, to, message.sid))

                cur.execute(
                    "SELECT id FROM conversations WHERE reservation_id = %s",
                    (am["reservation_id"],),
                )
                row = cur.fetchone()
                if row:
                    conversation_id = row["id"]
                else:
                    cur.execute(
                        "INSERT INTO conversations (reservation_id) VALUES (%s) RETURNING id",
                        (am["reservation_id"],),
                    )
                    conversation_id = cur.fetchone()["id"]

                sent_at = message.date_sent or message.date_created

                cur.execute(
                    """
                    INSERT INTO texts (conversation_id, provider_sid, content, role, sent_at)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (conversation_id, message.sid, body, "airier", sent_at),
                )
                text_id = cur.fetchone()["id"]

                cur.execute("UPDATE auto_messages SET text_id = %s WHERE id = %s", (text_id, auto_message_id))

                return {"status": "sent", "sid": message.sid, "text_id": str(text_id)}
    except TwilioRestException as exc:
        status = getattr(exc, "status", None)
        print("Twilio error sending auto_message %s: %s" % (auto_message_id, exc))
        if status is not None and 400 <= status < 500:
            raise
        raise self.retry(exc=exc)
    except Exception as exc:  # noqa: BLE001
        print("send_auto_message failed for %s" % (auto_message_id,))
        raise self.retry(exc=exc)
