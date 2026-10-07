/**
 * Admin content types: one definition per CMS table.
 * Shared by the admin forms (client) and the server actions (validation),
 * so the browser and the server always apply the same rules.
 */
import { iconNames } from "@/components/ui/Icon";
import { PACKAGES_NOTE } from "@/data/services";

export type EntityKey = "projects" | "packages" | "testimonials" | "services" | "faqs" | "promotions";
export type MediaFolder = "projects" | "packages" | "testimonials" | "promotions";

type BaseField = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Field spans the full form width */
  full?: boolean;
};

export type FieldDef =
  | (BaseField & { type: "text" | "url"; maxLength: number; pattern?: RegExp; patternMessage?: string; placeholder?: string })
  | (BaseField & { type: "textarea"; maxLength: number; rows?: number; placeholder?: string })
  | (BaseField & { type: "number"; min?: number; max?: number; step?: number; integer?: boolean; placeholder?: string })
  | (BaseField & { type: "select"; options: { value: string; label: string }[] })
  | (BaseField & { type: "multiselect"; options: { value: string; label: string }[] })
  | (BaseField & { type: "checkbox"; checkboxLabel: string })
  | (BaseField & { type: "date" })
  | (BaseField & { type: "list"; maxItems: number; maxLength: number; placeholder?: string })
  | (BaseField & { type: "image"; altField?: string })
  | (BaseField & { type: "images"; maxItems: number });

/** How published/active state works for a table. */
export type StatusModel = { status?: boolean; active?: boolean; featured?: boolean };

export type EntityDef = {
  key: EntityKey;
  table: string;
  label: string;
  singular: string;
  description: string;
  folder?: MediaFolder;
  fields: FieldDef[];
  model: StatusModel;
  /** Field used as the row title in lists */
  titleField: string;
  /** Extra fields shown as list columns */
  listColumns: { field: string; label: string }[];
  /** Default values for a new record */
  defaults: Record<string, unknown>;
  /** Extra cross-field validation */
  validate?: (values: Record<string, unknown>) => Record<string, string>;
};

export const statusOptions = [
  { value: "draft", label: "Draft (hidden)" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const projectCategories = ["Residential Solar", "Commercial Solar", "Hybrid Solar", "Net Metering", "Solar Street Light"];

const orderField: FieldDef = {
  name: "display_order",
  label: "Display order",
  type: "number",
  integer: true,
  min: 0,
  max: 9999,
  help: "Lower numbers appear first. You can also use the arrows in the list.",
};

const statusField: FieldDef = {
  name: "status",
  label: "Status",
  type: "select",
  options: statusOptions,
  required: true,
  help: "Only Published items appear on the website.",
};

const PATH_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Site path ("/contact#quote") or https URL. "//host" and "/\\host" would leave the site, so they are refused.
const CTA_URL = /^(\/(?![/\\])[^\s]*|https:\/\/[^\s]+)$/;

export const entities: Record<EntityKey, EntityDef> = {
  projects: {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "Project",
    description: "Recent Projects shown on the homepage and the Projects page.",
    folder: "projects",
    model: { status: true, featured: true },
    titleField: "title",
    listColumns: [
      { field: "location", label: "Location" },
      { field: "categories", label: "Category" },
    ],
    defaults: { status: "draft", categories: [], is_featured: false, image_is_illustration: false, additional_image_paths: [] },
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, maxLength: 150, full: true },
      { name: "location", label: "Location", type: "text", maxLength: 150, placeholder: "e.g. Siaton, Negros Oriental" },
      { name: "completion_date", label: "Completion date", type: "date" },
      { name: "categories", label: "Category", type: "multiselect", options: projectCategories.map((c) => ({ value: c, label: c })), full: true },
      { name: "system_size", label: "System size", type: "text", maxLength: 80, placeholder: "e.g. 10kW hybrid solar system", help: "Optional. Leave empty if not confirmed." },
      { name: "battery_size", label: "Battery size", type: "text", maxLength: 80, placeholder: "e.g. 15kWh", help: "Optional. Leave empty if not confirmed." },
      { name: "description", label: "Short description", type: "textarea", maxLength: 1000, rows: 4, full: true },
      { name: "main_image_path", label: "Main image", type: "image", altField: "main_image_alt", full: true },
      { name: "main_image_alt", label: "Main image description (alt text)", type: "text", maxLength: 250, full: true, help: "Describe the photo for visitors who use screen readers." },
      {
        name: "image_is_illustration",
        label: "Illustration label",
        type: "checkbox",
        checkboxLabel: "This image is an illustration, not a real project photo (shows an “Illustration” label)",
        full: true,
      },
      { name: "additional_image_paths", label: "Additional images (optional)", type: "images", maxItems: 12, full: true },
      { name: "is_featured", label: "Featured", type: "checkbox", checkboxLabel: "Feature this project (shown first)" },
      statusField,
      orderField,
    ],
  },
  packages: {
    key: "packages",
    table: "solar_packages",
    label: "Solar Packages",
    singular: "Package",
    description: "Package offerings shown on the Services page.",
    folder: "packages",
    model: { status: true, active: true, featured: true },
    titleField: "name",
    listColumns: [
      { field: "system_size", label: "Size" },
      { field: "price_php", label: "Price (₱)" },
    ],
    defaults: { status: "draft", is_active: false, is_featured: false, inclusions: [], note: PACKAGES_NOTE },
    fields: [
      { name: "name", label: "Package name", type: "text", required: true, maxLength: 150, full: true },
      { name: "system_size", label: "System size", type: "text", maxLength: 80, placeholder: "e.g. 5kW" },
      { name: "price_php", label: "Price (₱)", type: "number", min: 0, max: 100000000, step: 0.01, help: "Leave empty to show “Price on request”." },
      { name: "description", label: "Description", type: "textarea", maxLength: 1000, rows: 3, full: true },
      { name: "inclusions", label: "Package inclusions", type: "list", maxItems: 30, maxLength: 200, full: true, placeholder: "One item per line" },
      { name: "image_path", label: "Image", type: "image", altField: "image_alt", full: true },
      { name: "image_alt", label: "Image description (alt text)", type: "text", maxLength: 250, full: true },
      { name: "note", label: "Disclaimer / note", type: "text", maxLength: 400, full: true, help: "Shown on the card if different from the standard price note." },
      { name: "is_active", label: "Active", type: "checkbox", checkboxLabel: "Package is currently available" },
      { name: "is_featured", label: "Featured", type: "checkbox", checkboxLabel: "Feature this package" },
      { ...statusField, help: "A package appears on the website only when it is Published AND Active." },
      orderField,
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Customer testimonials. Only add real, approved quotes.",
    folder: "testimonials",
    model: { status: true },
    titleField: "display_name",
    listColumns: [{ field: "quote_original", label: "Testimonial" }],
    defaults: { status: "draft" },
    fields: [
      { name: "display_name", label: "Customer display name", type: "text", required: true, maxLength: 100, placeholder: "e.g. Ma’am Jing T.", help: "Use only the name format the customer approved." },
      { name: "location", label: "Customer location (optional)", type: "text", maxLength: 150 },
      { name: "quote_original", label: "Original testimonial", type: "textarea", required: true, maxLength: 1500, rows: 4, full: true, help: "Enter the customer’s exact words." },
      {
        name: "quote_lang",
        label: "Language of the original",
        type: "select",
        options: [
          { value: "", label: "Not specified" },
          { value: "ceb", label: "Cebuano" },
          { value: "fil", label: "Filipino / Tagalog" },
          { value: "en", label: "English" },
        ],
      },
      {
        name: "translation_en",
        label: "English translation (optional)",
        type: "textarea",
        maxLength: 1500,
        rows: 3,
        full: true,
        help: "Only enter an approved translation. Translations are never generated automatically.",
      },
      { name: "image_path", label: "Customer photo (optional, with permission)", type: "image", full: true },
      statusField,
      orderField,
    ],
  },
  services: {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "Service cards on the homepage, Services page and footer.",
    model: { active: true },
    titleField: "title",
    listColumns: [{ field: "slug", label: "Link name" }],
    defaults: { is_active: true, icon: "sun", details: [] },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 120 },
      {
        name: "slug",
        label: "Link name",
        type: "text",
        required: true,
        maxLength: 80,
        pattern: PATH_SLUG,
        patternMessage: "Use lowercase letters, numbers and hyphens only, e.g. residential-solar.",
        help: "Used in links like /services#residential-solar.",
      },
      { name: "description", label: "Description", type: "textarea", required: true, maxLength: 600, rows: 3, full: true },
      { name: "details", label: "Bullet points (Services page)", type: "list", maxItems: 12, maxLength: 200, full: true, placeholder: "One item per line" },
      { name: "icon", label: "Icon", type: "select", options: iconNames.map((n) => ({ value: n, label: n })), required: true },
      { name: "is_active", label: "Active", type: "checkbox", checkboxLabel: "Show this service on the website" },
      orderField,
    ],
  },
  faqs: {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Frequently asked questions on the homepage, FAQs and Net Metering pages.",
    model: { status: true },
    titleField: "question",
    listColumns: [],
    defaults: { status: "draft" },
    fields: [
      { name: "question", label: "Question", type: "text", required: true, maxLength: 300, full: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, maxLength: 3000, rows: 6, full: true },
      statusField,
      orderField,
    ],
  },
  promotions: {
    key: "promotions",
    table: "promotions",
    label: "Promotions",
    singular: "Promotion",
    description: "Optional temporary offers. Shown only while active and within their dates.",
    folder: "promotions",
    model: { active: true },
    titleField: "title",
    listColumns: [
      { field: "starts_on", label: "Starts" },
      { field: "ends_on", label: "Ends" },
    ],
    defaults: { is_active: false },
    fields: [
      { name: "title", label: "Promotion title", type: "text", required: true, maxLength: 150, full: true },
      { name: "description", label: "Description", type: "textarea", maxLength: 1000, rows: 3, full: true },
      { name: "discount_label", label: "Discount (optional)", type: "text", maxLength: 80, placeholder: "e.g. ₱10,000 off" },
      { name: "price_php", label: "Price (₱, optional)", type: "number", min: 0, max: 100000000, step: 0.01 },
      { name: "image_path", label: "Image (optional)", type: "image", altField: "image_alt", full: true },
      { name: "image_alt", label: "Image description (alt text)", type: "text", maxLength: 250, full: true },
      { name: "cta_label", label: "Button label", type: "text", maxLength: 60, placeholder: "e.g. Ask About This Offer" },
      {
        name: "cta_url",
        label: "Button link",
        type: "url",
        maxLength: 500,
        pattern: CTA_URL,
        patternMessage: "Use a site path like /contact#quote or a full https:// link.",
        placeholder: "/contact#quote",
      },
      { name: "starts_on", label: "Start date (optional)", type: "date" },
      { name: "ends_on", label: "End date (optional)", type: "date", help: "The promotion hides automatically after this date." },
      { name: "is_active", label: "Active", type: "checkbox", checkboxLabel: "Show this promotion (within its dates)" },
      orderField,
    ],
    validate: (v) => {
      const errors: Record<string, string> = {};
      if (v.starts_on && v.ends_on && String(v.ends_on) < String(v.starts_on)) errors.ends_on = "The end date must be on or after the start date.";
      if (!!v.cta_label !== !!v.cta_url) errors[v.cta_label ? "cta_url" : "cta_label"] = "Enter both a button label and a button link, or neither.";
      return errors;
    },
  },
};

export const entityList = Object.values(entities);
export const isEntityKey = (v: string): v is EntityKey => Object.hasOwn(entities, v);

/** Allowed stored image paths: uploads in the entity folder, or bundled site images. */
export function isAllowedImagePath(path: string, folder: MediaFolder | undefined) {
  if (/^\/images\/[\w\-/]+\.(jpe?g|png|webp|avif|svg)$/i.test(path)) return true;
  if (!folder) return false;
  return new RegExp(`^${folder}/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`).test(path);
}

/** Image upload rules (also enforced by the Storage bucket). */
export const IMAGE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>,
};
