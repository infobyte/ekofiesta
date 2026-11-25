import crypto from 'crypto'
import type { EkogroupActivity, Party, SlackBlockKitMessage } from './types'
import { getEkogroup } from './ekogroups'

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

// Slack mrkdwn only treats &, < and > as control characters; escape them so
// user-submitted text cannot create links, mentions or broadcasts.
export function escapeMrkdwn(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeSlackUrl(value: unknown): string {
  return escapeMrkdwn(value).replace(/\|/g, '%7C')
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
    text: `New party submission: ${escapeMrkdwn(party.name)}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Party Submission*\n🎉 *${escapeMrkdwn(party.name)}*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Edition:*\n${escapeMrkdwn(party.edition)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Host:*\n${escapeMrkdwn(party.host)}`,
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
            text: `*Venue:*\n${escapeMrkdwn(party.venue)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Address:*\n${escapeMrkdwn(party.address)}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${escapeMrkdwn(party.description)}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Submitted by:*\n${escapeMrkdwn(party.submitter_name)} &lt;${escapeMrkdwn(party.submitter_email)}&gt;`,
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
    text: `Party approved: ${escapeMrkdwn(party.name)}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *${escapeMrkdwn(party.name)}* approved by <@${moderator}>`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${escapeSlackUrl(party.rsvp_url)}|View Party>`,
        },
      },
    ],
  }
}

export function buildActivityPendingMessage(activity: EkogroupActivity): SlackBlockKitMessage {
  const group = getEkogroup(activity.group_slug)
  const groupName = group ? `${group.flag} ${group.name}` : activity.group_slug

  const schedule =
    activity.kind === 'monthly'
      ? `Every month, day ${activity.day_of_month}` +
        (activity.time_start ? ` · ${activity.time_start}${activity.time_end ? `-${activity.time_end}` : ''}` : '')
      : `${new Date(activity.starts_at!).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`

  return {
    text: `New ekogroup activity: ${escapeMrkdwn(activity.title)}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Ekogroup Activity*\n📅 *${escapeMrkdwn(activity.title)}*`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Group:*\n${escapeMrkdwn(groupName)}` },
          { type: 'mrkdwn', text: `*Type:*\n${escapeMrkdwn(activity.activity_type)}` },
          { type: 'mrkdwn', text: `*Schedule:*\n${escapeMrkdwn(schedule)}` },
          { type: 'mrkdwn', text: `*Venue:*\n${escapeMrkdwn(activity.venue || '—')}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${escapeMrkdwn(activity.description || '—')}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Submitted by:*\n${escapeMrkdwn(activity.submitter_name)} &lt;${escapeMrkdwn(activity.submitter_email)}&gt;`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            value: `approve_act:${activity.id}`,
            action_id: `approve_act_${activity.id}`,
            style: 'primary',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Reject' },
            value: `reject_act:${activity.id}`,
            action_id: `reject_act_${activity.id}`,
            style: 'danger',
          },
        ],
      },
      { type: 'divider' },
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
