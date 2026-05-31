import { log } from "../lib/logger";

// Phase 0: we acknowledge and log. In production, prefer Vapi's built-in transferCall
// tool (return a destination), or have this endpoint return a transfer destination so
// Vapi connects the caller to STORE_TRANSFER_NUMBER.
export async function transferToHuman(args: { reason?: string }) {
  const destination = process.env.STORE_TRANSFER_NUMBER || "";
  log.info("transfer_to_human", { reason: args.reason, destination: destination || "(unset)" });

  return {
    transfer: true,
    destination: destination || null,
    message: destination
      ? "One moment — connecting you to the restaurant."
      : "I'll have someone from the restaurant follow up shortly.",
  };
}
