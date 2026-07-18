# brianchenhaov2

Second iteration of [brianchenhao.com](https://brianchenhao.com) — a
single-page React + Vite portfolio with a rigged 3D character whose head
follows the cursor, scroll-driven animation throughout, and a Gemini-backed
chat box.

What changed from v1:

- **Animation everywhere** — [Motion](https://motion.dev) drives scroll
  reveals, staggered card/chip entrances, a shared-layout nav underline, a
  springed scroll-progress bar, word-by-word hero headline, timeline dot
  pings, and hover lifts. All of it collapses to plain fades under
  `prefers-reduced-motion`.
- **Backend moved to Supabase** — the v1 FastAPI + Cloudflare Tunnel backend
  is replaced by a single Supabase Edge Function
  ([`supabase/functions/chat`](supabase/functions/chat/index.ts)) that
  validates input, rate-limits per IP via a Postgres table (RLS-locked,
  service-role only), and proxies to Gemini.
- **Hosted on Vercel** — static frontend, no servers to keep alive.

## Stack

React 19 · Vite · Tailwind v4 · Motion · react-three-fiber ·
Supabase Edge Functions (Deno) · Gemini 2.5 Flash · Vercel

## Local dev

```sh
npm install
cp .env.example .env   # fill in the Supabase URL + anon key
npm run dev
```

## Backend

The edge function needs one secret on the Supabase project:

```sh
supabase secrets set GEMINI_API_KEY=...
# optional: GEMINI_MODEL (defaults to gemini-2.5-flash)
```

The rate-limit table is created by the `create_chat_requests` migration —
RLS is enabled with no policies, so only the edge function (service role)
can read or write it.
