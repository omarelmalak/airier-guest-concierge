import os
from flask import Flask, request, jsonify
from psycopg2.extras import RealDictCursor
from app.tasks import send_sms, _get_db_conn
from datetime import datetime, timezone
from app.services.twilio_service import TwilioRestException, send_sms as twilio_send_sms

app = Flask(__name__)


@app.route("/tasks/send_sms", methods=["POST"])
def enqueue_send_sms():
    data = request.get_json(force=True, silent=True) or {}
    to = (data.get("to") or "").strip()
    body = (data.get("body") or "").strip()
    if not to:
        return jsonify({"error": "to is required"}), 422
    if not body:
        return jsonify({"error": "body is required"}), 422
    send_sms.delay(to, body)
    return jsonify({"status": "accepted"}), 202

@app.route("/receive_sms", methods=["POST"])
def receive_sms():
    print("[receive_sms] Request received; form keys:", list(request.form.keys()))
    from_ = request.form.get("From", "").strip()
    body = request.form.get("Body", "").strip()
    provider_sid = request.form.get("MessageSid", "").strip()
    received_at = datetime.now(timezone.utc)
    print("[receive_sms] From=%r Body=%r MessageSid=%r" % (from_, body, provider_sid))

    if not from_:
        print("[receive_sms] Reject: missing From")
        return jsonify({"error": "from is required"}), 422
    if not body:
        print("[receive_sms] Reject: missing Body")
        return jsonify({"error": "body is required"}), 422

    with _get_db_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                  r.id AS reservation_id,
                  r.is_active AS is_active,
                  c.id AS conversation_id
                FROM reservations r
                JOIN guests g ON g.id = r.guest_id
                JOIN properties p ON p.id = r.property_id
                LEFT JOIN conversations c ON c.reservation_id = r.id
                WHERE g.phone = %s
                  AND r.is_active = true
                ORDER BY r.check_in DESC
                LIMIT 1;
                """,
                (from_,),
            )
            row = cur.fetchone()
            print("[receive_sms] row=%r" % (row,))

            if not row:
                print("[receive_sms] No reservation with AI active for phone=%r" % (from_,))
                return jsonify({"error": "no active reservation for this guest"}), 404

            print("[receive_sms] reservation_id=%s is_active=%s conversation_id=%s" % (
                row["reservation_id"], row["is_active"], row["conversation_id"]))

            if not row["is_active"]:
                print("[receive_sms] Reject: reservation not active")
                return jsonify({"error": "reservation is not active"}), 400

            conversation_id = row["conversation_id"]
            if not conversation_id:
                cur.execute(
                    """
                    INSERT INTO conversations (reservation_id)
                    VALUES (%s)
                    RETURNING id
                    """,
                    (row["reservation_id"],),
                )
                conversation_id = cur.fetchone()["id"]
                print("[receive_sms] Created conversation_id=%s" % (conversation_id,))

            cur.execute(
                """
                INSERT INTO texts (conversation_id, provider_sid, content, role, sent_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (conversation_id, provider_sid, body, "guest", received_at),
            )
            print("[receive_sms] Inserted guest text into conversation_id=%s" % (conversation_id,))

            print("[receive_sms] Sending reply SMS to %s" % (from_,))
            body = "I can reply to your message!"
            message = twilio_send_sms(from_, body)
            sent_at = message.date_sent or message.date_created
            print("[receive_sms] Sent reply sid=%s" % (message.sid,))

            cur.execute(
                """
                INSERT INTO texts (conversation_id, provider_sid, content, role, sent_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (conversation_id, message.sid, body, "airier", sent_at),
            )
            print("[receive_sms] Inserted airier text into conversation_id=%s" % (conversation_id,))

    print("[receive_sms] Done, returning 200")
    return jsonify({"status": "accepted"}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200
