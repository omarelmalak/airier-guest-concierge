import uuid
from datetime import datetime, timezone

from app.services.twilio import send_sms as twilio_send_sms
from app.services.reasoner import generate_response
from app.services.message_processor import process_incoming_message, send_outgoing_message
from app.services.database.auto_message import AutoMessageDatabase
from app.services.database.conversation import ConversationDatabase
from app.services.database.base import Database

class MessageController:
    def __init__(self):
        self.auto_message_database = AutoMessageDatabase()
        self.conversation_database = ConversationDatabase()
        self.database = Database()
        
    def receive_sms(self, from_: str, body: str, provider_sid: str, received_at: datetime):
        incoming_text_id = process_incoming_message(from_, body, provider_sid, received_at)

        response = generate_response(incoming_text_id)

        conversation_id = self.conversation_database.get_conversation_id_by_text_id(incoming_text_id)

        outgoing_text_id = send_outgoing_message(conversation_id, from_, response)

        return outgoing_text_id

    def send_auto_message(self, auto_message_id: str):
        now = datetime.now(timezone.utc)

        try:
            lock_key = uuid.UUID(auto_message_id).int % (2**63 - 1)
        except Exception as exc:  # noqa: BLE001
            raise ValueError(f"Invalid auto_message_id: {auto_message_id}") from exc

        with self.database.get_conn() as conn:
            locked = self.database.lock_advisory_lock(lock_key, conn=conn)
            if not locked:
                print("auto_message %s locked by another worker; skipping" % (auto_message_id,))
                return {"status": "locked"}

            auto_message = self.auto_message_database.get_auto_message_by_id(auto_message_id, conn=conn)

            validation_result = self._validate_auto_message(auto_message, auto_message_id, now)
            if validation_result["status"] != "valid":
                return validation_result

            to = validation_result["to"]
            body = validation_result["body"]

            conversation_id = self.conversation_database.get_conversation_id_by_reservation_id(auto_message["reservation_id"], conn=conn)
            if not conversation_id:
                conversation_id = self.conversation_database.create_conversation(auto_message["reservation_id"], conn=conn)

            outgoing_text_id = send_outgoing_message(conversation_id, to, body, conn=conn)
            print("Sent auto_message %s to %s (text_id=%s)" % (auto_message_id, to, outgoing_text_id))

            updated = self.auto_message_database.update_auto_message_text_id(auto_message_id, outgoing_text_id, conn=conn)
            if not updated:
                print("Failed to update auto_message %s with text_id=%s" % (auto_message_id, outgoing_text_id))
                return {"status": "update_failed"}

            return {"status": "sent"}

    def _validate_auto_message(self, auto_message: dict, auto_message_id: str, now: datetime):
        if not auto_message:
            return {"status": "not_found"}
        if auto_message.get("text_id"):
            return {"status": "already_sent"}
        if auto_message.get("is_active") is False:
            return {"status": "reservation_not_active"}

        if auto_message.get("send_at") and auto_message["send_at"] > now:
            return {"status": "too_early"}

        to = (auto_message.get("guest_phone") or "").strip()
        if not to:
            raise ValueError("Guest phone missing")

        if auto_message.get("kind") == "checkin":
            body = (auto_message.get("checkin_msg") or "").strip()
        elif auto_message.get("kind") == "checkout":
            body = (auto_message.get("checkout_msg") or "").strip()
        else:
            print("auto_message %s has unsupported kind=%s; skipping" % (auto_message_id, auto_message.get("kind")))
            return {"status": "unsupported_kind"}

        if not body:
            print("auto_message %s has empty body; skipping" % (auto_message_id,))
            return {"status": "empty_body"}

        return {"status": "valid", "to": to, "body": body}