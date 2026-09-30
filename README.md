# EkoParty Official Party Listing

A conference party listing and management system for EkoParty events, with Slack-based moderation.

## Features

- **Public party listing** grouped by day and time
- **Party submission form** with validation
- **Slack-based moderation** with Approve/Reject buttons
- **Multi-edition support** (BA 2026, Miami 2026, etc.)
- **Real-time updates** — approved parties appear on the site instantly

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + React + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (hosted PostgreSQL)
- **Moderation:** Slack with Block Kit interactive messages
- **Hosting:** Vercel (recommended)

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run this migration to create the `parties` table:

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
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderated_by TEXT,
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_parties_edition_status ON parties(edition, status);
CREATE INDEX idx_parties_starts_at ON parties(starts_at);
CREATE INDEX idx_parties_status ON parties(status);
```

3. Copy your Supabase URL and Anon Key from **Settings → API**

### 3. Set Up Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From an app manifest** and paste:

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
      "request_url": "https://your-domain.com/api/slack/interactions"
    }
  }
}
```

3. Go to **Install App** and copy the **Bot User OAuth Token** (starts with `xoxb-`)
4. Go to **Incoming Webhooks** → Create New Webhook → select a channel (`#ekoparty-parties`)
5. Copy the Webhook URL

### 4. Environment Setup

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in the values:
   - `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Settings
   - `SLACK_WEBHOOK_URL` — from Slack Incoming Webhooks
   - `SLACK_SIGNING_SECRET` — from Slack App → Basic Information → Signing Secret

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage

### For Attendees

1. Visit the site and browse parties grouped by day
2. Click **Submit a Party** to add a new party
3. Fill in the form and submit
4. Party appears in Slack channel for moderation

### For Moderators (in Slack)

1. New submissions appear in `#ekoparty-parties` with party details
2. Click **✅ Approve** to make it public
3. Click **❌ Reject** to remove it
4. Approved parties appear on the site instantly

## API Endpoints

### `POST /api/submit`

Submit a new party.

**Request Body:**
```json
{
  "edition": "ekoparty-ba-2026",
  "name": "Red Team Summit After Party",
  "host": "Acme Security",
  "venue": "La Boca Bar",
  "address": "Calle Balcarce 200, La Boca, Buenos Aires",
  "description": "Join us for drinks and networking after the talks!",
  "starts_at": "2026-08-08T22:00:00",
  "ends_at": "2026-08-09T03:00:00",
  "rsvp_url": "https://eventbrite.com/...",
  "tags": ["open-invite"],
  "submitter_name": "Jane Doe",
  "submitter_email": "jane@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Party submitted successfully!",
  "partyId": "uuid-here"
}
```

### `POST /api/slack/interactions`

Slack button interactions (automatic, no manual calls needed).

## Database Schema

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `edition` | TEXT | e.g., `ekoparty-ba-2026` |
| `name` | TEXT | Party name |
| `host` | TEXT | Hosting organization |
| `venue` | TEXT | Venue name |
| `address` | TEXT | Full address |
| `description` | TEXT | Short description |
| `starts_at` | TIMESTAMPTZ | ISO 8601 datetime |
| `ends_at` | TIMESTAMPTZ | ISO 8601 datetime |
| `rsvp_url` | TEXT | Link to RSVP |
| `tags` | TEXT[] | Array of tags |
| `submitter_name` | TEXT | Who submitted |
| `submitter_email` | TEXT | Contact email |
| `status` | TEXT | `pending`, `approved`, or `rejected` |
| `moderated_by` | TEXT | Slack user ID of moderator |
| `moderated_at` | TIMESTAMPTZ | When it was moderated |
| `created_at` | TIMESTAMPTZ | Submission time |
| `updated_at` | TIMESTAMPTZ | Last update time |

## Deployment

### To Vercel

```bash
npm install -g vercel
vercel
```

During setup, add environment variables from `.env.local`.

### To Slack Interactivity URL

After deploying, update your Slack app's interactivity URL:
1. Go to Slack App → Interactivity & Shortcuts
2. Update **Request URL** to your production endpoint: `https://your-domain.com/api/slack/interactions`

## Customization

- **Editions:** Add new editions in `/app/submit/page.tsx` and `/lib/types.ts`
- **Styling:** Edit Tailwind colors in `tailwind.config.ts`
- **Slack Message:** Customize Block Kit in `lib/slack.ts` / `buildPartyPendingMessage()`
- **Database:** Add fields to the `parties` table and update TypeScript types

## Troubleshooting

### Parties not showing up?

1. Check Supabase console — are they in the `parties` table?
2. Verify `status = 'approved'`
3. Check browser Network tab for API errors

### Slack not posting?

1. Verify `SLACK_WEBHOOK_URL` is correct
2. Check Slack channel (`#ekoparty-parties`) has the bot added
3. Look at server logs for errors

### Form submission fails?

1. Check browser console for error messages
2. Verify `.env.local` has correct Supabase keys
3. Ensure Supabase table exists and has correct schema

## License

MIT — Built with ❤️ for the EkoParty community
