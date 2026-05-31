import { isOpenNow, nextOpenNote } from "../lib/hours";
import { sendSms } from "../lib/twilio";
import { log } from "../lib/logger";

interface OrderLine {
  name: string;
  size?: string;
  modifiers?: string[];
  quantity: number;
}

interface SubmitArgs {
  items?: OrderLine[];
  customer_name?: string;
  customer_phone?: string;
  fulfillment?: string;
  pickup_time?: string;
  notes?: string;
}

let orderCounterSeed = 1040; // demo order numbering
function nextOrderNumber(): number {
  orderCounterSeed += 1;
  return orderCounterSeed;
}

function formatTicket(orderNo: number, args: SubmitArgs): string {
  const lines = (args.items || [])
    .map((l) => {
      const mods = l.modifiers && l.modifiers.length ? ` (${l.modifiers.join(", ")})` : "";
      const size = l.size ? ` ${l.size}` : "";
      return `${l.quantity}x ${l.name}${size}${mods}`;
    })
    .join(" | ");
  const when = args.pickup_time && args.pickup_time !== "asap" ? args.pickup_time : "ASAP";
  const notes = args.notes ? ` | NOTE: ${args.notes}` : "";
  return `PUCCETTONI #${orderNo} PICKUP ${when} — ${args.customer_name ?? "Guest"} ${args.customer_phone ?? ""}: ${lines}${notes}`;
}

// Phase 0: "send to kitchen" = log + SMS a formatted ticket to KITCHEN_BRIDGE_SMS_TO.
// Phase 2: replace the body with: pull config -> /prices -> POST order to Toast (-> KDS).
//          On any Toast failure, call the bridge below (this same SMS path) + alert.
export async function submitOrder(args: SubmitArgs) {
  log.info("submit_order", args);

  // Hours guard — Toast won't check this for us.
  if (!isOpenNow()) {
    log.warn("submit_order attempted while closed.");
    return {
      accepted: false,
      reason: "closed",
      message: `The kitchen is closed right now — ${nextOpenNote()}. I can take this as a scheduled order or connect you to someone.`,
    };
  }

  const orderNumber = nextOrderNumber();
  const ticket = formatTicket(orderNumber, args);

  // Kitchen handoff (Phase 0 bridge). In Phase 2 this is the fallback, not the primary path.
  const kitchenTo = process.env.KITCHEN_BRIDGE_SMS_TO || "";
  const sms = await sendSms(kitchenTo, ticket);

  log.info(`Order #${orderNumber} sent to kitchen.`, { ticket, smsSent: sms.sent });

  return {
    accepted: true,
    orderNumber,
    fulfillment: "pickup",
    pickupTime: args.pickup_time || "asap",
    routedToKitchen: true,
    channel: sms.sent ? "sms" : "mock",
    message: `Order #${orderNumber} is in. It's been sent to the kitchen.`,
  };
}
