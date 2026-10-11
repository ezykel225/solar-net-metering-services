-- =============================================================================
-- DTI registration details + owner-confirmed service list (Oct 2026)
--
-- Confirmed by the owner (DTI announcement):
--   EG SOLAR PRODUCTS TRADING — DTI Registered, Regional scope, Negros Island
--   Region (NIR), registered 8 Oct 2026, valid until 8 Oct 2031.
--   Services: Solar Products; Solar System Installation; System Design &
--   Consultation; Permits & Documents Processing; Net Metering Assistance;
--   Maintenance & After-Sales Support.
--
-- Deliberately NOT stored: the business-name registration/certificate number
-- and QR code (not published on the website).
--
-- Safe to re-run: values are only filled when empty, titles only change while
-- they still hold the previous seeded wording, nothing is deleted.
-- RLS and grants are unchanged (public read, admin-only update).
-- =============================================================================

-- 1. Registration fields (all optional, editable in Admin → Business Settings)
alter table public.business_settings
  add column if not exists registration_authority  text,
  add column if not exists registration_status     text,
  add column if not exists registration_scope      text,
  add column if not exists registration_region     text,
  add column if not exists registration_date       date,
  add column if not exists registration_expiry_date date;

alter table public.business_settings drop constraint if exists business_settings_registration_check;
alter table public.business_settings add constraint business_settings_registration_check check (
  coalesce(char_length(registration_authority), 0) <= 120
  and coalesce(char_length(registration_status), 0) <= 60
  and coalesce(char_length(registration_scope), 0) <= 60
  and coalesce(char_length(registration_region), 0) <= 120
  and (registration_date is null or registration_expiry_date is null or registration_expiry_date > registration_date)
);

update public.business_settings set
  registration_authority   = coalesce(registration_authority, 'Department of Trade and Industry (DTI)'),
  registration_status      = coalesce(registration_status, 'DTI Registered'),
  registration_scope       = coalesce(registration_scope, 'Regional'),
  registration_region      = coalesce(registration_region, 'Negros Island Region (NIR)'),
  registration_date        = coalesce(registration_date, date '2026-10-08'),
  registration_expiry_date = coalesce(registration_expiry_date, date '2031-10-08')
where id;

-- 2. Service titles: match the owner's list (slugs unchanged, so links keep working)
update public.services set title = 'Solar Products'
  where slug = 'solar-system-supply' and title = 'Solar System Supply';
update public.services set title = 'Solar System Installation'
  where slug = 'solar-installation' and title = 'Solar Installation';

-- 3. Solar street lights are not on the confirmed list and the service is
--    inactive: unpublish (not delete) the FAQ that says they are sold.
update public.faqs set status = 'draft'
  where question = 'Do you sell solar street lights?'
    and status = 'published'
    and exists (select 1 from public.services where slug = 'solar-street-lights' and not is_active);
