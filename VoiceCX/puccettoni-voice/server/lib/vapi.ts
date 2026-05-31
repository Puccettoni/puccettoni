// Helpers for the Vapi custom-tool webhook contract.
//
// Request: Vapi POSTs { message: { type: "tool-calls", toolCallList: [...] } }.
//   Each tool call: { id, function: { name, arguments } }. `arguments` may be an
//   object or a JSON string depending on version — we handle both.
//
// Response: { results: [ { toolCallId, result } ] }
//   IMPORTANT (per Vapi docs): `result` MUST be a single-line string, and the
//   endpoint MUST return HTTP 200 even on error, or Vapi ignores the response.

export interface ParsedToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface VapiResult {
  toolCallId: string;
  result: string;
}

export function parseToolCalls(body: any): ParsedToolCall[] {
  const message = body?.message ?? {};
  const raw = message.toolCallList ?? message.toolCalls ?? [];
  if (!Array.isArray(raw)) return [];

  return raw.map((tc: any) => {
    const fn = tc.function ?? {};
    let args = fn.arguments ?? tc.arguments ?? {};
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch {
        args = {};
      }
    }
    return {
      id: tc.id ?? tc.toolCallId ?? "",
      name: fn.name ?? tc.name ?? "",
      args: args ?? {},
    };
  });
}

// Coerce any handler output into the required single-line string.
export function toResultString(value: unknown): string {
  if (typeof value === "string") return value.replace(/\s*\n\s*/g, " ").trim();
  try {
    return JSON.stringify(value); // JSON.stringify is single-line by default
  } catch {
    return String(value);
  }
}
