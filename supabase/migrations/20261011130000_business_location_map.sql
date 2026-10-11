-- =============================================================================
-- Business location: exact address, official Google Maps listing, optional
-- map embed, Plus Code and coordinates (Admin → Business Settings).
--
-- Confirmed by the owner (Oct 2026):
--   Address:   Bulfas Compound, Dumaguete – Palinpinon Rd., Dumaguete City, 6200 Negros Oriental
--   Maps URL:  https://maps.app.goo.gl/81yyiSJeFAdaxvHN9
--   Plus Code: 875R+JP Dumaguete City, Negros Oriental
-- No embed URL or coordinates are set: they must be copied from the official
-- listing (Google Maps → Share → Embed a map), never guessed.
--
-- Safe to re-run; only fills values that are still empty or the old seeded text.
-- RLS and grants are unchanged (public read, admin-only update).
-- =============================================================================

alter table public.business_settings
  add column if not exists google_maps_url text,
  add column if not exists google_maps_embed_url text,
  add column if not exists plus_code text,
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6);

alter table public.business_settings drop constraint if exists business_settings_google_maps_url_check;
alter table public.business_settings add constraint business_settings_google_maps_url_check check (
  google_maps_url is null or (
    char_length(google_maps_url) <= 500
    and google_maps_url ~ '^https://(maps\.app\.goo\.gl/[A-Za-z0-9_-]+|goo\.gl/maps/[A-Za-z0-9_-]+|(www\.)?google\.com(\.ph)?/maps([/?][^[:space:]"''<>]*)?|maps\.google\.com(\.ph)?/[^[:space:]"''<>]*)$'
  )
);

alter table public.business_settings drop constraint if exists business_settings_google_maps_embed_url_check;
alter table public.business_settings add constraint business_settings_google_maps_embed_url_check check (
  google_maps_embed_url is null or (
    char_length(google_maps_embed_url) <= 2000
    and google_maps_embed_url ~ '^https://www\.google\.com/maps/embed\?[^[:space:]"''<>]+$'
  )
);

alter table public.business_settings drop constraint if exists business_settings_plus_code_check;
alter table public.business_settings add constraint business_settings_plus_code_check check (
  plus_code is null or (char_length(plus_code) <= 120 and plus_code ~* '^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}( .+)?$')
);

alter table public.business_settings drop constraint if exists business_settings_coordinates_check;
alter table public.business_settings add constraint business_settings_coordinates_check check (
  (latitude is null and longitude is null)
  or (latitude is not null and longitude is not null
      and latitude between -90 and 90 and longitude between -180 and 180)
);

update public.business_settings set
  office_address = case
    when office_address is null or trim(office_address) = '' or office_address = 'Batinguel, Dumaguete City, Philippines'
      then 'Bulfas Compound, Dumaguete – Palinpinon Rd., Dumaguete City, 6200 Negros Oriental'
    else office_address end,
  google_maps_url = coalesce(google_maps_url, 'https://maps.app.goo.gl/81yyiSJeFAdaxvHN9'),
  plus_code = coalesce(plus_code, '875R+JP Dumaguete City, Negros Oriental')
where id;
