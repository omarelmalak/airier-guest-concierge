import os
from flask import Flask, Blueprint, request, jsonify
from datetime import datetime, timezone
from app.message_controller import MessageController

app = Flask(__name__)
bp = Blueprint("worker", __name__, url_prefix="/worker/v1")

@bp.route("/receive_sms", methods=["POST"])
def receive_sms():
    print("[receive_sms] Request received; form keys:", list(request.form.keys()))

    from_ = request.form.get("From", "").strip()
    body = request.form.get("Body", "").strip()
    provider_sid = request.form.get("MessageSid", "").strip()
    received_at = datetime.now(timezone.utc)
    message_controller = MessageController()

    try:   
        text_id = message_controller.receive_sms(from_, body, provider_sid, received_at)
        
        print("[receive_sms] Done, returning 200")
        return jsonify({"status": "accepted"}), 200
    except Exception as e:
        print("[receive_sms] Error: %s" % (e,))
        return jsonify({"status": "error", "message": str(e)}), 500
