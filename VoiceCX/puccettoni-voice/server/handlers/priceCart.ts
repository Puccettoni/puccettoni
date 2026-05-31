import { findItem } from "../menu";
import { log } from "../lib/logger";

interface CartLine {
  name: string;
  size?: string;
  modifiers?: string[];
  quantity: number;
}

const TAX_RATE = parseFloat(process.env.TAX_RATE || "0.07");

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Phase 0: prices computed locally from the menu. In Phase 2 this MUST be replaced
// by a call to the Toast /prices endpoint — Toast is the source of truth for totals
// and tax, and a POST whose amount diverges from /prices forces manual reconciliation.
export async function priceCart(args: { items?: CartLine[]; fulfillment?: string }) {
  const lines = Array.isArray(args.items) ? args.items : [];
  log.info("price_cart", { lines, fulfillment: args.fulfillment });

  const priced: any[] = [];
  let subtotal = 0;
  const notFound: string[] = [];

  for (const line of lines) {
    const item = findItem(line.name);
    const qty = Math.max(1, Number(line.quantity) || 1);
    if (!item) {
      notFound.push(line.name);
      continue;
    }
    const lineTotal = round2(item.price * qty);
    subtotal = round2(subtotal + lineTotal);
    priced.push({
      name: item.name,
      quantity: qty,
      unitPrice: item.price,
      lineTotal,
      ...(line.modifiers && line.modifiers.length ? { modifiers: line.modifiers } : {}),
    });
  }

  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + tax);

  // Simple ETA heuristic for the demo: 15 min base + 2 min per item, capped.
  const itemCount = priced.reduce((n, l) => n + l.quantity, 0);
  const etaMinutes = Math.min(45, 15 + itemCount * 2);

  return {
    currency: "USD",
    lines: priced,
    subtotal,
    taxRate: TAX_RATE,
    tax,
    total,
    pickupEtaMinutes: etaMinutes,
    ...(notFound.length ? { unrecognized: notFound } : {}),
    note: "Phase 0 estimate. Final total will be confirmed by Toast.",
  };
}
