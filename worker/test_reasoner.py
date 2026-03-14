import argparse
from typing import List, Optional


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Local entrypoint to exercise the guest reasoning pipeline "
            "(same code that the Twilio webhook will eventually use)."
        )
    )
    parser.add_argument(
        "guest_message",
        help="The latest guest message text.",
    )
    parser.add_argument(
        "property_id",
        help="The Airier property ID associated with the guest.",
    )
    parser.add_argument(
        "-c",
        "--conversation",
        action="append",
        dest="conversation_turns",
        help=(
            "Optional prior conversation turns as context. "
            "Can be passed multiple times, e.g. "
            "--conversation 'guest: Hi' --conversation 'airier: Hello!'."
        ),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    guest_message: str = args.guest_message
    property_id: str = args.property_id
    conversation_turns: Optional[List[str]] = args.conversation_turns

    # TODO: Wire this up to the real reasoning pipeline that the Twilio
    # webhook will invoke once that pipeline exists.
    #
    # Example (future):
    # from app.reasoning import run_guest_message_pipeline
    # result = run_guest_message_pipeline(
    #     guest_message=guest_message,
    #     property_id=property_id,
    #     prior_turns=conversation_turns or [],
    # )
    #
    # For now we only parse inputs so this script can be used
    # as a stable local entrypoint without making any Twilio calls.

    print("guest_message:", guest_message)
    print("property_id:", property_id)
    print("conversation_turns:", conversation_turns or [])


if __name__ == "__main__":
    main()

