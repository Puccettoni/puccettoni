import { sendSms } from "../lib/twilio";
import { log } from "../lib/logger";

export async function sendConfirmationSms(args: { phone?: string; summary?: string }) {
  log.info("send_confirmation_sms", { phone: args.phone });
  if (!args.phone || !args.summary) {
    return { sent: false, message: "Missing phone or summary." };
  }
  const body = `Puccettoni — ${args.summary}`;
  const res = await sendSms(args.phone, body);
  return {
    sent: res.sent,
    message: res.sent ? "Confirmation text sent." : "Confirmation logged (SMS not configured).",
  };
}
