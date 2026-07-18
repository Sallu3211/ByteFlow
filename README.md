# ByteFlow

Facebook comment-to-DM automation. Watches comments on your own connected Pages, posts a
randomized public reply, then sends a private DM with a randomized message + button link.
Manage connected pages and reply/DM templates from `/dashboard`.

## 1. Supabase

1. Create a free project at supabase.com.
2. SQL Editor → New query → paste `supabase/schema.sql` → Run. This creates the `pages`,
   `comment_templates`, `dm_templates`, and `processed_comments` tables.
3. Project Settings → API → copy the **Project URL** and the **service_role** (a.k.a. "secret")
   key — not the `anon`/`publishable` key. This app is fully server-side, so it uses the
   privileged key directly and never exposes it to the browser.

## 2. Meta App (Facebook)

1. developers.facebook.com/apps → Create App → type "Business".
2. Add the **Messenger** product.
3. Settings → Basic → copy the **App Secret** → `META_APP_SECRET`.
4. Messenger → Settings → Access Tokens: for each Page you admin, generate a Page Access
   Token, then exchange it for a long-lived one (see below) before adding it in `/dashboard/pages`.
5. Messenger → Settings → Webhooks: callback URL = `https://<your-deployment>/api/webhook`,
   verify token = anything you choose, put the same value in `WEBHOOK_VERIFY_TOKEN`. Subscribe
   each page to the `feed` field.

App stays in **Development Mode** — no App Review needed, since every Page is admin'd by the
same account that has a role on the App.

### Exchanging a short-lived token for a long-lived one

```
GET https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id=<APP_ID>
  &client_secret=<APP_SECRET>
  &fb_exchange_token=<SHORT_LIVED_USER_TOKEN>
```

Then exchange the resulting long-lived **user** token for a **page** token via
`GET /me/accounts?access_token=<LONG_LIVED_USER_TOKEN>` — the page tokens returned there don't
expire on their own. Paste that value into the dashboard's "Add a page" form.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in every value. Same variables go into Railway's
project settings when you deploy.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `/login`, sign in with `ADMIN_PASSWORD`, then connect pages and edit templates from
`/dashboard`.

## 5. Deploy (Railway)

1. New Project → Deploy from GitHub repo → select this repo.
2. Add all variables from `.env.example` under Variables.
3. Railway auto-detects Next.js and runs `npm run build` / `npm start`.
4. Once deployed, use the Railway URL as your Meta webhook callback URL.

## Notes

- The Graph API version used in `src/lib/meta.ts` (`v21.0`) — check it's still current against
  Meta's docs when you get to testing; Meta ships new versions periodically and I don't have a
  live copy of their docs the way I do for Next.js.
- `processed_comments` only stores comment IDs (for de-duplication on webhook retries), not
  reply content — matches the "don't log replies" requirement.
