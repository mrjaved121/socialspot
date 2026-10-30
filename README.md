# SocialSpot

Upload a photo or video once, write one caption, and post it to Facebook,
Instagram, YouTube, TikTok and X at the same time.

This is the **UI stage**: every screen works with demo data in memory (no
backend yet). See `FEATURES.md` for the full feature plan.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Screens
| Route | Screen |
|---|---|
| `/` | Home — create button, problems to fix, coming up, recent posts |
| `/create` | New post — 4 steps: media → caption → apps → when, live preview, smart warnings |
| `/calendar` | Month calendar of scheduled / posted / failed posts |
| `/posts` | All posts with per-app status, filters, search, "Try again" |
| `/accounts` | My apps — connect, log in again, disconnect |
| `/settings` | Time zone, default apps, usual posting time |

## Where things live
- `lib/platforms.ts` — the 5 apps, their colours and caption limits
- `lib/store.tsx` — demo data and actions (replace with API calls later)
- `components/AppShell.tsx` — sidebar (desktop) and bottom tabs (mobile)
- `components/ui.tsx` — shared buttons, status pills, app icons

## Design
- Fonts: Bricolage Grotesque (headings), Atkinson Hyperlegible (body — made for easy reading)
- Colours: ink `#1C2140`, spot yellow `#FFC530`, paper `#F4F6FB`
- Rules: one main action per screen, plain words, big tap targets, warnings say how to fix the problem

## Next step
Replace the demo actions in `lib/store.tsx` with real API routes
(`/api/posts`, `/api/accounts`) backed by MongoDB + BullMQ and a unified posting API.
