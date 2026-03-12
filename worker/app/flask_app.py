import os
from flask import Flask, request, jsonify
from psycopg2.extras import RealDictCursor
from app.tasks import send_sms, _get_db_conn
from datetime import datetime, timezone

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
    from_ = request.form.get("From", "").strip()
    body = request.form.get("Body", "").strip()
    provider_sid = request.form.get("MessageSid", "").strip()
    received_at = datetime.now(timezone.utc)
    if not from_:
        return jsonify({"error": "from is required"}), 422
    if not body:
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
                  AND now() AT TIME ZONE 'UTC' >= (
                    (r.check_in::timestamp + p.checkin_time) AT TIME ZONE p.timezone
                  ) AT TIME ZONE 'UTC'
                  AND now() AT TIME ZONE 'UTC' < (
                    (r.check_out::timestamp + p.checkout_time) AT TIME ZONE p.timezone
                  ) AT TIME ZONE 'UTC'
                ORDER BY r.check_in DESC
                LIMIT 1;
                """,
                (from_,),
            )
            row = cur.fetchone()

            if not row:
                return jsonify({"error": "no active reservation for this guest"}), 404

            if not row["is_active"]:
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

            cur.execute(
                """
                INSERT INTO texts (conversation_id, provider_sid, content, role, sent_at)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (conversation_id, provider_sid, body, "guest", received_at),
            )

    return jsonify({"status": "accepted"}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200
