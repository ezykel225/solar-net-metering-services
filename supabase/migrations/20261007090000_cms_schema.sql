-- =============================================================================
-- Solar Net Metering Services — CMS schema, admin authorization and RLS
--
-- Security model
--   * RLS is enabled on every table.
--   * Grants are explicit (the project does NOT auto-expose new tables).
--   * anon / authenticated can only SELECT rows meant for public display.
--   * Only users listed in public.admin_users (checked by public.is_admin())
--     can create, update or delete CMS content, read quote requests, or
--     change settings.
--   * quote_requests has no anon/authenticated insert access at all; the
--     website inserts through the server-side /api/quote route using the
--     service role.
-- =============================================================================

-- Secure by default in every environment (matches the hosted project setting
-- "Automatically expose new tables: disabled"): new tables/functions in public
-- are NOT granted to API roles unless a migration grants them explicitly.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

-- Keeps updated_at current on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Admin authorization
-- -----------------------------------------------------------------------------

-- Explicit allow-list of admin users. Being signed in is NOT enough to be an
-- admin: a row here is required. Rows are added manually (SQL editor), never
-- through the website.
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Users allowed into /admin. Add rows manually in the Supabase SQL editor.';

alter table public.admin_users enable row level security;

grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;

-- A signed-in user may only see their own row (used to confirm admin status).
create policy "admin_users: read own row"
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies: admins cannot grant admin to others via the API.

-- True when the current request belongs to a listed admin.
-- SECURITY DEFINER so policies can call it without exposing admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------
create table public.projects (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null check (char_length(title) between 2 and 150),
  location             text check (char_length(location) <= 150),
  categories           text[] not null default '{}'
                       check (categories <@ array['Residential Solar', 'Commercial Solar', 'Hybrid Solar', 'Net Metering', 'Solar Street Light']::text[]),
  system_size          text check (char_length(system_size) <= 80),
  battery_size         text check (char_length(battery_size) <= 80),
  description          text check (char_length(description) <= 1000),
  -- Storage path inside the website-media bucket (e.g. projects/<uuid>.jpg)
  -- or a site-relative path for bundled images (e.g. /images/projects/x.jpg).
  main_image_path      text check (char_length(main_image_path) <= 300),
  main_image_alt       text check (char_length(main_image_alt) <= 250),
  -- True while the main image is an illustration, not a real project photo.
  image_is_illustration boolean not null default false,
  additional_image_paths text[] not null default '{}' check (cardinality(additional_image_paths) <= 12),
  completion_date      date,
  is_featured          boolean not null default false,
  status               text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order        integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index projects_public_idx on public.projects (status, display_order);
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Solar packages
-- -----------------------------------------------------------------------------
create table public.solar_packages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 150),
  system_size   text check (char_length(system_size) <= 80),
  price_php     numeric(12, 2) check (price_php is null or price_php >= 0),
  description   text check (char_length(description) <= 1000),
  inclusions    text[] not null default '{}' check (cardinality(inclusions) <= 30),
  image_path    text check (char_length(image_path) <= 300),
  image_alt     text check (char_length(image_alt) <= 250),
  note          text check (char_length(note) <= 400),
  is_active     boolean not null default false,
  is_featured   boolean not null default false,
  status        text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index solar_packages_public_idx on public.solar_packages (status, is_active, display_order);
create trigger solar_packages_set_updated_at before update on public.solar_packages
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Testimonials
-- -----------------------------------------------------------------------------
create table public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  display_name   text not null check (char_length(display_name) between 1 and 100),
  quote_original text not null check (char_length(quote_original) between 2 and 1500),
  -- BCP 47 language tag of the original quote, e.g. 'ceb', 'fil', 'en'
  quote_lang     text check (quote_lang ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$'),
  translation_en text check (char_length(translation_en) <= 1500),
  location       text check (char_length(location) <= 150),
  image_path     text check (char_length(image_path) <= 300),
  status         text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index testimonials_public_idx on public.testimonials (status, display_order);
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Services
-- -----------------------------------------------------------------------------
create table public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title         text not null check (char_length(title) between 2 and 120),
  description   text not null check (char_length(description) between 2 and 600),
  details       text[] not null default '{}' check (cardinality(details) <= 12),
  -- Must match an icon name in src/components/ui/Icon.tsx (validated in the app)
  icon          text not null default 'sun' check (icon ~ '^[a-zA-Z]{2,30}$'),
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index services_public_idx on public.services (is_active, display_order);
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- FAQs
-- -----------------------------------------------------------------------------
create table public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null check (char_length(question) between 5 and 300),
  answer        text not null check (char_length(answer) between 2 and 3000),
  status        text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index faqs_public_idx on public.faqs (status, display_order);
create trigger faqs_set_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Promotions (optional, temporary offers)
-- -----------------------------------------------------------------------------
create table public.promotions (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) between 2 and 150),
  description    text check (char_length(description) <= 1000),
  discount_label text check (char_length(discount_label) <= 80),
  price_php      numeric(12, 2) check (price_php is null or price_php >= 0),
  image_path     text check (char_length(image_path) <= 300),
  image_alt      text check (char_length(image_alt) <= 250),
  cta_label      text check (char_length(cta_label) <= 60),
  -- Site-relative path or https URL (validated again in the app)
  cta_url        text check (cta_url is null or cta_url ~ '^(/[^/\s][^\s]*|/|https://[^\s]+)$'),
  is_active      boolean not null default false,
  starts_on      date,
  ends_on        date,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint promotions_dates_check check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create index promotions_public_idx on public.promotions (is_active, starts_on, ends_on);
create trigger promotions_set_updated_at before update on public.promotions
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Business settings (single row)
-- -----------------------------------------------------------------------------
create table public.business_settings (
  -- Singleton: the primary key can only ever be TRUE, so only one row can exist.
  id                 boolean primary key default true check (id),
  business_name      text not null check (char_length(business_name) between 2 and 120),
  phone_display      text not null check (char_length(phone_display) between 7 and 30),
  -- International format used for tel: links, e.g. +639977310543
  phone_e164         text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  email              text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' and char_length(email) <= 254),
  facebook_url       text check (facebook_url ~ '^https://[^\s]+$'),
  messenger_url      text check (messenger_url ~ '^https://[^\s]+$'),
  service_area_text  text check (char_length(service_area_text) <= 400),
  service_area_short text check (char_length(service_area_short) <= 80),
  office_address     text check (char_length(office_address) <= 300),
  business_hours     text check (char_length(business_hours) <= 150),
  -- Main quote button wording, e.g. 'Get a Free Quote'
  quote_cta_label    text not null default 'Get a Free Quote' check (char_length(quote_cta_label) between 3 and 40),
  -- Drives the other quote wording ("Free Quotation" headings etc.)
  quotes_are_free    boolean not null default true,
  updated_at         timestamptz not null default now()
);

create trigger business_settings_set_updated_at before update on public.business_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Calculator settings (single row)
-- -----------------------------------------------------------------------------
create table public.calculator_settings (
  id                     boolean primary key default true check (id),
  -- Retail electricity rates (PHP per kWh)
  residential_rate       numeric(8, 4) not null check (residential_rate > 0 and residential_rate < 100),
  low_voltage_rate       numeric(8, 4) not null check (low_voltage_rate > 0 and low_voltage_rate < 100),
  high_voltage_rate      numeric(8, 4) not null check (high_voltage_rate > 0 and high_voltage_rate < 100),
  rate_source            text not null default 'NORECO published power rates' check (char_length(rate_source) between 2 and 150),
  rate_billing_period    text check (char_length(rate_billing_period) <= 60),
  rates_updated_on       date,
  -- Commercial "Not Sure": how to approximate the rate
  not_sure_method        text not null default 'average' check (not_sure_method in ('average', 'low_voltage', 'high_voltage', 'custom')),
  not_sure_custom_rate   numeric(8, 4) check (not_sure_custom_rate is null or (not_sure_custom_rate > 0 and not_sure_custom_rate < 100)),
  -- Generation assumptions
  peak_sun_hours         numeric(4, 2) not null check (peak_sun_hours between 1 and 10),
  system_efficiency      numeric(4, 3) not null check (system_efficiency between 0.5 and 1),
  panel_wattage          integer not null check (panel_wattage between 100 and 1000),
  coverage_low           numeric(4, 3) not null check (coverage_low between 0.1 and 1.2),
  coverage_medium        numeric(4, 3) not null check (coverage_medium between 0.1 and 1.2),
  coverage_high          numeric(4, 3) not null check (coverage_high between 0.1 and 1.2),
  -- Accepted bills and result cap
  min_monthly_bill       numeric(12, 2) not null check (min_monthly_bill > 0),
  max_monthly_bill       numeric(12, 2) not null check (max_monthly_bill <= 100000000),
  max_bill_reduction_share numeric(4, 3) not null check (max_bill_reduction_share between 0.1 and 1),
  -- Net-metering export credit (UNVERIFIED until an official reference exists)
  export_credit_ratio    numeric(4, 3) not null check (export_credit_ratio between 0 and 1.5),
  export_credit_verified boolean not null default false,
  export_credit_source   text check (char_length(export_credit_source) <= 300),
  -- Public disclaimer
  disclaimer             text not null check (char_length(disclaimer) between 20 and 1000),
  updated_at             timestamptz not null default now(),
  constraint calculator_bill_range_check check (max_monthly_bill > min_monthly_bill),
  constraint calculator_custom_rate_check check (not_sure_method <> 'custom' or not_sure_custom_rate is not null),
  constraint calculator_verified_source_check check (not export_credit_verified or export_credit_source is not null)
);

create trigger calculator_settings_set_updated_at before update on public.calculator_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Quote requests (private)
-- -----------------------------------------------------------------------------
create table public.quote_requests (
  id                      uuid primary key default gen_random_uuid(),
  full_name               text not null check (char_length(full_name) between 2 and 120),
  phone_number            text not null check (char_length(phone_number) between 7 and 20),
  email                   text not null check (char_length(email) <= 254),
  address                 text not null check (char_length(address) between 1 and 300),
  property_type           text not null check (char_length(property_type) <= 50),
  monthly_electric_bill   numeric(12, 2) not null check (monthly_electric_bill >= 0),
  service_needed          text not null check (char_length(service_needed) <= 100),
  message                 text check (char_length(message) <= 2000),
  status                  text not null default 'new' check (status in (
                            'new', 'contacted', 'site_assessment_scheduled', 'quotation_sent',
                            'approved', 'completed', 'closed')),
  internal_notes          text check (char_length(internal_notes) <= 5000),
  source                  text not null default 'website_form' check (source in ('website_form', 'solar_calculator')),
  source_page             text check (char_length(source_page) <= 200),
  -- Solar Calculator inputs (when the visitor came from the calculator)
  calc_consumer_rate_type text check (calc_consumer_rate_type in ('residential', 'low_voltage', 'high_voltage', 'not_sure')),
  calc_daytime_usage      text check (calc_daytime_usage in ('low', 'medium', 'high')),
  calc_appliances         text[] check (cardinality(calc_appliances) <= 12),
  calc_battery_preference text check (calc_battery_preference in ('none', 'basic', 'extended')),
  -- Calculator estimates, recomputed on the server (ESTIMATES ONLY)
  calc_rate_used          numeric(8, 4),
  calc_monthly_usage_kwh  numeric(12, 2),
  calc_system_size_kw_low numeric(8, 2),
  calc_system_size_kw_high numeric(8, 2),
  calc_panels_low         integer,
  calc_panels_high        integer,
  calc_generation_kwh_low numeric(12, 2),
  calc_generation_kwh_high numeric(12, 2),
  calc_bill_reduction_low numeric(12, 2),
  calc_bill_reduction_high numeric(12, 2),
  -- Privacy consent
  privacy_consent         boolean not null check (privacy_consent),
  consented_at            timestamptz not null,
  privacy_policy_version  text not null check (char_length(privacy_policy_version) <= 40),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index quote_requests_status_idx on public.quote_requests (status);
create index quote_requests_email_recent_idx on public.quote_requests (email, created_at desc);
create trigger quote_requests_set_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Grants (explicit; nothing is exposed by default)
-- =============================================================================

-- Public CMS tables: anyone may SELECT (RLS limits rows); authenticated may
-- write (RLS limits writes to admins).
grant select on table
  public.projects, public.solar_packages, public.testimonials, public.services,
  public.faqs, public.promotions, public.business_settings, public.calculator_settings
  to anon, authenticated;

grant insert, update, delete on table
  public.projects, public.solar_packages, public.testimonials, public.services,
  public.faqs, public.promotions
  to authenticated;

-- Settings are single rows: admins update them, never insert or delete.
grant update on table public.business_settings, public.calculator_settings to authenticated;

-- Quote requests: no anon access at all. Admins read via RLS and may change
-- ONLY the status and internal notes (column-level grant), never what the
-- customer submitted.
grant select on table public.quote_requests to authenticated;
grant update (status, internal_notes) on table public.quote_requests to authenticated;

-- Server-side service role (used only by /api/quote on the server).
grant all on table
  public.projects, public.solar_packages, public.testimonials, public.services,
  public.faqs, public.promotions, public.business_settings, public.calculator_settings,
  public.quote_requests
  to service_role;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.projects            enable row level security;
alter table public.solar_packages      enable row level security;
alter table public.testimonials        enable row level security;
alter table public.services            enable row level security;
alter table public.faqs                enable row level security;
alter table public.promotions          enable row level security;
alter table public.business_settings   enable row level security;
alter table public.calculator_settings enable row level security;
alter table public.quote_requests      enable row level security;

-- ---------- Public read: only records intended for public display ----------
create policy "projects: public reads published"
  on public.projects for select to anon, authenticated
  using (status = 'published');

create policy "solar_packages: public reads published and active"
  on public.solar_packages for select to anon, authenticated
  using (status = 'published' and is_active);

create policy "testimonials: public reads published"
  on public.testimonials for select to anon, authenticated
  using (status = 'published');

create policy "services: public reads active"
  on public.services for select to anon, authenticated
  using (is_active);

create policy "faqs: public reads published"
  on public.faqs for select to anon, authenticated
  using (status = 'published');

-- Promotions are visible only while active and inside their date window
-- (dates evaluated in Philippine time).
create policy "promotions: public reads current active"
  on public.promotions for select to anon, authenticated
  using (
    is_active
    and (starts_on is null or starts_on <= (now() at time zone 'Asia/Manila')::date)
    and (ends_on is null or ends_on >= (now() at time zone 'Asia/Manila')::date)
  );

-- Business and calculator settings contain only public information.
create policy "business_settings: public read"
  on public.business_settings for select to anon, authenticated
  using (true);

create policy "calculator_settings: public read"
  on public.calculator_settings for select to anon, authenticated
  using (true);

-- ---------- Admin: full access to CMS content ----------
create policy "projects: admin full access"
  on public.projects for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "solar_packages: admin full access"
  on public.solar_packages for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "testimonials: admin full access"
  on public.testimonials for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "services: admin full access"
  on public.services for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "faqs: admin full access"
  on public.faqs for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "promotions: admin full access"
  on public.promotions for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "business_settings: admin update"
  on public.business_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "calculator_settings: admin update"
  on public.calculator_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------- Quote requests: admins only (read + update status/notes) ----------
create policy "quote_requests: admin read"
  on public.quote_requests for select to authenticated
  using ((select public.is_admin()));

create policy "quote_requests: admin update"
  on public.quote_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- No insert policy for anon/authenticated: inserts only via the server (service role).
