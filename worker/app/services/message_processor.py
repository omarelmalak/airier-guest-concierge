from app.exceptions import ServiceError
from app.services.database.reservation import ReservationDatabase
from app.services.database.conversation import ConversationDatabase
from app.services.database.text import TextDatabase
from app.services.twilio import send_sms as twilio_send_sms


reservation_database = ReservationDatabase()
conversation_database = ConversationDatabase()
text_database = TextDatabase()


def process_incoming_message(
    from_, body, provider_sid, received_at, *, property_id: str | None = None, conn=None
):
    """Returns the new guest text_id on success. Raises ServiceError on validation/not-found."""
    print(
        "[process_incoming_message] From=%r Body=%r MessageSid=%r property_id=%r"
        % (from_, body, provider_sid, property_id)
    )

    if not from_:
        print("[process_incoming_message] Reject: missing From")
        raise ServiceError("from is required", 422)
    if not body:
        print("[process_incoming_message] Reject: missing Body")
        raise ServiceError("body is required", 422)

    reservation = reservation_database.get_active_reservation_by_phone(
        from_, property_id=property_id, conn=conn
    )
    if not reservation:
        print(
            "[process_incoming_message] No reservation with AI active for phone=%r property_id=%r"
            % (from_, property_id)
        )
        raise ServiceError("no active reservation for this guest", 404)

    conversation_id = reservation.get("conversation_id")
    if not conversation_id:
        conversation_id = conversation_database.create_conversation(reservation["reservation_id"], conn=conn)

    text_id = text_database.store_text(conversation_id, provider_sid, body, "guest", received_at, conn=conn)
    print("[process_incoming_message] Inserted guest text into conversation_id=%s" % (conversation_id,))

    return text_id

def send_outgoing_message(conversation_id: str, to: str, body: str, *, conn=None) -> str:
    print("[send_outgoing_message] To=%r Body=%r" % (to, body))
    message = twilio_send_sms(to, body)
        
    sent_at = message.date_sent or message.date_created
    text_id = text_database.store_text(conversation_id, message.sid, body, "airier", sent_at, conn=conn)

    print("[send_outgoing_message] Inserted airier text into conversation_id=%s" % (conversation_id,))

    return text_id