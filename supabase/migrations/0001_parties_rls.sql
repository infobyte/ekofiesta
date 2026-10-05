-- Lock down the parties table with Row Level Security.
--
-- Problem: the anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) ships to anyone, and
-- without RLS it can read EVERY row — including pending/rejected submissions
-- and submitter emails — straight from the Supabase REST API.
--
-- After this migration:
--   - anon can only SELECT approved parties (and never submitter PII — use
--     column selection in clients, RLS is row-level only).
--   - anon can INSERT new submissions, but only with status 'pending'.
--   - anon cannot UPDATE or DELETE anything.
--   - Moderation (approve/reject, listing pending) must use the service role
--     key, which bypasses RLS. See lib/db.ts (SUPABASE_SERVICE_ROLE_KEY).
--
-- Run this in the Supabase dashboard SQL editor (or `supabase db push`).

alter table public.parties enable row level security;

-- Drop any permissive leftovers from previous setups.
drop policy if exists "public read" on public.parties;
drop policy if exists "anon_select_approved" on public.parties;
drop policy if exists "anon_insert_pending" on public.parties;

create policy "anon_select_approved"
  on public.parties
  for select
  to anon
  using (status = 'approved');

create policy "anon_insert_pending"
  on public.parties
  for insert
  to anon
  with check (status = 'pending');

-- No UPDATE/DELETE policies for anon: those operations are denied by default
-- once RLS is enabled. The service role bypasses RLS for moderation.
