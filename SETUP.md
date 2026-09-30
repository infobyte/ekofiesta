# EkoParty Setup Guide

Follow these steps to get the site running with real Supabase + Slack integration.

## Phase 1: Create Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `eko-party`, pick a region (South America if possible)
3. Wait for it to be created (1-2 min)
4. In the left sidebar, click **SQL Editor**
5. Click **New Query** and paste this entire migration:

```sql
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition TEXT NOT NULL,
  name TEXT NOT NULL,
  host TEXT NOT NULL,
  venue TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  rsvp_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  moderated_by TEXT,
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parties_edition_status ON parties(edition, status);
CREATE INDEX idx_parties_starts_at ON parties(starts_at);
CREATE INDEX idx_parties_status ON parties(status);
```

6. Click **RUN** (green button)
7. Now go to **Settings → API** (left sidebar)
8. Copy and save these two values somewhere:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Phase 2: Create Slack App (10 min)

### A. Create the App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App → From an app manifest**
3. Pick your workspace
4. Paste this manifest:

```json
{
  "display_information": {
    "name": "EkoParty Parties",
    "description": "Party listing moderation for EkoParty"
  },
  "features": {
    "bot_user": {
      "display_name": "EkoParty Bot",
      "always_online": false
    }
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "chat:write",
        "chat:write.public"
      ]
    }
  },
  "settings": {
    "interactivity": {
      "is_enabled": true,
      "request_url": "http://localhost:3000/api/slack/interactions"
    }
  }
}
```

5. Click **Create**

### B. Install & Get Webhook

1. In the left menu, click **Install App**
2. Click **Install to Workspace** (or **Allow** if prompted)
3. **Copy the Bot User OAuth Token** — starts with `xoxb-` → save as `SLACK_WEBHOOK_URL` (we'll update this in the next step)

4. Still in the app page, click **Incoming Webhooks** (left menu)
5. Click **Add New Webhook to Workspace**
6. Pick your `#ekoparty-parties` channel (or create it first in Slack)
7. **Copy the Webhook URL** (starts with `https://hooks.slack.com/...`) → save as `SLACK_WEBHOOK_URL`

### C. Get the Signing Secret

1. Go to **Basic Information** (left menu)
2. Scroll down to **App Credentials**
3. **Copy the Signing Secret** → save as `SLACK_SIGNING_SECRET`

## Phase 3: Configure Local Environment (2 min)

1. In the project root, copy the env template:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXX
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxx
```

## Phase 4: Test Locally (2 min)

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. You should see:

- **Home page** — empty party list (no approved parties yet)
- **Submit a Party button** — click it to test the form
- Fill in test party data and submit
- Check your `#ekoparty-parties` Slack channel — you should see a message with ✅ Approve / ❌ Reject buttons

Click **Approve** in Slack → the party should appear on the home page instantly.

## Phase 5: Deploy to Vercel (5 min)

When you're ready to go live:

```bash
npm install -g vercel
vercel
```

Follow the prompts. During setup, **add your `.env.local` values as environment variables**.

After deploy, you MUST update your Slack app's interactivity URL:
1. Go back to [api.slack.com/apps](https://api.slack.com/apps) → your EkoParty app
2. Click **Interactivity & Shortcuts**
3. Change **Request URL** from `http://localhost:3000/api/slack/interactions` to your Vercel domain: `https://your-domain.vercel.app/api/slack/interactions`
4. Click **Save**

## Troubleshooting

### Supabase returns "Forbidden"
- Check that you're using the **anon key**, not the service key
- Verify `NEXT_PUBLIC_SUPABASE_URL` includes the full URL (not just the project name)

### Slack doesn't post
- Verify the webhook URL is correct (copy from Slack app → Incoming Webhooks)
- Check the channel in Slack is public and the bot is a member
- Look at the browser console for network errors when you submit a party

### Form submission fails
- Check browser console (F12) for error messages
- Verify Supabase env vars are set in `.env.local`
- Make sure the `parties` table exists in Supabase

### Slack buttons don't work
- Verify `SLACK_SIGNING_SECRET` is correct
- Check that interactivity URL is set in the Slack app
- For local testing, the URL must be `http://localhost:3000/api/slack/interactions`
- Use a tool like [ngrok](https://ngrok.com) to expose your local port to the internet if needed

## Next Steps

1. Customize the colors/styling in `tailwind.config.ts`
2. Add more editions to `/app/submit/page.tsx` (Miami 2026, etc.)
3. Set up a custom domain instead of Vercel's default
4. Add email confirmations when parties are approved
5. Create a moderator dashboard to view all submissions

See `README.md` for API documentation and architecture details.
