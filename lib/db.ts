import { createClient } from '@supabase/supabase-js'
import type { Party, PartySubmission, Edition } from './types'

let supabase: any = null
let supabaseAdmin: any = null

function getSupabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  supabase = createClient(supabaseUrl, supabaseKey)
  return supabase
}

// Server-only client for submissions and moderation. With RLS enabled
// (supabase/migrations/0001_parties_rls.sql) the anon key can no longer read
// pending rows or update statuses, so these flows need the service role key.
// Falls back to the anon client so the app keeps working until the key is set.
function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon client. Submissions and moderation will break once RLS is enabled.'
    )
    return getSupabase()
  }

  supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
  return supabaseAdmin
}

export async function submitParty(submission: PartySubmission): Promise<Party | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('parties')
    .insert({
      edition: submission.edition,
      name: submission.name,
      host: submission.host,
      venue: submission.venue,
      address: submission.address,
      description: submission.description,
      starts_at: submission.starts_at,
      ends_at: submission.ends_at,
      rsvp_url: submission.rsvp_url,
      tags: submission.tags,
      submitter_name: submission.submitter_name,
      submitter_email: submission.submitter_email,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to submit party:', error)
    return null
  }

  return data as Party
}

export async function getApprovedPartiesByEdition(edition: Edition): Promise<Party[]> {
  const { data, error } = await getSupabase()
    .from('parties')
    .select('*')
    .eq('edition', edition)
    .eq('status', 'approved')
    .order('starts_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch parties:', error)
    return []
  }

  return (data || []) as Party[]
}

export async function getPendingParties(edition?: Edition): Promise<Party[]> {
  let query = getSupabaseAdmin()
    .from('parties')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (edition) {
    query = query.eq('edition', edition)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch pending parties:', error)
    return []
  }

  return (data || []) as Party[]
}

export async function approveParty(
  partyId: string,
  moderatedBy: string
): Promise<Party | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('parties')
    .update({
      status: 'approved',
      moderated_by: moderatedBy,
      moderated_at: new Date().toISOString(),
    })
    .eq('id', partyId)
    .select()
    .single()

  if (error) {
    console.error('Failed to approve party:', error)
    return null
  }

  return data as Party
}

export async function rejectParty(
  partyId: string,
  moderatedBy: string
): Promise<Party | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('parties')
    .update({
      status: 'rejected',
      moderated_by: moderatedBy,
      moderated_at: new Date().toISOString(),
    })
    .eq('id', partyId)
    .select()
    .single()

  if (error) {
    console.error('Failed to reject party:', error)
    return null
  }

  return data as Party
}

export async function getPartyById(partyId: string): Promise<Party | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('parties')
    .select('*')
    .eq('id', partyId)
    .single()

  if (error) {
    console.error('Failed to fetch party:', error)
    return null
  }

  return data as Party
}
