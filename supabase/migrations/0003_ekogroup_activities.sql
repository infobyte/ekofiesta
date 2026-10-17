-- Activities calendar for the ekogroups (local ekoparty communities).
--
-- Any ekogroup can submit an activity; it shows on the shared monthly
-- calendar once approved. Two kinds:
--   - one_shot: happens once (starts_at / ends_at timestamps)
--   - monthly:  repeats every month on the same calendar day
--               (day_of_month + time_start / time_end, local to the group)
--
-- Moderation mirrors parties: anon inserts pending rows and reads approved
-- ones; approve/reject goes through the service role (Slack buttons).
--
-- Run this in the Supabase dashboard SQL editor (or `supabase db push`).

create table if not exists public.ekogroup_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  group_slug text not null,
  title text not null,
  activity_type text not null default 'meetup'
    check (activity_type in ('meetup', 'workshop', 'ctf', 'talk', 'social', 'other')),
  description text not null default '',
  venue text not null default '',
  address text not null default '',
  signup_url text not null default '',
  kind text not null check (kind in ('one_shot', 'monthly')),
  -- one_shot fields
  starts_at timestamptz,
  ends_at timestamptz,
  -- monthly fields
  day_of_month integer check (day_of_month between 1 and 31),
  time_start text,
  time_end text,
  submitter_name text not null,
  submitter_email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderated_by text,
  moderated_at timestamptz,
  -- each kind must carry its own schedule fields
  constraint one_shot_has_dates check (kind <> 'one_shot' or (starts_at is not null and ends_at is not null)),
  constraint monthly_has_day check (kind <> 'monthly' or day_of_month is not null)
);

create index if not exists ekogroup_activities_status_idx
  on public.ekogroup_activities (status, starts_at);

alter table public.ekogroup_activities enable row level security;

drop policy if exists "anon_select_approved" on public.ekogroup_activities;
drop policy if exists "anon_insert_pending" on public.ekogroup_activities;

create policy "anon_select_approved"
  on public.ekogroup_activities
  for select
  to anon
  using (status = 'approved');

create policy "anon_insert_pending"
  on public.ekogroup_activities
  for insert
  to anon
  with check (status = 'pending');

-- No UPDATE/DELETE for anon; the service role bypasses RLS for moderation.
