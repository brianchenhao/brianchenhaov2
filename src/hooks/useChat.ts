import { useState } from 'react'

// Roles mirror Gemini's vocabulary so we can pass the history straight through
// to the backend without remapping. Keep this matched to
// supabase/functions/chat/index.ts.
export type ChatTurn = {
  role: 'user' | 'model'
  content: string
}

// The chat backend is a Supabase Edge Function. Both values are public
// (anon key + project URL) and inlined at build time by Vite.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined

// Backend enforces this at 6; we trim before sending so a long conversation
// keeps working instead of erroring once the seventh turn is in state.
const MAX_HISTORY_TURNS = 6

type ChatResponse = { reply: string }
type ErrorBody = { detail?: string; error?: string }

export function useChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('chat backend not configured')
      return
    }

    const history = messages.slice(-MAX_HISTORY_TURNS)
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message: trimmed, history }),
      })

      if (res.status === 429) {
        throw new Error('rate limit reached — try again in an hour')
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as ErrorBody | null
        const reason = body?.detail ?? body?.error ?? `${res.status}`
        throw new Error(`request failed (${reason})`)
      }

      const data = (await res.json()) as ChatResponse
      setMessages((prev) => [...prev, { role: 'model', content: data.reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, error, send }
}
