import os
import uuid
from datetime import datetime, timedelta, timezone

from celery.utils.log import get_task_logger

from app.celery_app import app
from app.exceptions import ServiceError
from app.message_controller import MessageController
from app.services.database.auto_message import AutoMessageDatabase
from app.services.twilio import TwilioRestException, send_sms as twilio_send_sms

logger = get_task_logger(__name__)
auto_message_database = AutoMessageDatabase()


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def send_sms(self, to: str, body: str):
    try:
        message = twilio_send_sms(to, body)
        logger.info("Sent SMS to %s (sid=%s)", to, message.sid)
        return {"status": "sent", "to": to, "sid": message.sid}
    except TwilioRestException as exc:
        status = getattr(exc, "status", None)
        logger.error("Twilio error sending SMS to %s: %s", to, exc)
        if status is not None and 400 <= status < 500:
            raise

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
    logger.info(f"[poll_due_auto_messages] window_start: {window_start}")
    logger.info(f"[poll_due_auto_messages] now: {now}")
    try:
        due_auto_messages = auto_message_database.get_due_auto_messages(window_start, now)

        for auto_message in due_auto_messages:
            send_auto_message.delay(auto_message["id"])

        logger.info(
            "[poll_due_auto_messages] Polled auto_messages window [%s, %s], enqueued=%d"
            % (window_start, now, len(due_auto_messages))
        )
        return {"enqueued": len(due_auto_messages)}
    except Exception as exc:  # noqa: BLE001
        logger.error("[poll_due_auto_messages] Error: %s" % (exc,))
        raise self.retry(exc=exc)


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def send_auto_message(self, auto_message_id: str):
    """
    Sends a single auto_message via Twilio SMS and marks it sent.
    Uses a Postgres advisory lock to avoid double-sends if multiple poll cycles enqueue the same id.
    """
    try:
        message_controller = MessageController()
        result = message_controller.send_auto_message(auto_message_id)
        logger.info("[send_auto_message] Done for %s" % (auto_message_id,))
        return result
    except ServiceError as e:
        logger.error("[send_auto_message] Error for %s: %s" % (auto_message_id, e.message))
        return {"status": "error", "error": e.message, "status_code": e.status_code}
    except TwilioRestException as exc:
        status = getattr(exc, "status", None)
        logger.error("[send_auto_message] Twilio error for %s: %s" % (auto_message_id, exc))
        if status is not None and 400 <= status < 500:
            raise
        raise self.retry(exc=exc)
    except Exception as exc:  # noqa: BLE001
        logger.error("[send_auto_message] Error for %s: %s" % (auto_message_id, exc))
        raise self.retry(exc=exc)
