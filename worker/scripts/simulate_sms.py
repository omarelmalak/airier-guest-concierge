#!/usr/bin/env python3
"""
Simulate receive_sms without sending real SMS. Uses the same MessageController flow;
Twilio is mocked so no credits are used. Run from worker dir with env (e.g. doppler run).

Usage (from worker/):
  doppler run -- python scripts/simulate_sms.py +15551234567 "What's the WiFi password?"
  doppler run -- python scripts/simulate_sms.py +15551234567 --interactive   # multi-turn in terminal

Or: make simulate-sms phone=+15551234567 body="What's the WiFi?"
    make simulate-sms phone=+15551234567 interactive=1
"""

import argparse
import sys
from pathlib import Path

# Ensure worker app is on path when run as script
_worker_root = Path(__file__).resolve().parent.parent
if str(_worker_root) not in sys.path:
    sys.path.insert(0, str(_worker_root))


def _install_fake_twilio_if_needed():
    """If the real twilio package is not installed, stub it in sys.modules so app.services.twilio can load."""
    try:
        import twilio.base.exceptions  # noqa: F401
        return
    except ModuleNotFoundError:
        pass
    # Stub twilio so app.services.twilio can import
    from types import ModuleType
    base = ModuleType("twilio.base")
    base.exceptions = ModuleType("twilio.base.exceptions")
    base.exceptions.TwilioRestException = type("TwilioRestException", (Exception,), {})
    base.exceptions.__all__ = ["TwilioRestException"]
    rest = ModuleType("twilio.rest")
    rest.Client = type("Client", (), {})
    rest.__all__ = ["Client"]
    twilio_mod = ModuleType("twilio")
    twilio_mod.base = base
    twilio_mod.rest = rest
    sys.modules["twilio"] = twilio_mod
    sys.modules["twilio.base"] = base
    sys.modules["twilio.base.exceptions"] = base.exceptions
    sys.modules["twilio.rest"] = rest


from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

# Must patch before importing controller (which imports message_processor -> twilio)
def _fake_send_sms(to: str, body: str):
    """No-op Twilio send; we just print what would have been sent."""
    print("\n  [SIMULATED SMS → %s]\n  %s\n" % (to, body))
    return SimpleNamespace(
        sid="sim_%s" % datetime.now(timezone.utc).timestamp(),
        date_sent=datetime.now(timezone.utc),
        date_created=datetime.now(timezone.utc),
    )


def main():
    parser = argparse.ArgumentParser(
        description="Simulate guest SMS flow without sending real SMS (Twilio is mocked)."
    )
    parser.add_argument(
        "phone",
        help="Guest phone number (E.164, must have an active reservation in DB)",
    )
    parser.add_argument(
        "body",
        nargs="?",
        default=None,
        help="Message body. Omit to use --interactive.",
    )
    parser.add_argument(
        "-i",
        "--interactive",
        action="store_true",
        help="Loop: type messages and see responses until you type 'quit' or 'exit'.",
    )
    args = parser.parse_args()

    phone = args.phone.strip()
    if not phone:
        parser.error("phone is required")
    if not args.interactive and not args.body:
        parser.error("body is required unless --interactive")

    _install_fake_twilio_if_needed()

    # Patch by module object so we don't rely on pkgutil resolving app.services.message_processor
    import app.services.message_processor as _message_processor_module
    with patch.object(_message_processor_module, "twilio_send_sms", side_effect=_fake_send_sms):
        from app.message_controller import MessageController

        controller = MessageController()

        if args.interactive:
            print("Simulating conversation for %s (type 'quit' or 'exit' to stop).\n" % phone)
            while True:
                try:
                    body = input("You: ").strip()
                except (EOFError, KeyboardInterrupt):
                    break
                if not body or body.lower() in ("quit", "exit", "q"):
                    break
                try:
                    controller.receive_sms(
                        phone,
                        body,
                        provider_sid="sim_%s" % datetime.now(timezone.utc).timestamp(),
                        received_at=datetime.now(timezone.utc),
                    )
                except Exception as e:
                    print("Error: %s\n" % e)
            print("Done.")
            return

        # Single message
        try:
            controller.receive_sms(
                phone,
                args.body,
                provider_sid="sim_%s" % datetime.now(timezone.utc).timestamp(),
                received_at=datetime.now(timezone.utc),
            )
            print("(Response above was simulated; no SMS sent.)")
        except Exception as e:
            print("Error: %s" % e)
            raise SystemExit(1)


if __name__ == "__main__":
    main()
