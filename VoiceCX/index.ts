import "dotenv/config";
import express from "express";

import { parseToolCalls, toResultString, VapiResult } from "./lib/vapi";
import { log } from "./lib/logger";
import { isOpenNow } from "./lib/hours";

import { checkAvailability } from "./handlers/checkAvailability";
import { priceCart } from "./handlers/priceCart";
import { submitOrder } from "./handlers/submitOrder";
import { transferToHuman } from "./handlers/transferToHuman";
import { sendConfirmationSms } from "./handlers/sendConfirmationSms";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Map tool name -> handler. Names must match agent/tools.json.
const HANDLERS: Record<string, (args: any) => Promise<unknown>> = {
  check_availability: checkAvailability,
  price_cart: priceCart,
  submit_order: submitOrder,
  transfer_to_human: transferToHuman,
  send_confirmation_sms: sendConfirmationSms,
};

// Health check
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "puccettoni-voice", openNow: isOpenNow() });
});

// Single webhook for all Vapi tool calls. Point the assistant's server URL (or each
// tool's server.url) at POST /vapi/tools.
app.post("/vapi/tools", async (req, res) => {
  const calls = parseToolCalls(req.body);

  if (calls.length === 0) {
    // Not a tool-calls message (could be status-update, end-of-call-report, etc.).
    // Acknowledge with 200 so Vapi is happy.
    return res.status(200).json({ results: [] });
  }

  const results: VapiResult[] = [];
  for (const call of calls) {
    const handler = HANDLERS[call.name];
    if (!handler) {
      log.warn(`No handler for tool "${call.name}".`);
      results.push({
        toolCallId: call.id,
        result: toResultString(`Sorry, I can't do that right now.`),
      });
      continue;
    }
    try {
      const out = await handler(call.args);
      results.push({ toolCallId: call.id, result: toResultString(out) });
    } catch (err) {
      log.error(`Handler "${call.name}" threw.`, err);
      // Per Vapi: still return 200 and a string result.
      results.push({
        toolCallId: call.id,
        result: toResultString("Something went wrong on our side, but I've got it noted."),
      });
    }
  }

  // Always HTTP 200 — any other status makes Vapi ignore the response.
  res.status(200).json({ results });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  log.info(`Puccettoni voice backend listening on :${PORT}`);
  log.info(`Webhook: POST http://localhost:${PORT}/vapi/tools`);
});
