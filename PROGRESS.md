# ByteFlow — Progress

Facebook comment-to-DM automation for 6-10 of the user's own Pages. Personal use, not SaaS.
Auto-replies publicly to comments (randomized template), then sends a private DM with a
randomized message + button link. Managed via a password-gated dashboard (add/remove/pause
pages, add/edit/delete templates) — no reply/DM logs are kept, only comment IDs for dedup.

## Done

- Next.js app scaffolded, pushed to GitHub: https://github.com/Sallu3211/ByteFlow (private)
- Built: webhook route (`/api/webhook`) with Meta signature verification, dedup, self-reply-loop
  guard, random template picker, public reply + private DM-with-button sender
- Built: `/login` (password-gated) + `/dashboard/pages` (add/remove/pause) + `/dashboard/templates`
  (add/edit/delete comment + DM templates, each with its own link/button label)
- Supabase project created (`fwdbqtjmgcjgpozdadik`), schema run, RLS enabled (app uses
  `service_role` key server-side only, so RLS doesn't block it — it blocks the `anon` key)
- Deployed to Railway, project name `byteflow`, live at:
  **https://byteflow-production-a5fb.up.railway.app**
- Verified end-to-end locally and on Railway: login works, dashboard queries Supabase correctly
- Dashboard login password: `Arabshah123@` (set in Railway variables + local `.env.local`)
- Dashboard redesigned: real toggle switches (pages + templates), active-route nav highlighting,
  card-based layout. "Load starter templates" button seeds 5 editable/deletable default comment
  templates + 5 DM templates (link defaults to `https://your-link.com` — needs editing to the
  real link before going live). All text/name fields now strip HTML tags on save
  (`src/lib/sanitize.ts`) so pasted markup can't render broken on Facebook.

## Not done yet

1. ~~**Meta App**~~ — done. App "ByteFlow" created (App ID `1018585814425976`), use case
   "Engage with customers on Messenger from Meta" selected, `META_APP_SECRET` set on Railway
   and in local `.env.local`.
2. **Webhook subscription** — once the Meta App exists, set webhook callback URL to
   `https://byteflow-production-a5fb.up.railway.app/api/webhook`, verify token =
   `byteflow-webhook-2026` (already set in Railway/`.env.local` as `WEBHOOK_VERIFY_TOKEN`),
   subscribe each page to the `feed` field.
3. **Page Access Tokens** — for each of the 6-10 Pages, generate a token via Graph API
   Explorer, exchange for a long-lived one (steps in README.md), then add each page through
   `/dashboard/pages` on the live site (name + Page ID + long-lived token).
4. **Templates** — no comment-reply or DM templates added yet. Needs at least one active
   template of each type before the webhook can do anything (it silently no-ops otherwise).
5. **Live test** — post a real comment on a connected page once 1-4 are done, confirm the
   public reply + DM both fire correctly, then repeat for remaining pages.

## Where things live

- Local repo: `C:\Users\salman\byteflow`
- GitHub: https://github.com/Sallu3211/ByteFlow
- Railway project: `byteflow` (CLI already linked in this folder — `railway status` works
  directly from `C:\Users\salman\byteflow`)
- Supabase project ref: `fwdbqtjmgcjgpozdadik`
- Setup steps for Meta App + token exchange: see `README.md` in the repo

## Notes / decisions made

- One Meta App covers all pages (not one app per page) — simpler, and Meta restrictions hit
  at the page level, not the app level.
- App stays in Development Mode — no App Review needed since every Page is admin'd by the same
  account that has a role on the App.
- No reply/DM history is stored — `processed_comments` table only holds comment IDs, purely
  for dedup on webhook retries.
- Graph API version used is `v21.0` (in `src/lib/meta.ts`) — worth double-checking against
  Meta's current docs during live testing, no offline copy of Meta's docs was available to verify.
