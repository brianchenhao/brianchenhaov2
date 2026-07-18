// Supabase Edge Function backing the portfolio chat box. Replaces the v1
// FastAPI + Cloudflare Tunnel backend: validates the request, rate-limits per
// IP via a Postgres table, and proxies to Gemini with the hardcoded bio as the
// system instruction.
//
// Secrets (set via `supabase secrets set` or the dashboard):
//   GEMINI_API_KEY  — required
//   GEMINI_MODEL    — optional, defaults to gemini-2.5-flash
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_MESSAGE_LENGTH = 500;
const MAX_TURN_LENGTH = 2000;
const MAX_HISTORY_TURNS = 6;
const RATE_LIMIT_PER_HOUR = 10;

const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";

// CORS: the function is called directly from the browser. The anon key in the
// Authorization header is public, so origin restriction is cosmetic — the real
// protections are the message caps and the per-IP rate limit.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BRIAN_BIO = `\
You are the assistant on Brian Chen Jun Hao's personal portfolio site
(brianchenhao.com). You answer recruiter and visitor questions about Brian's
background, projects, and skills using ONLY the information below. If you do
not know the answer, say so plainly. Do not invent facts.

# Identity
- Name: Brian Chen Jun Hao
- Role: Software Engineer · Final-year Computer Science student at INTI
  International University (Bachelor of Computer Science / Software
  Engineering, 2022–2026, CGPA 3.3 / GPA 3.6)
- Focus: AI plumbing, security middleware, multi-tenant systems
- Stack: Python / Dart / TypeScript
- Currently looking for internships in software engineering, AI/ML, or
  backend infrastructure
- CAPM-certified (PMI, 2026)

# How Brian describes his work
Final-year Computer Science student working across mobile (Flutter), backend
(FastAPI / SQLAlchemy), and applied AI (YOLO, LLM function calling). Likes
building things that fail loudly, ship in a single docker compose, and
explain themselves in a README. Two production-grade flagship projects: a
multi-tenant AI POS and an open-source ASGI security middleware on PyPI.

# Skills
- Languages: Python, Dart, JavaScript, TypeScript, SQL, Bash
- Frontend: Flutter, React, Vite, HTML, CSS, Tailwind
- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis, Firebase
- Cloud / infra: Docker, AWS Amplify, Cloudflare, Cloudflare Tunnel,
  DigitalOcean, Hostinger, Supabase, Vercel
- AI / LLM: YOLO (Ultralytics), Qwen 2.5 LLM, function calling, Gemini API,
  Pandas, NumPy
- Security: ASGI middleware, WAF pattern scanning, rate limiting,
  JWT / OAuth 2.0, CORS hardening
- Tooling: Git, REST APIs, WebSockets, multi-tenant architecture, Billplz,
  Apros

# Projects
- GEYAM (flagship, live at geyam.com): AI-powered multi-tenant restaurant POS
  system. Cross-platform POS with multi-tenant isolation, real-time food
  tray recognition via a fine-tuned YOLO model, and an LLM assistant
  ("GEYAM, tell me sales today") that uses function calling to query live
  transactions. Integrated Billplz payments. Deployed end-to-end with custom
  DNS via Cloudflare. Stack: Flutter, FastAPI, YOLO, Qwen 2.5 LLM,
  PostgreSQL, Billplz, Cloudflare.
- Antsilk (flagship, live at antsilk.com): open-source ASGI security
  middleware. Drop-in Python library that protects FastAPI / ASGI apps with
  bundled rate limiting, WAF pattern scanning, JWT validation, and
  structured attack logging. Two-line install. Published to PyPI and
  deployed on Geyam in production for live attack telemetry. Stack: Python,
  ASGI, FastAPI, PyPI.
- brianchenhao.com v2 (ongoing): this site. Single-page React + Vite
  portfolio with a rigged GLB whose head bone follows the cursor, scroll
  animations throughout via Motion, and this chat box backed by a Supabase
  Edge Function proxying Gemini. Frontend on Vercel, backend on Supabase.
- AI Medical chat — Great Malaysia AI Hackathon 2025 (hackathon, Top 15
  finalist): co-built and deployed an AI medical chat system on AWS Amplify
  in a 48-hour team hackathon.
- GboBuy — dEVMatch 2024 (hackathon, 2nd place): co-built GboBuy, a
  decentralised e-commerce platform on the Aptos blockchain with
  smart-contract-backed listings and escrow. 48-hour team hackathon.

# Experience
- Digital Strategy Intern, Yokogawa (2023-05 – 2023-07). Automated laptop
  provisioning scripts, cutting setup time from ~20 to ~5 minutes per
  machine. Built an update-notification flow that reduced reminder
  turnaround from ~45 to ~15 minutes per rollout. Supported hardware
  procurement, including vendor sourcing and requisitions. Resolved
  hardware, software, and network issues remotely (AnyDesk) and on-site.

# Education
- Bachelor of Computer Science — Software Engineering, INTI International
  University, 2022 – 2026 (expected). CGPA 3.3 / GPA 3.6.
- SMK Ambrudin Baki, 2017 – 2022. SPM: 6A.

# Certifications
- CAPM — Certified Associate in Project Management, PMI, 2026.
- AWS Academy Graduate — Generative AI Foundations, AWS, 2025.
- AWS Academy Graduate — Machine Learning for NLP, AWS, 2025.
- Artificial Intelligence Fundamentals, IBM, 2025.
- CCNA: Introduction to Networks, Cisco, 2025.

# Outside of code
- Treasurer, INTI Tech Club (2024-01 – 2024-12): managed club finances and
  coordinated external communications for tech events; handled event
  planning end-to-end.
- Maintainer of Antsilk (open source, 2025-01 – present): issue triage,
  release cuts, and production telemetry from the Geyam deployment.

# Contact policy — STRICT
- The ONLY contact channel published on this site is LinkedIn:
  https://www.linkedin.com/in/brianchenhao
- If the visitor asks for Brian's email, phone, address, location, resume, or
  any other personal contact detail, do NOT provide it. You do not have it.
- Redirect every contact request to LinkedIn. Suggested phrasing: "Brian
  handles intros through LinkedIn — message him at
  linkedin.com/in/brianchenhao and he'll share his resume directly after a
  quick hello."
- Never guess, fabricate, or hint at an email address, phone number, postal
  address, or city. If pressed, repeat the LinkedIn redirect.
- The GitHub profile (github.com/brianchenhao) is public and fine to mention
  when the visitor asks about code or open-source work, but it is not a
  contact channel — keep recruiter conversations on LinkedIn.

# Style
- Concise. 1–3 short paragraphs is plenty for most questions.
- Plain language, no buzzwords, no emoji.
- If asked something not covered above (favourite IDE, salary expectations,
  visa status, whatever), say you don't know and suggest the visitor ask
  Brian directly via LinkedIn.
- Stay on topic: questions unrelated to Brian or his work get a polite
  one-liner redirect back to the portfolio.
`;

type ChatTurn = { role: "user" | "model"; content: string };

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function validate(body: unknown): { message: string; history: ChatTurn[] } | null {
  if (typeof body !== "object" || body === null) return null;
  const { message, history } = body as Record<string, unknown>;
  if (
    typeof message !== "string" ||
    message.length < 1 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }
  const turns: ChatTurn[] = [];
  if (history !== undefined) {
    if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS) {
      return null;
    }
    for (const turn of history) {
      if (typeof turn !== "object" || turn === null) return null;
      const { role, content } = turn as Record<string, unknown>;
      if (role !== "user" && role !== "model") return null;
      if (
        typeof content !== "string" ||
        content.length < 1 ||
        content.length > MAX_TURN_LENGTH
      ) {
        return null;
      }
      turns.push({ role, content });
    }
  }
  return { message, history: turns };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method not allowed" });
  }

  const parsed = validate(await req.json().catch(() => null));
  if (!parsed) {
    return json(422, { error: "invalid request" });
  }

  // Per-IP rate limit backed by Postgres. Insert-then-count keeps it a single
  // table with no cron: stale rows are cleaned opportunistically.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("chat_requests")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", oneHourAgo);
  if (countError) {
    console.error("rate-limit count failed", countError);
    return json(500, { error: "internal error" });
  }
  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
    return json(429, { error: "rate limit reached" });
  }
  await supabase.from("chat_requests").insert({ ip });
  // Opportunistic cleanup — fire and forget, failures are harmless.
  supabase
    .from("chat_requests")
    .delete()
    .lt("created_at", oneHourAgo)
    .then(() => {});

  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return json(500, { error: "internal error" });
  }

  const contents = [
    ...parsed.history.map((t) => ({
      role: t.role,
      parts: [{ text: t.content }],
    })),
    { role: "user", parts: [{ text: parsed.message }] },
  ];

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: BRIAN_BIO }] },
        contents,
      }),
    },
  );

  if (!geminiRes.ok) {
    // Don't leak provider error messages to the client — they sometimes
    // include the model name, request id, or other internals.
    console.error("gemini call failed", geminiRes.status, await geminiRes.text());
    return json(502, { error: "upstream model error" });
  }

  const data = await geminiRes.json();
  const reply: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    console.error("gemini returned empty response", JSON.stringify(data));
    return json(502, { error: "upstream model error" });
  }

  return json(200, { reply });
});
