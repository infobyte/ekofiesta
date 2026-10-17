'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dictionary } from '../../dictionaries'
import { EKOGROUPS } from '@/lib/ekogroups'
import { ACTIVITY_TYPES } from '@/lib/types'

type SubmitDict = Dictionary['ekogroupsSubmit']
type TypeLabels = Dictionary['ekogroups']['types']

const inputClass =
  'w-full rounded-2xl border border-surface-border bg-white px-4 py-3 text-gray-900 placeholder-gray-300 shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10'

const labelClass = 'mb-2 block text-sm font-semibold text-gray-700'

export default function ActivityForm({
  t,
  types,
  lang,
}: {
  t: SubmitDict
  types: TypeLabels
  lang: string
}) {
  const [kind, setKind] = useState<'one_shot' | 'monthly'>('one_shot')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {
      group_slug: fd.get('group_slug'),
      title: fd.get('title'),
      activity_type: fd.get('activity_type'),
      description: fd.get('description'),
      venue: fd.get('venue'),
      address: fd.get('address'),
      signup_url: fd.get('signup_url'),
      kind,
      submitter_name: fd.get('submitter_name'),
      submitter_email: fd.get('submitter_email'),
    }

    if (kind === 'one_shot') {
      data.starts_at = fd.get('starts_at')
      data.ends_at = fd.get('ends_at')
    } else {
      data.day_of_month = Number(fd.get('day_of_month'))
      data.time_start = fd.get('time_start') || null
      data.time_end = fd.get('time_end') || null
    }

    try {
      const res = await fetch('/api/ekogroups/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSuccess(true)
        e.currentTarget.reset()
        setKind('one_shot')
        setTimeout(() => setSuccess(false), 6000)
      } else {
        const body = await res.json()
        setError(body.error || t.errorGeneric)
      }
    } catch {
      setError(t.errorGeneric)
    } finally {
      setLoading(false)
    }
  }

  const kindBtn = (value: 'one_shot' | 'monthly', label: string) => (
    <button
      type="button"
      onClick={() => setKind(value)}
      className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
        kind === value
          ? 'border-purple-500 bg-purple-50 text-purple-700 ring-4 ring-purple-500/10'
          : 'border-surface-border bg-white text-gray-500 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="min-h-screen bg-surface">
      <header className="hero-mesh">
        <div className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
          <Link
            href={`/${lang}/ekogroups`}
            className="mb-6 inline-block text-sm text-gray-500 transition hover:text-gray-900"
          >
            {t.back}
          </Link>
          <h1 className="text-[2rem] font-bold leading-[1.08] tracking-tighter text-gray-900 sm:text-5xl md:text-6xl">
            {t.title1} <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mt-4 text-pretty text-gray-500 sm:text-lg">{t.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Group */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-lg font-bold tracking-tight text-gray-900">{t.sectionGroup}</h2>
            <label className={labelClass}>{t.group}</label>
            <select name="group_slug" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                —
              </option>
              {EKOGROUPS.map(g => (
                <option key={g.slug} value={g.slug}>
                  {g.flag} {g.name} ({g.country})
                </option>
              ))}
            </select>
          </section>

          {/* Activity */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-lg font-bold tracking-tight text-gray-900">
              {t.sectionActivity}
            </h2>
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>{t.activityTitle}</label>
                  <input
                    type="text"
                    name="title"
                    required
                    maxLength={120}
                    placeholder={t.activityTitlePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t.activityType}</label>
                  <select name="activity_type" defaultValue="meetup" className={inputClass}>
                    {ACTIVITY_TYPES.map(type => (
                      <option key={type} value={type}>
                        {(types as Record<string, string>)[type] || type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>{t.description}</label>
                <textarea
                  name="description"
                  maxLength={500}
                  rows={3}
                  placeholder={t.descriptionPlaceholder}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>{t.venue}</label>
                  <input
                    type="text"
                    name="venue"
                    maxLength={120}
                    placeholder={t.venuePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t.address}</label>
                  <input
                    type="text"
                    name="address"
                    maxLength={200}
                    placeholder={t.addressPlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t.signupUrl}</label>
                <input
                  type="url"
                  name="signup_url"
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* When */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-lg font-bold tracking-tight text-gray-900">{t.sectionWhen}</h2>
            <label className={labelClass}>{t.kind}</label>
            <div className="mb-5 flex gap-3">
              {kindBtn('one_shot', t.kindOneShot)}
              {kindBtn('monthly', t.kindMonthly)}
            </div>

            {kind === 'one_shot' ? (
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
            ) : (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>{t.dayOfMonth}</label>
                  <input
                    type="number"
                    name="day_of_month"
                    min={1}
                    max={31}
                    required
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">{t.dayOfMonthHint}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t.timeStart}</label>
                    <input type="time" name="time_start" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.timeEnd}</label>
                    <input type="time" name="time_end" className={inputClass} />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Submitter */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-lg font-bold tracking-tight text-gray-900">{t.sectionYou}</h2>
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

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-500/25 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? t.submitting : t.submitButton}
            </button>
            <Link
              href={`/${lang}/ekogroups`}
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
