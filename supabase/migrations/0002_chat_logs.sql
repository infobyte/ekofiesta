-- Chat logs for the eko.party assistant.
--
-- Stores every question/answer exchange from /api/chat so usage can be
-- audited (what people ask, token spend). Written server-side with the
-- service role key only.
--
-- RLS is enabled with NO policies for anon: the anon key can neither read
-- nor write this table (same hardening approach as 0001_parties_rls.sql).
--
-- Run this in the Supabase dashboard SQL editor (or `supabase db push`).

create table if not exists public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lang text not null,
  ip_hash text,                -- sha256 of client IP, to group sessions without storing PII
  question text not null,
  response text,
  input_tokens integer,
  output_tokens integer,
  model text,
  tool_rounds integer
);

create index if not exists chat_logs_created_at_idx on public.chat_logs (created_at desc);

alter table public.chat_logs enable row level security;

-- No policies: anon is denied everything. The service role bypasses RLS.
