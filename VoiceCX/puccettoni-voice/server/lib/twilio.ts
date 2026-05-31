// Thin Twilio wrapper. If credentials are missing (Phase 0 local demo), it logs
// instead of sending — so the whole flow runs end-to-end without secrets.

import { log } from "./logger";

const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_PHONE_NUMBER;

let client: any = null;
if (SID && TOKEN) {
  // Lazy require so the dep isn't needed at boot when running without creds.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const twilio = require("twilio");
  client = twilio(SID, TOKEN);
  log.info("Twilio client initialized.");
} else {
  log.warn("Twilio credentials missing — SMS/transfer will be logged, not sent (Phase 0 mode).");
}

export async function sendSms(to: string, body: string): Promise<{ sent: boolean; sid?: string }> {
  if (!to) {
    log.warn("sendSms called without a destination number.");
    return { sent: false };
  }
  if (!client || !FROM) {
    log.info(`[SMS MOCK] to=${to} body="${body}"`);
    return { sent: false };
  }
  try {
    const msg = await client.messages.create({ to, from: FROM, body });
    log.info(`SMS sent to ${to} (sid=${msg.sid}).`);
    return { sent: true, sid: msg.sid };
  } catch (err) {
    log.error("SMS send failed.", err);
    return { sent: false };
  }
}
