import { NextRequest, NextResponse } from 'next/server'
import { submitParty, getPendingParties } from '@/lib/db'
import { buildPartyPendingMessage, postToSlack } from '@/lib/slack'
import { OPEN_EDITIONS } from '@/lib/types'
import type { Edition, PartySubmission } from '@/lib/types'
import { sanitizeHttpUrl } from '@/lib/url'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = [
      'edition',
      'name',
      'host',
      'venue',
      'address',
      'starts_at',
      'ends_at',
      'rsvp_url',
      'submitter_name',
      'submitter_email',
    ]

    const missing = required.filter((field) => !body[field])
    if (missing.length > 0) {
      console.warn('submit validation failed, missing fields:', missing)
      return NextResponse.json(
        { error: 'Invalid submission: required fields are missing' },
        { status: 400 }
      )
    }

    // Only editions open for submissions (Miami 2027 is announced but not open yet)
    if (!OPEN_EDITIONS.includes(body.edition as Edition)) {
      return NextResponse.json(
        { error: 'This edition is not accepting submissions yet' },
        { status: 400 }
      )
    }

    // Validate dates
    const startTime = new Date(body.starts_at).getTime()
    const endTime = new Date(body.ends_at).getTime()
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.submitter_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const rsvpUrl = sanitizeHttpUrl(body.rsvp_url)
    if (!rsvpUrl) {
      return NextResponse.json(
        { error: 'rsvp_url must be a valid http(s) URL' },
        { status: 400 }
      )
    }

    // Create submission
    const submission: PartySubmission = {
      edition: body.edition,
      name: body.name.trim(),
      host: body.host.trim(),
      venue: body.venue.trim(),
      address: body.address.trim(),
      description: body.description?.trim() || '',
      starts_at: body.starts_at,
      ends_at: body.ends_at,
      rsvp_url: rsvpUrl,
      tags: body.tags || [],
      submitter_name: body.submitter_name.trim(),
      submitter_email: body.submitter_email.trim(),
    }

    // Submit to database
    const party = await submitParty(submission)
    if (!party) {
      return NextResponse.json(
        { error: 'Failed to submit party' },
        { status: 500 }
      )
    }

    // Post to Slack
    const slackMessage = buildPartyPendingMessage(party)
    await postToSlack(slackMessage)

    return NextResponse.json({
      success: true,
      message: 'Party submitted successfully! Check Slack for moderation.',
      partyId: party.id,
    })
  } catch (error) {
    console.error('Submit endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
