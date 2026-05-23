import html
import json
import os
import urllib.error
import urllib.parse
import urllib.request

DETECT_URL = "https://translation.googleapis.com/language/translate/v2/detect"
TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"
DEFAULT_MIN_DETECT_CONFIDENCE = 0.5


class GoogleTranslateLocalizer:
    """Detect guest language and translate host exact answers via Cloud Translation API v2."""

    def __init__(self, api_key: str | None = None, min_detect_confidence: float | None = None):
        api_key = (api_key or os.environ.get("GOOGLE_TRANSLATE_API_KEY") or "").strip()
        if not api_key:
            raise ValueError("GOOGLE_TRANSLATE_API_KEY is required")

        self._api_key = api_key
        if min_detect_confidence is None:
            raw = os.environ.get("GOOGLE_TRANSLATE_MIN_DETECT_CONFIDENCE", "")
            min_detect_confidence = float(raw) if raw.strip() else DEFAULT_MIN_DETECT_CONFIDENCE
        self._min_detect_confidence = min_detect_confidence

    def localize_answer(self, guest_message: str, host_answer: str) -> str:
        guest_message = (guest_message or "").strip()
        host_answer = (host_answer or "").strip()
        if not guest_message:
            raise ValueError("guest_message is required")
        if not host_answer:
            raise ValueError("host_answer is required")

        target_lang, confidence = self.detect_language(guest_message)
        if confidence < self._min_detect_confidence:
            raise ValueError(
                "guest language detection confidence %.2f below threshold %.2f"
                % (confidence, self._min_detect_confidence)
            )

        source_lang, _ = self.detect_language(host_answer)
        if _same_language(source_lang, target_lang):
            return host_answer

        return self.translate(host_answer, target_language=target_lang)

    def detect_language(self, text: str) -> tuple[str, float]:
        payload = self._post(DETECT_URL, {"q": text})
        detections = payload["data"]["detections"][0]
        best = max(detections, key=lambda row: float(row.get("confidence") or 0))
        return best["language"], float(best.get("confidence") or 0)

    def translate(self, text: str, *, target_language: str) -> str:
        payload = self._post(
            TRANSLATE_URL,
            {
                "q": text,
                "target": target_language,
                "format": "text",
            },
        )
        translated = payload["data"]["translations"][0]["translatedText"]
        return html.unescape(translated)

    def _post(self, url: str, data: dict) -> dict:
        query = urllib.parse.urlencode({"key": self._api_key})
        body = urllib.parse.urlencode(data).encode("utf-8")
        request = urllib.request.Request(
            "%s?%s" % (url, query),
            data=body,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError("Google Translate API error %s: %s" % (exc.code, detail)) from exc


def _same_language(a: str, b: str) -> bool:
    return a.split("-", 1)[0].lower() == b.split("-", 1)[0].lower()
