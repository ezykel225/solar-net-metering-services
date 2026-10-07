-- =============================================================================
-- Promotion button links: refuse "/\host" (browsers treat it like "//host",
-- i.e. another website). Same rule as the admin form.
-- =============================================================================

alter table public.promotions drop constraint if exists promotions_cta_url_check;
alter table public.promotions
  add constraint promotions_cta_url_check
  check (cta_url is null or cta_url ~ '^(/[^/\\[:space:]][^[:space:]]*|/|https://[^[:space:]]+)$');
