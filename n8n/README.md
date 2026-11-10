# n8n workflow — post or schedule one video on 4 platforms

`post-to-all-platforms.json` gives you a form: video + caption + **When**:

| When | What happens |
|---|---|
| Post now | Goes out to TikTok, Instagram, Facebook, YouTube right away |
| Schedule | Goes out at the Date + Time you pick (time zone: Asia/Karachi — change it in the *Schedule post* node if you move back to Dubai: `Asia/Dubai`) |
| Next free queue slot | Goes into the next empty time slot you set up in Upload-Post (Profile → Queue). Good for filling a week in one sitting |

Scheduled and queued posts are stored and published by **Upload-Post**, so your laptop
only needs to be on while you upload. Up to 365 days ahead.

## Run n8n on your laptop (no server)
1. Install Node.js 20 or newer (you already have it).
2. In a terminal: `npx n8n` — first run takes a few minutes. Keep that window open while you use it.
3. Open http://localhost:5678 and create your login.
4. Credentials → New → **Header Auth** → Name `Authorization`, Value `Apikey YOUR_UPLOAD_POST_KEY`.
5. Workflows → Import from file → this JSON. Select the credential in all three Upload-Post nodes.
6. Activate the workflow, open the *Upload form* node and copy the Production URL
   (`http://localhost:5678/form/socialspot-post-form`). Bookmark it.

Your workflows are saved in `C:\Users\<you>\.n8n` and survive restarts.
