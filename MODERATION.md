# Slack Moderation Guide

Once the site is live, moderators manage all party submissions through Slack.

## How It Works

1. **Someone submits a party** via the form on the site
2. **A message appears in `#ekoparty-parties`** with all the details:
   - Party name, date, time, venue, address
   - Host / organization
   - Description and RSVP link
   - Submitter name and email
3. **Moderators click Approve or Reject**
4. **Approved parties appear on the site immediately**

## Workflow

### Review a Submission

When a new message appears in `#ekoparty-parties`:

1. Read the party details carefully
2. Check the venue address is real (Google Maps)
3. Verify the RSVP URL works
4. Look for spam (obviously fake parties, inappropriate content)

### Approve a Party

Click the **✅ Approve** button on the Slack message.

- The button turns green
- The message updates to show who approved it and when
- The party **appears on the site immediately** — attendees can see it

### Reject a Party

Click the **❌ Reject** button on the Slack message.

- The button turns red
- The message updates to show who rejected it and when
- The party **never appears on the site**
- The submitter is **not notified** (we may add email later)

## Tips

- **Spam parties?** Reject immediately. Examples: casino ads, cryptocurrency scams, unrelated events.
- **Incomplete info?** Check if the venue/time seem reasonable. If it looks like a mistake, reject and ask the user to resubmit with better details.
- **Unsure?** Ask in `#ekoparty-general` or `#moderation` before approving something borderline.
- **Double approvals?** If two moderators approve the same party, don't worry — the database prevents duplicates.

## Viewing All Submissions

To see all pending parties:

1. Go to the Slack app → **Home** (or message the EkoParty Bot with `pending`)
2. This shows a list of all unapproved submissions

(Note: this feature will be added in a future update if needed)

## FAQ

**Q: Can I edit a party after approving it?**
Not from Slack, but a moderator with database access can. For now, ask the submitter to resubmit with corrections.

**Q: What if someone submits a duplicate party?**
The form doesn't prevent duplicates (we may add deduplication later). If you spot one, reject the duplicate and approve the first one.

**Q: How do I see rejected parties?**
Only visible in the Slack message history. Rejected parties never appear on the site.

**Q: Can attendees see the moderation status?**
No. They only see approved parties on the site. There's no notification system (yet).

## Channel Setup

Make sure `#ekoparty-parties` exists and:
- ✅ The EkoParty Bot is a member (it should be after the first submission)
- ✅ Moderators have access (they need to see and click the buttons)
- ✅ It's readable by the team (keep it public or invite the mod group)

## Troubleshooting

**Buttons don't work?**
- Refresh Slack (sometimes the app needs to reload)
- Check that the bot is still installed (`Settings → Installed apps`)

**No submissions appearing?**
- Check the form is accessible and working (`/submit` page)
- Look at browser console for errors
- Verify Supabase has a row in the `parties` table with `status = 'pending'`

**Slack token expired?**
- This shouldn't happen (webhook tokens don't expire), but if submissions stop appearing:
  1. Go to the Slack app in `api.slack.com`
  2. Regenerate the Incoming Webhook
  3. Update `SLACK_WEBHOOK_URL` in the deployment environment
