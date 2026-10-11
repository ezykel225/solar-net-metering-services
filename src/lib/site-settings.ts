/**
 * Business settings used across the public site.
 * Values come from Supabase (Admin → Business Settings) when connected; the
 * confirmed values in src/lib/site.ts are the fallback. Safe for client and server.
 */
import { buildQuoteCopy, QUOTES_ARE_FREE, type QuoteCopy } from "@/data/navigation";
import { siteConfig } from "@/lib/site";

export type SiteSettings = {
  name: string;
  phone: string;
  phoneHref: string;
  phoneIntl: string;
  email: string;
  facebook: string;
  messenger: string;
  serviceAreaSummary: string;
  serviceAreaShort: string;
  address: string | null;
  hours: string | null;
  /** Official Google Maps listing link. */
  mapsUrl: string | null;
  /** Google Maps "Embed a map" iframe src; no map is shown without it. */
  mapsEmbedUrl: string | null;
  plusCode: string | null;
  geo: { lat: number; lng: number } | null;
  quotesAreFree: boolean;
  quoteCopy: QuoteCopy;
};

export const defaultSiteSettings: SiteSettings = {
  name: siteConfig.name,
  phone: siteConfig.contact.phone,
  phoneHref: siteConfig.contact.phoneHref,
  phoneIntl: siteConfig.contact.phoneIntl,
  email: siteConfig.contact.email,
  facebook: siteConfig.social.facebook,
  messenger: siteConfig.social.messenger,
  serviceAreaSummary: siteConfig.serviceAreaSummary,
  serviceAreaShort: siteConfig.serviceAreaShort,
  address: siteConfig.contact.address,
  hours: siteConfig.contact.hours,
  mapsUrl: siteConfig.map.url,
  mapsEmbedUrl: siteConfig.map.embedUrl,
  plusCode: siteConfig.map.plusCode,
  geo: siteConfig.map.geo,
  quotesAreFree: QUOTES_ARE_FREE,
  quoteCopy: buildQuoteCopy(QUOTES_ARE_FREE),
};

/** Shape of a public.business_settings row. */
export type BusinessSettingsRow = {
  business_name: string;
  phone_display: string;
  phone_e164: string;
  email: string;
  facebook_url: string | null;
  messenger_url: string | null;
  service_area_text: string | null;
  service_area_short: string | null;
  office_address: string | null;
  business_hours: string | null;
  google_maps_url?: string | null;
  google_maps_embed_url?: string | null;
  plus_code?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  quote_cta_label: string;
  quotes_are_free: boolean;
};

const blankToNull = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

function geoFromRow(lat: number | string | null | undefined, lng: number | string | null | undefined) {
  if (lat == null || lng == null) return null;
  const la = Number(lat), lo = Number(lng);
  return Number.isFinite(la) && Number.isFinite(lo) ? { lat: la, lng: lo } : null;
}

/** Maps a database row onto SiteSettings, falling back field-by-field. */
export function siteSettingsFromRow(row: BusinessSettingsRow): SiteSettings {
  const d = defaultSiteSettings;
  const free = row.quotes_are_free ?? d.quotesAreFree;
  return {
    name: blankToNull(row.business_name) ?? d.name,
    phone: blankToNull(row.phone_display) ?? d.phone,
    phoneHref: row.phone_e164 ? `tel:${row.phone_e164}` : d.phoneHref,
    phoneIntl: row.phone_e164 ?? d.phoneIntl,
    email: blankToNull(row.email) ?? d.email,
    facebook: blankToNull(row.facebook_url) ?? d.facebook,
    messenger: blankToNull(row.messenger_url) ?? d.messenger,
    serviceAreaSummary: blankToNull(row.service_area_text) ?? d.serviceAreaSummary,
    serviceAreaShort: blankToNull(row.service_area_short) ?? d.serviceAreaShort,
    address: blankToNull(row.office_address),
    hours: blankToNull(row.business_hours),
    // Columns added later: fall back while a database hasn't been migrated yet.
    mapsUrl: row.google_maps_url === undefined ? d.mapsUrl : blankToNull(row.google_maps_url),
    mapsEmbedUrl: row.google_maps_embed_url === undefined ? d.mapsEmbedUrl : blankToNull(row.google_maps_embed_url),
    plusCode: row.plus_code === undefined ? d.plusCode : blankToNull(row.plus_code),
    geo: row.latitude === undefined ? d.geo : geoFromRow(row.latitude, row.longitude),
    quotesAreFree: free,
    quoteCopy: buildQuoteCopy(free, row.quote_cta_label),
  };
}
