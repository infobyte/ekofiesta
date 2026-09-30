'use client'

import { useState } from 'react'
import Link from 'next/link'

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
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()) || [],
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-eko-900 text-white py-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-eko-100 hover:text-white mb-4 inline-block">
            ← Back to listing
          </Link>
          <h1 className="text-4xl font-bold">Submit a Party</h1>
          <p className="text-eko-100 mt-2">Add your event to the official EkoParty listing</p>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700">
              ✅ Party submitted successfully! It will appear after review.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
              ❌ {error}
            </div>
          )}

          {/* Edition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Edition *</label>
            <select
              name="edition"
              defaultValue="ekoparty-ba-2026"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
            >
              <option value="ekoparty-ba-2026">EkoParty Buenos Aires 2026</option>
              <option value="ekoparty-miami-2026">EkoParty Miami 2026</option>
            </select>
          </div>

          {/* Event Details */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Event Details</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Red Team Summit Happy Hour"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Host/Organization *</label>
                <input
                  type="text"
                  name="host"
                  placeholder="e.g., Acme Security"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name *</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g., La Boca Bar & Lounge"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Tell us about your party... (200 chars max)"
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
              />
            </div>
          </fieldset>

          {/* Date & Time */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Date & Time</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="ends_at"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>
            </div>
          </fieldset>

          {/* RSVP & Tags */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 mb-4">RSVP & Tags</legend>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">RSVP URL *</label>
              <input
                type="url"
                name="rsvp_url"
                placeholder="https://..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., open-invite, approval-required"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
              />
            </div>
          </fieldset>

          {/* Submitter Info */}
          <fieldset className="border border-gray-200 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Your Information</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="submitter_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
                <input
                  type="email"
                  name="submitter_email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-eko-600"
                />
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-eko-600 hover:bg-eko-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {loading ? 'Submitting...' : '📝 Submit Party'}
            </button>
            <Link
              href="/"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
