export type Edition = 'ekoparty-ba-2026' | 'ekoparty-miami-2027'

// Editions currently accepting party submissions
export const OPEN_EDITIONS: Edition[] = ['ekoparty-miami-2027']

// Edition shown on the homepage listing
export const CURRENT_EDITION: Edition = 'ekoparty-miami-2027'

// Finished editions, shown in the past-editions archive (newest first)
export const PAST_EDITIONS: Edition[] = ['ekoparty-ba-2026']

export type PartyStatus = 'pending' | 'approved' | 'rejected'

export interface Party {
  id: string
  edition: Edition
  name: string
  host: string
  venue: string
  address: string
  description: string
  starts_at: string // ISO 8601 timestamp
  ends_at: string // ISO 8601 timestamp
  rsvp_url: string
  tags: string[] // 'open-invite', 'approval-required', etc.
  submitter_name: string
  submitter_email: string
  status: PartyStatus
  moderated_by?: string // Slack user ID
  moderated_at?: string // ISO 8601 timestamp
  created_at: string
  updated_at: string
}

export interface PartySubmission {
  edition: Edition
  name: string
  host: string
  venue: string
  address: string
  description: string
  starts_at: string
  ends_at: string
  rsvp_url: string
  tags: string[]
  submitter_name: string
  submitter_email: string
}

// ── Ekogroups ────────────────────────────────────────────────────────────────

export type ActivityKind = 'one_shot' | 'monthly'

export type ActivityType = 'meetup' | 'workshop' | 'ctf' | 'talk' | 'social' | 'other'

export const ACTIVITY_TYPES: ActivityType[] = [
  'meetup',
  'workshop',
  'ctf',
  'talk',
  'social',
  'other',
]

export interface EkogroupActivity {
  id: string
  group_slug: string
  title: string
  activity_type: ActivityType
  description: string
  venue: string
  address: string
  signup_url: string
  kind: ActivityKind
  // one_shot
  starts_at: string | null // ISO 8601 timestamp
  ends_at: string | null
  // monthly: same calendar day every month
  day_of_month: number | null // 1-31
  time_start: string | null // 'HH:MM' local to the group's city
  time_end: string | null
  submitter_name: string
  submitter_email: string
  status: PartyStatus
  moderated_by?: string
  moderated_at?: string
  created_at: string
}

export type EkogroupActivitySubmission = Omit<
  EkogroupActivity,
  'id' | 'status' | 'moderated_by' | 'moderated_at' | 'created_at'
>

export interface SlackBlockKitMessage {
  text: string
  blocks: any[]
}

export interface PartyByDay {
  date: string // YYYY-MM-DD
  day: string // e.g., "Thursday, August 7"
  parties: Party[]
}
