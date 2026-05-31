# Puccettoni Voice — Phase 0 (demo)

Backend that powers the Puccettoni voice ordering agent. It's the webhook **Vapi** calls
whenever the agent uses a tool (check availability, price the cart, submit the order, transfer,
send SMS). Phase 0 runs **without Toast and without secrets** — availability and pricing are
mocked, and "send to kitchen" sends an SMS ticket (or just logs it if Twilio isn't configured).

See `../puccettoni-voice-CONTEXT.md` for the full development context and the phase plan.

## What's real vs mocked (Phase 0)

| Tool | Phase 0 | Phase 2 (later) |
|---|---|---|
| `check_availability` | matches the static menu; `EIGHTY_SIX` env marks sold-out items | live 86/stock from Toast |
| `price_cart` | local subtotal + tax + ETA estimate | **Toast `/prices`** (source of truth) |
| `submit_order` | order #, log, SMS "kitchen ticket" | **Toast Orders API POST** → KDS (SMS becomes the failover bridge) |
| `transfer_to_human` | logs + returns destination | Vapi `transferCall` to staff line |
| `send_confirmation_sms` | Twilio (or log) | same |

## Run it

```bash
npm install
cp .env.example .env      # optional: fill TWILIO_* + KITCHEN_BRIDGE_SMS_TO to send real SMS
npm run dev               # starts on http://localhost:3000
```

Health check:

```bash
curl localhost:3000/
```

## Test the tools without a phone call

Simulate the exact payload Vapi sends. Availability:

```bash
curl -s -X POST localhost:3000/vapi/tools \
  -H 'Content-Type: application/json' \
  -d '{"message":{"type":"tool-calls","toolCallList":[{"id":"c1","function":{"name":"check_availability","arguments":{"items":["margherita","truffle pizza","calzone"]}}}]}}'
```

Price a cart:

```bash
curl -s -X POST localhost:3000/vapi/tools \
  -H 'Content-Type: application/json' \
  -d '{"message":{"type":"tool-calls","toolCallList":[{"id":"c2","function":{"name":"price_cart","arguments":{"fulfillment":"pickup","items":[{"name":"Margherita Classic","quantity":2},{"name":"Tiramisu","quantity":1}]}}}]}}'
```

Submit an order (note: blocked if the store is closed — see hours):

```bash
curl -s -X POST localhost:3000/vapi/tools \
  -H 'Content-Type: application/json' \
  -d '{"message":{"type":"tool-calls","toolCallList":[{"id":"c3","function":{"name":"submit_order","arguments":{"fulfillment":"pickup","pickup_time":"asap","customer_name":"Maria","customer_phone":"+19545551234","items":[{"name":"Pepperoni","quantity":1}]}}}]}}'
```

## Wire it to Vapi (to take real calls)

1. Expose the server publicly (Vapi can't reach localhost):
   - `ngrok http 3000`  → copy the https URL, or
   - `vapi listen` (Vapi CLI tunnel).
2. In `agent/vapi-assistant.json`, replace every `https://YOUR_PUBLIC_URL/vapi/tools` with your URL.
3. Fill the two placeholders:
   - `voice.voiceId` → an ElevenLabs voice id (pick a warm one; multilingual model is already set).
   - `model.model` → confirm the current Claude Sonnet id available in your Vapi account.
4. Create the assistant from this config (Vapi dashboard or API), attach a Twilio number, and call it.

> Multilingual transcription is set to Deepgram `nova-3` / `multi`. If that combo isn't available
> in your account, fall back to `nova-2` with language detection or a fixed language.

## Notes

- The webhook always returns **HTTP 200** and a single-line string `result` per tool call —
  required by Vapi or the response is ignored.
- Hours are enforced here (ET), because the Toast Orders API does not check them.
- No card data is ever collected. Payment is on pickup in v1.
