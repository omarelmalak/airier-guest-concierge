// Basic Twilio-friendly phone validation.
// Twilio expects E.164: "+" followed by country code and subscriber number,
// with *no* spaces or formatting, e.g. "+15551234567".

export function normalizePhone(input: string): string {
  // Keep this around in case we later want to auto-normalize before send.
  return input.replace(/[^\d+]/g, "");
}

export function isValidTwilioPhone(input: string): boolean {
  const raw = input.trim();
  // Strict E.164 check: no spaces, no dashes, just + and digits.
  return /^\+\d{10,15}$/.test(raw);
}

