import "server-only";
import { cache } from "react";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { publicMediaUrl } from "@/lib/supabase/env";
import { defaultSiteSettings, siteSettingsFromRow, type BusinessSettingsRow, type SiteSettings } from "@/lib/site-settings";
import { calculatorConfigFromRow, DEFAULT_CALCULATOR_CONFIG, type CalculatorConfig, type CalculatorSettingsRow } from "@/lib/solar-calculator";
import { isIconName } from "@/components/ui/Icon";
import { projects as localProjects, type Project } from "@/data/projects";
import { services as localServices, solarPackages as localPackages, type Service, type SolarPackage } from "@/data/services";
import { testimonials as localTestimonials, type Testimonial } from "@/data/testimonials";
import { faqs as localFaqs, type Faq } from "@/data/faqs";

/**
 * Public CMS data access.
 *
 * - Supabase is the primary source once configured (anon key; RLS only returns
 *   published/active rows).
 * - If Supabase is not configured, or a request fails, the confirmed local
 *   content in src/data/*.ts is used as a temporary fallback so pages never crash.
 * - If Supabase answers successfully with zero rows (e.g. the owner unpublished
 *   everything), that choice is respected: no fallback content is shown.
 *
 * Every function is cached per request; pages are statically generated and
 * revalidated (ISR), and admin saves trigger on-demand revalidation.
 */

type Source = "supabase" | "fallback";
export type CmsResult<T> = { data: T; source: Source };

function warn(area: string, error: unknown) {
  // Never log keys or full responses; the code/message is enough to debug.
  const msg = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "unknown error";
  console.warn(`[cms] ${area}: using fallback content (${msg.slice(0, 120)})`);
}

/** Resolves a stored image path to a URL usable by next/image. */
export const mediaUrl = publicMediaUrl;

const pesoFormatter = (n: number) => `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

/* --------------------------------- settings -------------------------------- */

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return defaultSiteSettings;
  const { data, error } = await supabase.from("business_settings").select("*").maybeSingle();
  if (error || !data) {
    if (error) warn("business_settings", error);
    return defaultSiteSettings;
  }
  return siteSettingsFromRow(data as BusinessSettingsRow);
});

export const getCalculatorConfig = cache(async (): Promise<CalculatorConfig> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return DEFAULT_CALCULATOR_CONFIG;
  const { data, error } = await supabase.from("calculator_settings").select("*").maybeSingle();
  if (error || !data) {
    if (error) warn("calculator_settings", error);
    return DEFAULT_CALCULATOR_CONFIG;
  }
  return calculatorConfigFromRow(data as CalculatorSettingsRow);
});

/* --------------------------------- projects -------------------------------- */

type ProjectRow = {
  id: string;
  title: string;
  location: string | null;
  categories: string[] | null;
  system_size: string | null;
  battery_size: string | null;
  description: string | null;
  main_image_path: string | null;
  main_image_alt: string | null;
  image_is_illustration: boolean;
  is_featured: boolean;
};

function projectFromRow(row: ProjectRow): Project {
  const categories = row.categories ?? [];
  const category = categories.includes("Residential Solar")
    ? "Residential"
    : categories.includes("Commercial Solar")
      ? "Commercial"
      : undefined;
  const system = [row.system_size, row.battery_size ? `${row.battery_size} battery storage` : null].filter(Boolean).join(" · ");
  return {
    slug: row.id,
    title: row.title,
    category,
    tags: categories.map((c) => (c === "Residential Solar" ? "Residential" : c === "Commercial Solar" ? "Commercial" : c)),
    location: row.location,
    system: system || undefined,
    description: row.description ?? "",
    image: mediaUrl(row.main_image_path),
    imageAlt: row.main_image_alt ?? row.title,
    imageIsIllustration: row.image_is_illustration,
    featured: row.is_featured,
  };
}

export const getProjects = cache(async (): Promise<CmsResult<Project[]>> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { data: localProjects, source: "fallback" };
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,location,categories,system_size,battery_size,description,main_image_path,main_image_alt,image_is_illustration,is_featured")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    warn("projects", error);
    return { data: localProjects, source: "fallback" };
  }
  return { data: (data as ProjectRow[]).map(projectFromRow), source: "supabase" };
});

/* --------------------------------- packages -------------------------------- */

type PackageRow = {
  name: string;
  system_size: string | null;
  price_php: number | string | null;
  description: string | null;
  inclusions: string[] | null;
  image_path: string | null;
  image_alt: string | null;
  note: string | null;
  is_featured: boolean;
};

export const getPackages = cache(async (): Promise<CmsResult<SolarPackage[]>> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { data: localPackages, source: "fallback" };
  const { data, error } = await supabase
    .from("solar_packages")
    .select("name,system_size,price_php,description,inclusions,image_path,image_alt,note,is_featured")
    .eq("status", "published")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });
  if (error) {
    warn("solar_packages", error);
    return { data: localPackages, source: "fallback" };
  }
  return {
    data: (data as PackageRow[]).map((r) => {
      const price = r.price_php == null ? null : Number(r.price_php);
      return {
        name: r.name,
        price: price != null && Number.isFinite(price) ? pesoFormatter(price) : null,
        inclusions: r.inclusions ?? [],
        systemSize: r.system_size,
        description: r.description,
        image: mediaUrl(r.image_path),
        imageAlt: r.image_alt,
        note: r.note,
        featured: r.is_featured,
      };
    }),
    source: "supabase",
  };
});

/* ------------------------------- testimonials ------------------------------ */

type TestimonialRow = {
  display_name: string;
  quote_original: string;
  quote_lang: string | null;
  translation_en: string | null;
  location: string | null;
  image_path: string | null;
};

export const getTestimonials = cache(async (): Promise<CmsResult<Testimonial[]>> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { data: localTestimonials, source: "fallback" };
  const { data, error } = await supabase
    .from("testimonials")
    .select("display_name,quote_original,quote_lang,translation_en,location,image_path")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) {
    warn("testimonials", error);
    return { data: localTestimonials, source: "fallback" };
  }
  return {
    data: (data as TestimonialRow[]).map((r) => ({
      quote: r.quote_original,
      lang: r.quote_lang ?? undefined,
      translation: r.translation_en ?? undefined,
      name: r.display_name,
      detail: r.location ?? undefined,
      image: mediaUrl(r.image_path),
    })),
    source: "supabase",
  };
});

/* --------------------------------- services -------------------------------- */

type ServiceRow = { slug: string; title: string; description: string; details: string[] | null; icon: string };

export const getServices = cache(async (): Promise<CmsResult<Service[]>> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { data: localServices, source: "fallback" };
  const { data, error } = await supabase
    .from("services")
    .select("slug,title,description,details,icon")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) {
    warn("services", error);
    return { data: localServices, source: "fallback" };
  }
  return {
    data: (data as ServiceRow[]).map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.description,
      details: r.details ?? [],
      icon: isIconName(r.icon) ? r.icon : "sun",
    })),
    source: "supabase",
  };
});

/* ----------------------------------- FAQs ---------------------------------- */

export const getFaqs = cache(async (): Promise<CmsResult<Faq[]>> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { data: localFaqs, source: "fallback" };
  const { data, error } = await supabase
    .from("faqs")
    .select("question,answer")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) {
    warn("faqs", error);
    return { data: localFaqs, source: "fallback" };
  }
  return { data: data as Faq[], source: "supabase" };
});

/* -------------------------------- promotions ------------------------------- */

export type Promotion = {
  id: string;
  title: string;
  description: string | null;
  discountLabel: string | null;
  price: string | null;
  image: string | null;
  imageAlt: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  endsOn: string | null;
};

type PromotionRow = {
  id: string;
  title: string;
  description: string | null;
  discount_label: string | null;
  price_php: number | string | null;
  image_path: string | null;
  image_alt: string | null;
  cta_label: string | null;
  cta_url: string | null;
  ends_on: string | null;
};

/** Active promotions inside their date window. Never falls back: no promo is shown on error. */
export const getActivePromotions = cache(async (): Promise<Promotion[]> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("promotions")
    .select("id,title,description,discount_label,price_php,image_path,image_alt,cta_label,cta_url,ends_on")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) {
    warn("promotions", error);
    return [];
  }
  return (data as PromotionRow[]).map((r) => {
    const price = r.price_php == null ? null : Number(r.price_php);
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      discountLabel: r.discount_label,
      price: price != null && Number.isFinite(price) ? pesoFormatter(price) : null,
      image: mediaUrl(r.image_path),
      imageAlt: r.image_alt,
      ctaLabel: r.cta_label,
      ctaUrl: r.cta_url && /^(\/|https:\/\/)/.test(r.cta_url) ? r.cta_url : null,
      endsOn: r.ends_on,
    };
  });
});
