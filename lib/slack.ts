import crypto from 'crypto'
import type { Party, SlackBlockKitMessage } from './types'

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || ''
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''

export function verifySlackRequest(
  timestamp: string,
  signature: string,
  body: string
): boolean {
  if (!SLACK_SIGNING_SECRET) {
    console.warn('SLACK_SIGNING_SECRET not configured, skipping verification')
    return true // Allow in development
  }

  const baseString = `v0:${timestamp}:${body}`
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET)
  const computedSignature = 'v0=' + hmac.update(baseString).digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  )
}

export function buildPartyPendingMessage(party: Party): SlackBlockKitMessage {
  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return {
    text: `New party submission: ${party.name}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Party Submission*\n🎉 *${party.name}*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Edition:*\n${party.edition}`,
          },
          {
            type: 'mrkdwn',
            text: `*Host:*\n${party.host}`,
          },
          {
            type: 'mrkdwn',
            text: `*Date:*\n${formatDate(party.starts_at)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${formatTime(party.starts_at)} - ${formatTime(party.ends_at)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Venue:*\n${party.venue}`,
          },
          {
            type: 'mrkdwn',
            text: `*Address:*\n${party.address}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${party.description}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Submitted by:*\n${party.submitter_name} <${party.submitter_email}>`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✅ Approve',
            },
            value: `approve:${party.id}`,
            action_id: `approve_${party.id}`,
            style: 'primary',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❌ Reject',
            },
            value: `reject:${party.id}`,
            action_id: `reject_${party.id}`,
            style: 'danger',
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  }
}

export function buildPartyApprovedMessage(
  party: Party,
  moderator: string
): SlackBlockKitMessage {
  return {
    text: `Party approved: ${party.name}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *${party.name}* approved by <@${moderator}>`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${party.rsvp_url}|View Party>`,
        },
      },
    ],
  }
}

export async function postToSlack(message: SlackBlockKitMessage): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL not configured, message not posted')
    return false
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to post to Slack:', error)
    return false
  }
}
