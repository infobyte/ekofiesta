-- Expose only public, non-PII columns of approved parties via a view.
--
-- anon/authenticated read public.public_parties instead of the raw table, so
-- submitter_name, submitter_email and moderator/Slack columns are never exposed.
-- lib/db.ts must read from 'public_parties'. Moderation uses the service role.

create or replace view public.public_parties as
select
  id,
  created_at,
  edition,
  name,
  host,
  venue,
  address,
  description,
  starts_at,
  ends_at,
  rsvp_url,
  tags,
  status
from public.parties
where status = 'approved';

grant select on public.public_parties to anon, authenticated;

drop policy if exists "anon_select_approved" on public.parties;
revoke select on public.parties from anon;
