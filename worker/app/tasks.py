import os

from celery.utils.log import get_task_logger
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from app.celery_app import app

logger = get_task_logger(__name__)


@app.task(bind=True, acks_late=True, max_retries=3, default_retry_delay=30)
def send_sms(self, to: str, body: str):
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_FROM_NUMBER")
    if not all([account_sid, auth_token, from_number]):
        raise ValueError(
            "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER required"
        )

    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(to=to, from_=from_number, body=body)
        logger.info("Sent SMS to %s (sid=%s)", to, message.sid)
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
