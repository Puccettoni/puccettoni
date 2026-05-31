// Minimal structured logger. In production, swap for pino/winston and persist
// transcripts + metrics for the Marco dashboard.

function ts(): string {
  return new Date().toISOString();
}

export const log = {
  info(msg: string, data?: unknown) {
    console.log(`[${ts()}] ${msg}${data !== undefined ? " " + safe(data) : ""}`);
  },
  warn(msg: string, data?: unknown) {
    console.warn(`[${ts()}] WARN ${msg}${data !== undefined ? " " + safe(data) : ""}`);
  },
  error(msg: string, data?: unknown) {
    console.error(`[${ts()}] ERROR ${msg}${data !== undefined ? " " + safe(data) : ""}`);
  },
};

function safe(data: unknown): string {
  try {
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch {
    return String(data);
  }
}
