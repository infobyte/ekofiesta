import { NextRequest, NextResponse } from 'next/server'
import { submitEkogroupActivity } from '@/lib/db'
import { buildActivityPendingMessage, postToSlack } from '@/lib/slack'
import { getEkogroup } from '@/lib/ekogroups'
import { ACTIVITY_TYPES, type ActivityType, type EkogroupActivitySubmission } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    for (const field of ['group_slug', 'title', 'kind', 'submitter_name', 'submitter_email']) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    if (!getEkogroup(body.group_slug)) {
      return NextResponse.json({ error: 'Unknown ekogroup' }, { status: 400 })
    }

    const activityType: ActivityType = ACTIVITY_TYPES.includes(body.activity_type)
      ? body.activity_type
      : 'meetup'

    const kind = body.kind
    if (kind !== 'one_shot' && kind !== 'monthly') {
      return NextResponse.json({ error: 'kind must be one_shot or monthly' }, { status: 400 })
    }

    if (kind === 'one_shot') {
      const start = new Date(body.starts_at).getTime()
      const end = new Date(body.ends_at).getTime()
      if (!body.starts_at || !body.ends_at || isNaN(start) || isNaN(end)) {
        return NextResponse.json(
          { error: 'One-shot activities need starts_at and ends_at' },
          { status: 400 }
        )
      }
      if (end <= start) {
        return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
      }
    } else {
      const day = Number(body.day_of_month)
      if (!Number.isInteger(day) || day < 1 || day > 31) {
        return NextResponse.json(
          { error: 'Monthly activities need day_of_month between 1 and 31' },
          { status: 400 }
        )
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.submitter_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const timeRegex = /^\d{2}:\d{2}$/
    const cleanTime = (v: unknown) => (typeof v === 'string' && timeRegex.test(v) ? v : null)

    const submission: EkogroupActivitySubmission = {
      group_slug: body.group_slug,
      title: String(body.title).trim().slice(0, 120),
      activity_type: activityType,
      description: String(body.description || '').trim().slice(0, 500),
      venue: String(body.venue || '').trim().slice(0, 120),
      address: String(body.address || '').trim().slice(0, 200),
      signup_url: String(body.signup_url || '').trim().slice(0, 300),
      kind,
      starts_at: kind === 'one_shot' ? body.starts_at : null,
      ends_at: kind === 'one_shot' ? body.ends_at : null,
      day_of_month: kind === 'monthly' ? Number(body.day_of_month) : null,
      time_start: kind === 'monthly' ? cleanTime(body.time_start) : null,
      time_end: kind === 'monthly' ? cleanTime(body.time_end) : null,
      submitter_name: String(body.submitter_name).trim().slice(0, 80),
      submitter_email: String(body.submitter_email).trim(),
    }

    const activity = await submitEkogroupActivity(submission)
    if (!activity) {
      return NextResponse.json({ error: 'Failed to submit activity' }, { status: 500 })
    }

    await postToSlack(buildActivityPendingMessage(activity))

    return NextResponse.json({
      success: true,
      message: 'Activity submitted! It will appear on the calendar once approved.',
      activityId: activity.id,
    })
  } catch (error) {
    console.error('Ekogroups submit endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
