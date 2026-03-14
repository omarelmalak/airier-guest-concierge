"""Twilio SMS client and helpers. Reads TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER from env."""
import os

from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client


def send_sms(to: str, body: str):
    """Send an SMS via Twilio. Returns the message object. Raises TwilioRestException on Twilio errors."""
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_FROM_NUMBER")
    if not all([account_sid, auth_token, from_number]):
        raise ValueError("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER required")

    client = Client(account_sid, auth_token)
    return client.messages.create(to=to, from_=from_number, body=body)


__all__ = ["send_sms", "TwilioRestException"]
