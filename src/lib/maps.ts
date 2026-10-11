/**
 * Google Maps links for the business location. Standard share/embed URLs only
 * (no Maps JavaScript API, no API key). Safe for client and server.
 */

/** Google Maps share links: maps.app.goo.gl/…, goo.gl/maps/…, google.com/maps…, maps.google.com/… */
const MAPS_URL = /^https:\/\/(maps\.app\.goo\.gl\/[A-Za-z0-9_-]+|goo\.gl\/maps\/[A-Za-z0-9_-]+|(www\.)?google\.com(\.ph)?\/maps([/?][^\s"'<>]*)?|maps\.google\.com(\.ph)?\/[^\s"'<>]*)$/;

/** "Embed a map" iframe src from Google Maps → Share → Embed a map. */
const EMBED_URL = /^https:\/\/www\.google\.com\/maps\/embed\?[^\s"'<>]+$/;

export const MAPS_URL_MAX = 500;
export const EMBED_URL_MAX = 2000;

export function isGoogleMapsUrl(v: string): boolean {
  return v.length <= MAPS_URL_MAX && MAPS_URL.test(v);
}

export function isGoogleMapsEmbedUrl(v: string): boolean {
  return v.length <= EMBED_URL_MAX && EMBED_URL.test(v);
}

/**
 * Accepts either the embed src URL or the whole <iframe …> code Google gives,
 * and returns just the src (unvalidated; check with isGoogleMapsEmbedUrl).
 */
export function embedSrcFromInput(input: string): string {
  const v = input.trim();
  const m = /<iframe[^>]*\ssrc=["']([^"']+)["']/i.exec(v);
  return (m ? m[1] : v).replace(/&amp;/g, "&").trim();
}

/** Plus Code with locality, e.g. "875R+JP Dumaguete City, Negros Oriental". */
export const PLUS_CODE = /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}( [^\s<>"][^<>"]{0,98})?$/i;

/**
 * "Get Directions": starts Google Maps directions to the exact spot when
 * coordinates or a Plus Code are known; otherwise opens the official listing.
 */
export function directionsUrl(loc: { mapsUrl: string | null; plusCode: string | null; geo: { lat: number; lng: number } | null }): string | null {
  const destination = loc.geo ? `${loc.geo.lat},${loc.geo.lng}` : loc.plusCode;
  if (destination) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  return loc.mapsUrl;
}
