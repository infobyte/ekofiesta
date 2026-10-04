'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from './dictionaries'

type ChatDict = Dictionary['chat']

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget({ t, lang }: { t: ChatDict; lang: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const history = [...messages, { role: 'user' as const, content: text }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, messages: history }),
      })

      if (!res.ok) {
        const msg = res.status === 429 ? t.rateLimited : t.error
        setMessages([...history, { role: 'assistant', content: msg }])
        return
      }

      // Stream plain-text response progressively
      setMessages([...history, { role: 'assistant', content: '' }])
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages([...history, { role: 'assistant', content: acc }])
      }
      if (!acc.trim()) {
        setMessages([...history, { role: 'assistant', content: t.error }])
      }
    } catch {
      setMessages([...history, { role: 'assistant', content: t.error }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? t.close : t.open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl shadow-purple-500/30 transition hover:brightness-110"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-surface-border bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-4 text-white">
            <p className="text-sm font-bold">{t.title}</p>
            <p className="mt-0.5 text-xs text-white/80">{t.subtitle}</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <Bubble role="assistant">{t.greeting}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <Bubble role="assistant">
                <span className="animate-pulse text-gray-400">{t.thinking}</span>
              </Bubble>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={e => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2 border-t border-surface-border p-3"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.placeholder}
              maxLength={500}
              className="min-w-0 flex-1 rounded-full border border-surface-border bg-surface px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={t.send}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white transition hover:brightness-110 disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-gradient-to-r from-purple-600 to-pink-500 text-white'
            : 'rounded-bl-md bg-surface-raised text-gray-800'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
