import os
from twilio.rest import Client
from app.celery_app import app


@app.task(bind=True, acks_late=True)
def send_sms(self, to: str, body: str):
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_FROM_NUMBER")
    if not all([account_sid, auth_token, from_number]):
        raise ValueError("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER required")
    client = Client(account_sid, auth_token)
    client.messages.create(to=to, from_=from_number, body=body)
    return {"status": "sent", "to": to}
