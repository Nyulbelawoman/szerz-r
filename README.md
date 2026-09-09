# SzerzŐr

> Ne hagyja, hogy az apró betűk csapdába ejtsék.

A mobile-friendly web app where you upload (or paste) a contract you've already
signed, and SzerzŐr shows you the **traps** in plain language, extracts every
**deadline** you need to act on, and **reminds** you before it's too late.

## What it does

1. **Red Flag Report** — AI flags risky/one-sided clauses (auto-renewal,
   arbitration + opt-out windows, cancellation notice windows, price increases,
   early-termination fees, etc.), each with the exact quoted text, a plain-English
   explanation, and a "what to do" tip.
2. **Deadline extraction** — finds renewal/expiration dates and notice windows, and
   computes the *effective* "act-by" date (e.g. "cancel 60 days before May 2").
3. **Escalating reminders** — tiers at 90/60/30/14/7/3/1/0 days before the act-by date.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript + Tailwind CSS 3
- **Claude (Anthropic)** via direct `fetch` to the Messages API, with structured JSON output
- **PDF upload** via `unpdf` (Mozilla pdf.js) with `.txt`/`.md` fallback
- **SQLite** via Node's built-in `node:sqlite` (no native modules)
- **Auth** via `crypto.scrypt` password hashing + HMAC-signed session cookie (swap for
  Clerk/Auth0 in production)
- **Stripe** integration point (stub until `STRIPE_SECRET_KEY` is set)

## Quick start

```bash
npm install
# optional: copy .env.example to .env.local and set ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. Without an `ANTHROPIC_API_KEY`, the analyzer falls back
to a keyword-based demo so the whole flow still works end-to-end.

## Not legal advice

SzerzŐr is a review aid, not a lawyer. Always verify flagged clauses yourself and
consult an attorney for important decisions.

## Privacy

Contracts are sensitive. By default Anthropic does **not** train on API data. Local
data (SQLite) lives under `./data` and is git-ignored. For production, encrypt at rest
and use an Anthropic zero-retention arrangement.
