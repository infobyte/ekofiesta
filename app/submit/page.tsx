'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputClass =
  'w-full rounded-xl border border-surface-border bg-surface px-4 py-2.5 text-white placeholder-gray-600 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'

const labelClass = 'mb-2 block text-sm font-semibold text-gray-300'

export default function SubmitParty() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      edition: formData.get('edition'),
      name: formData.get('name'),
      host: formData.get('host'),
      venue: formData.get('venue'),
      address: formData.get('address'),
      description: formData.get('description'),
      starts_at: formData.get('starts_at'),
      ends_at: formData.get('ends_at'),
      rsvp_url: formData.get('rsvp_url'),
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
      submitter_name: formData.get('submitter_name'),
      submitter_email: formData.get('submitter_email'),
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccess(true)
        e.currentTarget.reset()
        setTimeout(() => setSuccess(false), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit party')
      }
    } catch (err) {
      setError('Failed to submit party. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="hero-glow border-b border-surface-border">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-16">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to all parties
          </Link>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Submit <span className="text-gradient">your party</span>
          </h1>
          <p className="mt-4 text-gray-400">
            Add your event to the official EkoParty listing. Submissions are reviewed before
            going live.
          </p>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
              ✅ Party submitted! It will appear on the site once approved.
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              ❌ {error}
            </div>
          )}

          {/* Edition */}
          <div>
            <label className={labelClass}>Edition *</label>
            <select name="edition" defaultValue="ekoparty-ba-2026" required className={inputClass}>
              <option value="ekoparty-ba-2026">EkoParty Buenos Aires 2026</option>
              <option value="ekoparty-miami-2026">EkoParty Miami 2026</option>
            </select>
          </div>

          {/* Event details */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-white">Event details</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Event name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Red Team Happy Hour"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Host / organization *</label>
                <input
                  type="text"
                  name="host"
                  placeholder="Acme Security"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Venue *</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="La Boca Bar & Lounge"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Balcarce 200, San Telmo"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-5">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                placeholder="Tell attendees what to expect (200 chars max)"
                maxLength={200}
                rows={3}
                className={inputClass}
              />
            </div>
          </section>

          {/* Date & time */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-white">Date & time</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Starts *</label>
                <input type="datetime-local" name="starts_at" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ends *</label>
                <input type="datetime-local" name="ends_at" required className={inputClass} />
              </div>
            </div>
          </section>

          {/* RSVP & tags */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-white">RSVP & tags</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>RSVP URL *</label>
                <input
                  type="url"
                  name="rsvp_url"
                  placeholder="https://..."
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="open-invite, approval-required"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Submitter */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-white">Your information</h2>
            <p className="mb-5 text-sm text-gray-500">
              Only used by moderators to contact you — never shown publicly.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Your name *</label>
                <input type="text" name="submitter_name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Your email *</label>
                <input type="email" name="submitter_email" required className={inputClass} />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 px-8 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/50 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Submitting…' : 'Submit party →'}
            </button>
            <Link href="/" className="font-medium text-gray-400 transition hover:text-white">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
