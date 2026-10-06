# Quote Submission Plan (Supabase)

**Status: prepared, not connected.** No Supabase project exists yet, nothing is installed, and the live form still runs in demo mode.
This document is the plan for connecting it. It covers the table, the request flow, and the exact files that will change.

---

## 1. Current state

| Piece | File | State |
| --- | --- | --- |
| Form UI, validation display, honeypot | `src/components/quote/QuoteForm.tsx`, `FormField.tsx` | ✅ Done |
| Field rules (shared client + server) | `src/lib/quote.ts` → `validateQuoteRequest()`, `quoteLimits` | ✅ Done |
| Bill amount parsing ("5,000" → 5000) | `src/lib/quote.ts` → `parseBillAmount()` | ✅ Prepared |
| Form-to-table mapping | `src/lib/quote.ts` → `toQuoteRequestInsert()` | ✅ Prepared |
| Table row types and statuses | `src/lib/quote.ts` → `QuoteRequestInsert`, `QuoteRequestRow`, `quoteStatuses` | ✅ Prepared |
| Submit function | `src/lib/quote.ts` → `submitQuoteRequest()` | 🟡 Demo only (simulated delay, nothing stored) |
| Server endpoint, database, keys | — | ⬜ Not created |

## 2. Architecture

```
Browser (QuoteForm)
   │  POST /api/quote  (JSON, same origin)
   ▼
Next.js Route Handler  src/app/api/quote/route.ts   ← runs on Vercel's servers
   │  1. reject honeypot submissions
   │  2. validateQuoteRequest()  (same rules as the browser)
   │  3. require privacy consent (see §6)
   │  4. toQuoteRequestInsert()
   │  5. insert using a SERVER-ONLY secret key
   ▼
Supabase Postgres  public.quote_requests   (RLS on, no public policies)
```

Why a server route instead of inserting from the browser:
- The Supabase key never reaches the browser, and the table has **no public access at all**. Nobody can read or write it with the public key.
- Validation runs again on the server, so a tampered request can't skip it.
- Spam checks, rate limits and email notifications can be added later in one place without changing the form.

**Recommended client:** a plain `fetch` to Supabase's REST endpoint (`{SUPABASE_URL}/rest/v1/quote_requests`). That adds **no new dependency**. `@supabase/supabase-js` is an acceptable alternative (one dependency) if more Supabase features are planned.

## 3. Proposed table: `public.quote_requests`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | no | `gen_random_uuid()` | Primary key |
| `full_name` | `text` | no | — | 2–120 chars |
| `phone_number` | `text` | no | — | 7–20 chars, stored as typed |
| `email` | `text` | no | — | ≤254 chars, stored lower-case |
| `address` | `text` | no | — | Form field "Address / Location", ≤300 chars |
| `property_type` | `text` | no | — | One of `propertyTypes` in `src/lib/quote.ts` |
| `monthly_electric_bill` | `numeric(12,2)` | no | — | Parsed amount, ≥0. Currency is not stored (single-currency business) |
| `service_needed` | `text` | no | — | One of `serviceOptions` in `src/data/services.ts` |
| `message` | `text` | yes | — | ≤2000 chars; empty becomes `NULL` |
| `status` | `text` | no | `'new'` | `new`, `contacted`, `quoted`, `won`, `lost`, `spam` |
| `created_at` | `timestamptz` | no | `now()` | |

**Recommended additions:**

| Column | Type | Why |
| --- | --- | --- |
| `privacy_consent` | `boolean not null` | Evidence the visitor agreed to the Privacy Policy (§6) |
| `consented_at` | `timestamptz` | When they agreed |
| `privacy_policy_version` | `text` | Which version of the policy they saw, e.g. `2026-11-01` |
| `source_page` | `text` | Which page the form was sent from (`/`, `/contact`), useful for seeing which pages convert |

`property_type` and `service_needed` are **not** limited to fixed values in the database. Those lists will change as the owner confirms services, and the server already checks them, so the table won't need a migration each time.

### Draft migration (to be saved as `supabase/migrations/<timestamp>_create_quote_requests.sql` when the project exists)

```sql
create table public.quote_requests (
  id                     uuid primary key default gen_random_uuid(),
  full_name              text not null check (char_length(full_name) between 2 and 120),
  phone_number           text not null check (char_length(phone_number) between 7 and 20),
  email                  text not null check (char_length(email) <= 254),
  address                text not null check (char_length(address) between 1 and 300),
  property_type          text not null check (char_length(property_type) <= 50),
  monthly_electric_bill  numeric(12,2) not null check (monthly_electric_bill >= 0),
  service_needed         text not null check (char_length(service_needed) <= 100),
  message                text check (char_length(message) <= 2000),
  status                 text not null default 'new'
                         check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  -- recommended additions
  privacy_consent        boolean not null default false,
  consented_at           timestamptz,
  privacy_policy_version text,
  source_page            text check (char_length(source_page) <= 200),
  created_at             timestamptz not null default now()
);

comment on table public.quote_requests is 'Quotation requests submitted through the website form.';

create index quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index quote_requests_status_idx     on public.quote_requests (status);

-- Lock the table down: RLS on with no policies means the public key can do nothing.
-- Only the server route, using the secret key, can insert.
alter table public.quote_requests enable row level security;
revoke all on table public.quote_requests from anon, authenticated;
```

## 4. Environment variables

| Name | Where | Secret? | Purpose |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Vercel + `.env.local` | No, but keep it server-side | Project URL, e.g. `https://xxxx.supabase.co` |
| `SUPABASE_SECRET_KEY` | Vercel + `.env.local` | **Yes** | Server-only key (`sb_secret_…`, or the legacy `service_role` key) |
| `QUOTE_NOTIFY_EMAIL` *(if email alerts are chosen)* | Vercel | No | Where new-lead alerts are sent |

Neither Supabase variable may have the `NEXT_PUBLIC_` prefix, because that would bundle it into the browser code. Values are never committed. `.env.local` is already git-ignored.

## 5. Exact code changes when connecting

| # | File | Change |
| --- | --- | --- |
| 1 | `supabase/migrations/<timestamp>_create_quote_requests.sql` | **New.** The SQL from §3 |
| 2 | `.env.example` | Add `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (and `QUOTE_NOTIFY_EMAIL`) with placeholder comments; remove the old `NEXT_PUBLIC_SUPABASE_*` comment lines |
| 3 | `src/lib/supabase/server.ts` | **New.** `insertQuoteRequest(row)`: `import "server-only"`, reads the env vars, `POST`s to `/rest/v1/quote_requests` with the `apikey` header and `Prefer: return=minimal`, returns ok/error, never logs personal data |
| 4 | `src/app/api/quote/route.ts` | **New.** `POST` handler: parse JSON, reject the honeypot, `validateQuoteRequest()`, check consent, `toQuoteRequestInsert()`, insert. Returns `201`, `400` with field errors, `429` if rate-limited, or `500` with a generic message. Node runtime, never cached |
| 5 | `src/lib/quote.ts` | Replace the demo body of `submitQuoteRequest()` with `fetch("/api/quote")`. Extend `SubmitResult` to carry server field errors. Add `privacyConsent` (and `sourcePage`) to `QuoteRequest`, validation and `toQuoteRequestInsert()` |
| 6 | `src/components/quote/QuoteForm.tsx` | Remove the "Demo mode" note. Send the honeypot value to the server instead of short-circuiting in the browser. Add the consent checkbox (§6). Show server field errors. Show a failure message with the phone number as a fallback |
| 7 | `src/components/quote/FormField.tsx` | Add a `checkbox` variant (label beside the box, same error and describedby wiring) |
| 8 | `src/components/quote/QuoteForm.module.css` | Checkbox styles (24px box, focus ring, error state). Layout and breakpoints unchanged |
| 9 | `src/app/privacy/page.tsx` | **New.** Privacy Policy page (owner-supplied text), using `PageHero` and `buildMetadata()` |
| 10 | `src/components/layout/Footer.tsx` | Add a "Privacy Policy" link in the bottom bar |
| 11 | `src/app/sitemap.ts` | Include `/privacy` |
| 12 | `README.md` | Setup steps: create project, run migration, set env vars, test |

**Unchanged:** all page layouts, `QuoteSection.tsx`, header, footer layout and the responsive CSS. The form's visible layout only gains one checkbox row above the submit button.

### Lead notifications (owner decision needed)
There is no admin dashboard, so the owner needs a way to see new requests. Options:
1. **Supabase Table Editor only.** Zero code; the owner logs into Supabase to check. Easy to miss leads.
2. **Email alert per request (recommended).** The route handler sends an email after a successful insert, via an email provider such as Resend or SMTP. One server env var for the provider key; the owner chooses the provider.
3. **Supabase Database Webhook** on insert, calling an Edge Function that sends the email. Keeps the website code unchanged but adds Supabase-side setup.

### Spam and abuse
- Already in place: hidden honeypot field, strict validation and length limits.
- At connect time: the server re-checks the honeypot, validates again, and adds a size limit on the request body.
- Recommended: a Vercel Firewall rate-limit rule on `POST /api/quote` (a dashboard setting, no code).
- Only if spam actually appears: add a CAPTCHA such as Cloudflare Turnstile (would need a new script and keys).

## 6. Privacy-consent checkbox: recommendation

**Yes, add one before production.** The form collects name, phone, email, address and electricity spending, stores them with a third-party processor (Supabase), and the company uses them to make contact. Most data-protection laws require telling people how their data is used and having a lawful basis for it. For example, if the business operates in the Philippines, the Data Privacy Act of 2012 applies. A clear consent checkbox linked to a Privacy Policy is the simplest way to show both. The owner or their legal adviser makes the final call on wording, and on whether consent or another lawful basis is relied on.

Proposed behaviour:
- **Unticked by default, required to submit.** Placed directly above the submit button.
- Label (wording to be approved): *"I agree to the [Privacy Policy] and consent to Solar Net Metering Services contacting me about this quotation request."* The link opens in a new tab so the form isn't lost.
- Error if unticked: *"Please agree to the Privacy Policy so we can respond to your request."*
- Stored as `privacy_consent = true`, `consented_at`, `privacy_policy_version`.
- Promotional messages, if ever wanted, need a **separate, optional** checkbox. They should not be bundled into the required one.
- The existing line "Your details are only used to prepare your quotation" must match the final Privacy Policy.

**Dependency:** the checkbox can't ship until the Privacy Policy page exists, because it has to link to it. That is why it isn't added yet.

## 7. Test plan (when connecting)

1. Run the migration on a development Supabase project. Confirm the table, defaults and constraints.
2. **Lock-down check:** a request with the *publishable/anon* key to `/rest/v1/quote_requests` must fail for both read and insert.
3. Valid form submission creates a row with `status = 'new'`, the parsed bill amount, and `message = NULL` when the message is empty.
4. Invalid payload (e.g. `curl` with a bad email or `monthlyBill: "5k"`) returns `400` and no row is created.
5. Honeypot filled: the request appears to succeed, but no row is created.
6. Consent unticked: blocked in the browser and returns `400` from the server.
7. Database unavailable (wrong key): the user sees the failure message with the phone number, and nothing crashes.
8. `grep` the production build (`.next/static`) for the secret key value: it must not appear.
9. Re-run `npm run build`, `npm run lint`, and the 1440, 1024, 768 and 375px checks.
