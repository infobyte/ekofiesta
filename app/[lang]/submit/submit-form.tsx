'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dictionary } from '../dictionaries'

type SubmitDict = Dictionary['submit']

const inputClass =
  'w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'

const labelClass = 'mb-2 block text-sm font-semibold text-gray-700'

export default function SubmitForm({ t, lang }: { t: SubmitDict; lang: string }) {
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
      tags: (formData.get('tags') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
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
        setError(errorData.error || t.errorGeneric)
      }
    } catch (err) {
      setError(t.errorGeneric)
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
            href={`/${lang}`}
            className="mb-6 inline-block text-sm text-gray-500 transition hover:text-gray-900"
          >
            {t.back}
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t.title1} <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mt-4 text-gray-500">{t.subtitle}</p>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {success && (
            <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-green-800">
              {t.success}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
              ❌ {error}
            </div>
          )}

          {/* Edition */}
          <div>
            <label className={labelClass}>{t.edition}</label>
            <select name="edition" defaultValue="ekoparty-ba-2026" required className={inputClass}>
              <option value="ekoparty-ba-2026">{t.editionBA}</option>
              <option value="ekoparty-miami-2026">{t.editionMiami}</option>
            </select>
          </div>

          {/* Event details */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">{t.sectionEvent}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>{t.eventName}</label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.eventNamePlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.host}</label>
                <input
                  type="text"
                  name="host"
                  placeholder={t.hostPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.venue}</label>
                <input
                  type="text"
                  name="venue"
                  placeholder={t.venuePlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.address}</label>
                <input
                  type="text"
                  name="address"
                  placeholder={t.addressPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-5">
              <label className={labelClass}>{t.description}</label>
              <textarea
                name="description"
                placeholder={t.descriptionPlaceholder}
                maxLength={200}
                rows={3}
                className={inputClass}
              />
            </div>
          </section>

          {/* Date & time */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">{t.sectionDateTime}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>{t.starts}</label>
                <input type="datetime-local" name="starts_at" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t.ends}</label>
                <input type="datetime-local" name="ends_at" required className={inputClass} />
              </div>
            </div>
          </section>

          {/* RSVP & tags */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">{t.sectionRsvp}</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t.rsvpUrl}</label>
                <input
                  type="url"
                  name="rsvp_url"
                  placeholder="https://..."
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.tags}</label>
                <input
                  type="text"
                  name="tags"
                  placeholder={t.tagsPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Submitter */}
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">{t.sectionYou}</h2>
            <p className="mb-5 text-sm text-gray-500">{t.youNote}</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>{t.yourName}</label>
                <input type="text" name="submitter_name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t.yourEmail}</label>
                <input type="email" name="submitter_email" required className={inputClass} />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:shadow-purple-300 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? t.submitting : t.submitButton}
            </button>
            <Link
              href={`/${lang}`}
              className="font-medium text-gray-500 transition hover:text-gray-900"
            >
              {t.cancel}
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
