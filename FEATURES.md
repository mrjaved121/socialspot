# SocialSpot — Feature List

**One upload. Five apps. One click.**
You add a photo or video and a caption once, and SocialSpot posts it to
Facebook, Instagram, YouTube, TikTok and X at the same time.

Design rule for every screen: a 10th-grade student should understand it
without help. Plain words, big buttons, one main action per screen.

---

## Version 1 (MVP) — build first

### 1. Connect accounts
- Connect each app once with its own login button (Facebook, Instagram, YouTube, TikTok, X)
- See which apps are connected (green) and which need attention (orange)
- "Reconnect" button when a login expires (TikTok every day, Meta about every 60 days — refreshed automatically in the background)
- Disconnect an app any time

### 2. Create a post (the main screen)
Three simple steps on one page:
1. **Add your photo or video** — drag & drop or tap to choose (JPG, PNG, MP4)
2. **Write your caption** — one caption for all apps
   - Live character counter for each app (X turns red after 280)
   - Optional "Short caption for X" if the main one is too long
   - "YouTube title" box appears only when YouTube is selected
3. **Choose where to post** — tap the app cards on/off (all on by default)

Then pick **Post now** or **Schedule for later**.

Smart warnings (in plain language, before posting):
- "YouTube only accepts videos. Add a video or turn YouTube off."
- "Your caption is too long for X. Add a short caption for X."
- "Instagram works best with square or tall photos."
- "Video is longer than 2 min 20 sec — X won't accept it."

### 3. Preview
- See how the post will look on each app (switch between app tabs)

### 4. Posting progress & results
- After clicking Post: a live list showing each app → Sending… → Posted ✅ / Failed ❌
- If one app fails, the others still post
- "Try again" button for just the failed app
- "View post" link for each app once posted

### 5. Scheduled posts (Calendar)
- Month calendar showing scheduled and posted items
- Tap a day to see its posts
- Edit, reschedule or delete a scheduled post

### 6. All posts (History)
- List of every post with a status badge per app
- Filters: All · Posted · Scheduled · Failed
- Search by caption

### 7. Home
- "Create a post" big button
- What's posting today
- Any problems that need attention (failed post, expired login)
- Last 5 posts

### 8. Settings
- Your time zone (Asia/Dubai, Asia/Karachi…)
- Apps selected by default
- Default posting time

---

## Version 2 — after MVP works
- **Multiple brands / clients** (workspaces): switch between "My account", "Falcon Voyage", etc.
- **Team members**: invite a helper who can create posts; you approve before posting
- **Drafts**: save a post and finish later
- **Best time to post** suggestions
- **Simple stats**: likes, views, comments per post in one place
- **Media library**: reuse old photos and videos
- **Bulk upload**: upload 30 posts for the month from a spreadsheet
- **Image → video** auto-converter so photos can go to YouTube Shorts / TikTok
- **Hashtag sets**: save groups of hashtags and add them with one tap
- **Urdu / Arabic interface** (right-to-left support)

## Version 3 — sell it as SaaS
- Sign up, plans and billing (Stripe)
- White-label for agencies (their logo, their domain)
- Client approval links
- Reports as PDF for clients

---

## Tech plan (for building)
| Part | Choice |
|---|---|
| Frontend | Next.js + Tailwind |
| Backend | Node.js API routes |
| Database | MongoDB |
| Scheduling | BullMQ + Redis |
| Media storage | Cloudinary or S3 (public URLs) |
| Posting | Unified API (Upload-Post / Ayrshare / Zernio) first, direct APIs later |
