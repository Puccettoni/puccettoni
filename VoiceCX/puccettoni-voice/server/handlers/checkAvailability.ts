import { findItem } from "../menu";
import { log } from "../lib/logger";

// Phase 0: availability is mocked. Items listed in EIGHTY_SIX (env) are unavailable.
// Phase 2: replace with a real-time check against Toast stock / 86 status.
function eightySixList(): string[] {
  return (process.env.EIGHTY_SIX || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function checkAvailability(args: { items?: string[] }) {
  const items = Array.isArray(args.items) ? args.items : [];
  const eightySix = eightySixList();
  log.info("check_availability", { items });

  const results = items.map((query) => {
    const item = findItem(query);
    if (!item) {
      return { query, found: false, available: false, message: "not on the menu" };
    }
    const unavailable = eightySix.includes(item.name.toLowerCase());
    return {
      query,
      found: true,
      name: item.name,
      price: item.price,
      available: !unavailable,
      ...(unavailable ? { message: "currently sold out" } : {}),
    };
  });

  return { items: results };
}
