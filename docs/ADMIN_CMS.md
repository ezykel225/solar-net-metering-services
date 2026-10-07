# Admin Dashboard & Supabase CMS

The website content, calculator settings and quote requests are managed at **`/admin`**.
The public site never requires a login. It reads published content from Supabase and falls back to the
built-in content in `src/data/*.ts` when Supabase is not configured or can't be reached.

---

## 1. One-time Supabase setup (hosted project)

Do these in the Supabase dashboard of the project for this website. Don't use any other project.

### 1.1 Project settings

Keep the secure defaults:

- **Data API:** enabled.
- **Automatically expose new tables:** disabled. The migrations grant access table by table.
- **Automatic RLS:** enabled. Every table also enables RLS explicitly in the migration.

### 1.2 Apply the migrations (in this order)

| File | What it does |
| --- | --- |
| `supabase/migrations/20261007090000_cms_schema.sql` | Tables, constraints, grants, RLS policies, `admin_users`, `is_admin()` |
| `supabase/migrations/20261007090100_storage_website_media.sql` | `website-media` storage bucket and its policies |
| `supabase/migrations/20261007090200_seed_confirmed_content.sql` | Confirmed business content (safe to re-run; it never overwrites edits) |
| `supabase/migrations/20261007090300_revoke_extra_table_privileges.sql` | Removes TRUNCATE/REFERENCES/TRIGGER/MAINTAIN that hosted projects give API roles by default, and locks down Supabase's `rls_auto_enable()` helper |

You can apply them in either of two ways:

- **Supabase CLI:**
  ```bash
  supabase link --project-ref <ref>
  supabase db push
  ```
- **Dashboard:** paste each file into **SQL Editor** and run it.

**Status (7 Oct 2026):** all four migrations are applied to the hosted project `solar-net-metering-services` (CAPSTONE org, ref `miastsvhbnrfogijyhcp`).
They were applied with the Supabase MCP tool, so the hosted migration history uses different version numbers than these file names.
Before using `supabase db push` on that project, mark the files as applied, or the CLI will try to run them again:

```bash
supabase migration repair --status applied 20261007090000 20261007090100 20261007090200 20261007090300
```

Security check after applying:
- Advisors → Security reports one warning: `is_admin()` is callable by signed-in users. This is intentional. The app calls it to check admin status, and it only reveals the caller's own status.
- Visitor and non-admin access was verified in the database: published content is readable; quotes, admin users and all writes are denied.

### 1.3 Authentication

1. Go to **Authentication → Sign In / Providers** and turn **off "Allow new users to sign up"**.
   There is no public registration and the site has no signup form.
2. Keep the **Email** provider **enabled**. Admins sign in with email and password.
3. Go to **Authentication → URL Configuration**:
   - Set **Site URL** to the production URL, for example `https://www.yourdomain.com`.
   - Add `https://www.yourdomain.com/admin/**` under **Redirect URLs**.
4. Create the admin account in **Authentication → Users → Add user → Create new user**:
   - Use the owner's email and a strong password.
   - Tick **Auto Confirm User**.
   - Never put the password in code, in chat or in this repository.

### 1.4 Grant admin access (explicit allow-list)

A Supabase login alone does **not** give admin access. A user is an admin only if their user ID is in
`public.admin_users`. Run this in the **SQL Editor**, replacing the email:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'owner@example.com'
on conflict (user_id) do nothing;
```

To **remove** someone's access (it applies immediately, even if they are signed in):

```sql
delete from public.admin_users where email = 'former-admin@example.com';
```

Only the SQL Editor or the service role can change `admin_users`. No website page or API can add admins.

### 1.5 Check the security advisors

Open **Advisors → Security** and confirm there are no warnings for the `public` tables.

---

## 2. Environment variables

Add these to `.env.local` for local work, and in **Vercel → Project → Settings → Environment Variables**
for Production and Preview. `.env.example` lists them all. Never commit real values.

| Variable | Browser-safe? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, sitemap, link in quote emails |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key or publishable key (`sb_publishable_…`). Access is limited by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | **No, server only** | Service role or secret key (`sb_secret_…`). Used only by `/api/quote` to save quotes. |
| `RESEND_API_KEY` | **No, server only** | Optional. Sends the new-quote email. |
| `QUOTE_NOTIFY_TO` | Server | Recipient of quote emails. Defaults to solarandnetmeteringservices@gmail.com. |
| `QUOTE_NOTIFY_FROM` | Server | Sender on a Resend-verified domain, for example `Website <quotes@yourdomain.com>` |

Rules:

- Server-only secrets must **never** use the `NEXT_PUBLIC_` prefix.
- `src/lib/supabase/service.ts` imports `server-only`, so the build fails if browser code ever imports it.

Behaviour when variables are missing:

- **No Supabase variables:** the public site uses the built-in content, `/admin` shows "Admin not configured", and quote submissions return a friendly "use phone or Messenger" message.
- **No `SUPABASE_SERVICE_ROLE_KEY`:** quotes can't be saved, and the form shows that same fallback message.
- **No `RESEND_API_KEY`:** quotes are still saved and visible in **Admin → Quote Requests**. No email is sent.

### Email (Resend)

1. Create a Resend account and verify the business domain under **Domains** (add its DNS records).
2. Create an API key with "Sending access" and set it as `RESEND_API_KEY`.
3. Set `QUOTE_NOTIFY_FROM` to an address on that domain.

Gmail addresses can't be used as the sender. Until a domain is verified, quotes are only visible in the admin.

### Vercel

1. Add the environment variables above. Mark the secrets as **Sensitive**.
2. Redeploy after you change the variables.
3. Recommended: in **Vercel → Firewall**, add a rate-limit rule for `POST /api/quote` and `/admin/login`.
   The in-app limits are per server instance and are only a first line of defence (see §6).
4. Production deployment and the custom domain are not set up yet. Deploy only when the owner approves.

---

## 3. Admin routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Email/password sign-in (no signup) |
| `/admin` | Dashboard: counts, latest quotes, warnings |
| `/admin/projects` (and `/new`, `/[id]`) | Projects |
| `/admin/packages` | Solar packages |
| `/admin/testimonials` | Testimonials |
| `/admin/services` | Services |
| `/admin/faqs` | FAQs |
| `/admin/promotions` | Promotions |
| `/admin/quotes` (and `/[id]`) | Quote requests: details, status, internal notes |
| `/admin/settings` | Business settings |
| `/admin/calculator` | Calculator settings |

Protection is enforced in three layers:

1. `src/proxy.ts` refreshes the session and redirects signed-out visitors to `/admin/login`.
2. Every admin page calls `requireAdminPage()` and every server action calls `requireAdminAction()`. Both check `is_admin()` in the database.
3. Row-level security in Postgres applies even if someone calls the Supabase API directly.

Admin pages are `noindex` and sent with `Cache-Control: private, no-store`. `robots.txt` disallows `/admin` and `/api/`.

---

## 4. Storage

Bucket `website-media` is public-read, so images can be shown on the site. Only admins can upload.

```
website-media/
  projects/<uuid>.<ext>
  packages/<uuid>.<ext>
  testimonials/<uuid>.<ext>
  promotions/<uuid>.<ext>
```

Upload rules:

- Allowed types are JPG, PNG, WebP and AVIF, up to 5 MB each.
- These rules are enforced by the bucket, by the storage policies (admin only, these folders only) and by the upload field in the browser, which also checks the file really is an image.
- File names are random UUIDs. User-supplied names are never used.

When a record is deleted, its images are removed too. One limitation: if an admin uploads an image and then
leaves the form without saving, that file stays in the bucket. It does no harm. Clean these up occasionally
in **Storage**, for example by deleting files that no record references.

---

## 5. Content and fallbacks

The seed migration copies the confirmed content from `src/data/*.ts` and `src/lib/site.ts` into the database.
The public site reads the database through `src/lib/cms/index.ts`, which falls back to that local content
only when Supabase is not configured or a request fails.

Fallback behaviour:

- **An empty result from the database is respected.** If you unpublish every FAQ, the FAQ section hides. The site does not quietly show the old local copy.
- **Promotions never fall back**, so an outdated offer can't reappear.

Public pages are cached for at most 5 minutes. Admin saves refresh them immediately.

**When the local fallbacks can be removed:** once the hosted project is live, the seed has been applied, the
owner has reviewed the content in the admin, and the site has run on Supabase for a few weeks without errors.
After that, `src/data/projects.ts`, `testimonials.ts`, `faqs.ts`, the package and service lists in
`services.ts`, and the defaults in `src/lib/site-settings.ts` can be reduced to types only. Keep
`DEFAULT_CALCULATOR_CONFIG` as a safety net for the calculator.

---

## 6. Quote requests

The flow is: quote form → `POST /api/quote` → validated on the server → saved to `quote_requests` with the service role → email notification sent after the response.

Checks on every request:

- The body must be JSON and at most 16 KB.
- A hidden "website" honeypot field filters out bots.
- The same validation as the form runs again on the server, including the allowed property types and services.
- **The privacy consent box must be ticked.** The API stores `privacy_consent`, `consented_at` and `privacy_policy_version` (`src/lib/privacy.ts`).
- Rate limits: 5 requests per 10 minutes per IP (in memory), and 3 per hour per email address (checked in the database).

Calculator details:

- Quotes started from the calculator also store the calculator inputs.
- The server recalculates the estimate with the current calculator settings, so the stored estimate can't be tampered with in the browser.
- The admin shows these values clearly labelled as estimates.

Browser access:

- The browser can't read or insert `quote_requests` directly. There is no anon grant or policy.
- Admins can read quotes and update only `status` and `internal_notes`, enforced with a column-level grant.

Statuses: New, Contacted, Site Assessment Scheduled, Quotation Sent, Approved, Completed, Closed.

---

## 7. Calculator settings

Stored in the single `calculator_settings` row and edited at `/admin/calculator`, with a live preview.

What you can edit:

- Rates, rate source, billing period and last-updated date.
- How the commercial "Not Sure" rate is chosen: the average of Low and High Voltage, either one of them, or a custom rate.
- Peak sun hours, system efficiency, panel wattage, coverage targets, the accepted bill range, the maximum bill reduction, the export credit factor and the disclaimer.

Rules:

- Don't name NORECO 1 or NORECO 2 in the rate source until the owner confirms which one the rates are for.
- The export credit stays **Unverified** until an official reference is entered. The database won't accept "verified" without a source note. While it is unverified, the public calculator says so next to the results.
- If the row can't be read, or a value is out of range, the calculator uses `DEFAULT_CALCULATOR_CONFIG` in `src/lib/solar-calculator.ts` for that value.

---

## 8. Local development with Supabase (optional)

```bash
supabase start                 # needs Docker; prints local URL and keys
supabase db reset              # applies all migrations + seed
```

1. Put the printed API URL, publishable key and secret key in `.env.local`.
2. Create a user in the local Studio, or through the Auth admin API.
3. Insert that user into `admin_users` with the SQL in §1.4.

`supabase/config.toml` disables public signups locally too.
