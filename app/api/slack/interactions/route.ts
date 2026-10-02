import { NextRequest, NextResponse } from 'next/server'
import { verifySlackRequest, buildPartyApprovedMessage } from '@/lib/slack'
import { approveParty, rejectParty, getPartyById } from '@/lib/db'
import querystring from 'querystring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const timestamp = request.headers.get('x-slack-request-timestamp') || ''
    const signature = request.headers.get('x-slack-signature') || ''

    // Verify Slack request signature
    if (!verifySlackRequest(timestamp, signature, body)) {
      return NextResponse.json(
        { error: 'Invalid request signature' },
        { status: 403 }
      )
    }

    // Parse the payload
    const payload = querystring.parse(body) as any
    const slackPayload = JSON.parse(payload.payload)

    if (slackPayload.type !== 'block_actions') {
      return NextResponse.json({ ok: true })
    }

    const action = slackPayload.actions[0]
    const [actionType, partyId] = action.value.split(':')
    const userId = slackPayload.user.id

    // Get the party
    const party = await getPartyById(partyId)
    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      )
    }

    // Handle approve or reject
    let updatedParty
    if (actionType === 'approve') {
      updatedParty = await approveParty(partyId, userId)
    } else if (actionType === 'reject') {
      updatedParty = await rejectParty(partyId, userId)
    }

    if (!updatedParty) {
      return NextResponse.json(
        { error: 'Failed to update party status' },
        { status: 500 }
      )
    }

    // Update the original message to show approval/rejection
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🎉 *${party.name}*\n${actionType === 'approve' ? '✅ APPROVED' : '❌ REJECTED'} by <@${userId}>`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Host:*\n${party.host}` },
          { type: 'mrkdwn', text: `*Venue:*\n${party.venue}` },
        ],
      },
    ]

    // Acknowledge with updated message
    return NextResponse.json({
      response_type: 'in_channel',
      replace_original: true,
      blocks: blocks,
      text: actionType === 'approve'
        ? `✅ Party "${party.name}" approved by <@${userId}>`
        : `❌ Party "${party.name}" rejected by <@${userId}>`,
    })
  } catch (error) {
    console.error('Slack interaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
