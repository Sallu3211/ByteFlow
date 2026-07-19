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
- Deployed to Railway, project name `byteflow`, live at:
  **https://byteflow-production-a5fb.up.railway.app**
- Dashboard login password: `Arabshah123@` (set in Railway variables + local `.env.local`)
- Dashboard redesigned: real toggle switches (pages + templates), active-route nav highlighting,
  card-based layout, "Load starter templates" button, HTML stripped from all text fields on save.
- **Supabase — CORRECT project is `ihnjkedhgpirynscsggo`** (not `fwdbqtjmgcjgpozdadik`, which
  was a mix-up — that's a different, unrelated project of the user's with its own `profiles`/
  `user_templates` tables). Schema is live in `ihnjkedhgpirynscsggo`, RLS enabled. Both
  `.env.local` and Railway variables now correctly point at `ihnjkedhgpirynscsggo`.
- Also fixed: `/dashboard/pages` and `/dashboard/templates` used to silently swallow Supabase
  errors and render an empty state instead of failing loudly — this is why the wrong-project
  mix-up wasn't obvious sooner. Both now throw with the real Supabase error message if the
  query fails.
- Meta App "ByteFlow" created (App ID `1018585814425976`), use case "Engage with customers on
  Messenger from Meta" selected, `META_APP_SECRET` set on Railway and locally.
- Webhook configured in Meta: callback URL `https://byteflow-production-a5fb.up.railway.app/api/webhook`,
  verify token `byteflow-webhook-2026`, page "AD" (Page ID `110348501705111`) subscribed to `feed`.
- Page "AD" added to the live dashboard with a Page Access Token generated after: (a) granting
  `pages_messaging` + optional perms via the in-dashboard consent screen, (b) adding the page to
  a Meta Business Portfolio. **Not yet confirmed whether this actually unlocked real API access**
  — direct test calls to `pages_read_engagement`-gated endpoints still failed as of last check,
  but that may be irrelevant since our code doesn't actually need that permission (see below).
- One starter comment template + one starter DM template (link = placeholder `https://your-link.com`)
  inserted directly into the correct Supabase project for page "AD" specifically, ready for a
  real live test.

## Not done yet — pick up here

1. **Run the actual live test.** Post a real comment on a real post on the "AD" Facebook Page
   (from any account), then check Railway logs (`railway logs --service byteflow` from
   `C:\Users\salman\byteflow`, or the Railway dashboard) to see what `/api/webhook` actually did.
   This is the real test — a prior attempt to sanity-check the token via
   `GET /{page-id}?fields=name` failed with a `pages_read_engagement` permission error, but that
   endpoint isn't something our code calls. Our actual code only needs:
   - `pages_manage_engagement` for `POST /{comment_id}/comments` (the public reply)
   - `pages_messaging` for `POST /me/messages` (the private DM) — this one already went through
     a consent/grant flow, unclear if it's sufficient
   If the live test fails, the Railway log will show the real Graph API error from
   `src/lib/meta.ts`, which will say definitively what's missing.
2. **If the live test reveals real permission gaps** — the fallback path (researched, not yet
   executed) is: Meta Business Verification as an individual is possible without a registered
   company, using a personal government ID + live video selfie (no business documents needed).
   Then submit a formal App Review request for whichever permissions the live test shows are
   actually missing. Realistic timeline if this is needed: ~1-2 weeks.
3. **Remaining pages** — only "AD" is connected/tested so far. Once the flow is confirmed
   working, repeat page-token generation + webhook subscription for the other 5-9 pages, add
   each through `/dashboard/pages`.
4. **Real templates + real link** — the starter templates use a placeholder link
   (`https://your-link.com`). Before going live for real, edit the DM template(s) in
   `/dashboard/templates` to the actual destination link, and add more randomized variations
   (both comment and DM) so replies don't look identical across users.

## Where things live

- Local repo: `C:\Users\salman\byteflow`
- GitHub: https://github.com/Sallu3211/ByteFlow
- Railway project: `byteflow` (CLI already linked in this folder — `railway status` /
  `railway logs` work directly from `C:\Users\salman\byteflow`, use `--service byteflow` if
  it complains about multiple services)
- Supabase project: `ihnjkedhgpirynscsggo` (**not** `fwdbqtjmgcjgpozdadik`)
- Meta App: "ByteFlow", App ID `1018585814425976`
- Setup steps for Meta App + token exchange: see `README.md` in the repo (written before the
  "use case" flow / Business Portfolio detour — broadly accurate but Meta's exact UI has since
  required extra steps not reflected there yet)

## Notes / decisions made

- One Meta App covers all pages (not one app per page) — simpler, and Meta restrictions hit
  at the page level, not the app level.
- No reply/DM history is stored — `processed_comments` table only holds comment IDs, purely
  for dedup on webhook retries.
- Graph API version used is `v21.0` (in `src/lib/meta.ts`).
- **Correction to earlier assumption:** Development Mode + being both app admin and page admin
  does NOT reliably bypass permission requirements the way it used to — hit real, confirmed API
  failures on this exact setup. Don't assume "personal use = no review needed" without testing
  empirically first.
