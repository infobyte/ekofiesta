export type Edition = 'ekoparty-ba-2026' | 'ekoparty-miami-2027'

// Editions currently accepting party submissions
export const OPEN_EDITIONS: Edition[] = ['ekoparty-ba-2026']

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

export interface SlackBlockKitMessage {
  text: string
  blocks: any[]
}

export interface PartyByDay {
  date: string // YYYY-MM-DD
  day: string // e.g., "Thursday, August 7"
  parties: Party[]
}
