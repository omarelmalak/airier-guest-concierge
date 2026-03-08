import os
from flask import Flask, request, jsonify
from app.tasks import send_sms

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


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200
