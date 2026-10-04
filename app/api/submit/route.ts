import { NextRequest, NextResponse } from 'next/server'
import { submitParty, getPendingParties } from '@/lib/db'
import { buildPartyPendingMessage, postToSlack } from '@/lib/slack'
import { OPEN_EDITIONS } from '@/lib/types'
import type { Edition, PartySubmission } from '@/lib/types'

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

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
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
      rsvp_url: body.rsvp_url.trim(),
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
