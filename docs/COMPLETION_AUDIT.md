# Website Completion Audit

Status of the Phase 1 frontend before launch. Each area lists what is done, what is still placeholder content, what the business owner must supply, recommended improvements, and technical issues.

Legend: ✅ done · 🟡 placeholder · 🔴 needs business owner input · 🛠 improvement / technical fix (tag **[fixed]** = done in the completion pass)

---

## 1. Page-by-page audit

### Home (`src/app/page.tsx`)
- ✅ All 12 requested sections in the requested order; every section is a reusable component.
- 🟡 Hero highlights and float cards, stats, projects, savings bars, testimonials (see §2).
- 🔴 Real hero photo, real projects, approved testimonials, verified stats.
- 🛠 At 1024–1199px the hero headline wraps to 3 lines and pushes the CTAs down. **[fixed]**
- 🛠 The navy quote section runs straight into the navy footer with no visual break. **[fixed]**

### About (`src/app/about/page.tsx`)
- ✅ Intro, mission/approach/commitment, why choose us, testimonials, CTA.
- 🟡 Company story is generic. The mission, approach and commitment text and the stats are placeholders.
- 🔴 Founding year, team/owner info, certifications or accreditations, real office or team photo.

### Services (`src/app/services/page.tsx`)
- ✅ 4 detailed service cards with anchors (`#residential-solar` …), 5-step process, why choose us, CTA.
- 🟡 Service bullet points are generic: hybrid/battery, carport/ground-mount, ROI projections, cleaning.
- 🔴 Confirm which services and system types are actually offered, plus warranty terms and brands used.
- 🛠 The page jumped from `h1` to the card `h3`s with no `h2` (heading-level skip). **[fixed]**

### Net Metering (`src/app/net-metering/page.tsx`)
- ✅ Explainer, "how we help" list, 4-step process, documents grid, benefits, filtered FAQs, CTA.
- 🟡 The required-documents list is generic. Real requirements depend on the utility.
- 🔴 The distribution utility or utilities served, the exact document checklist, and typical approval timelines.

### Projects (`src/app/projects/page.tsx`)
- ✅ Filterable gallery (All / Residential / Commercial) with an accessible live result count.
- 🟡 All 6 projects are fictional, and the images are generated illustrations.
- 🔴 Real projects: title, type, location (city level is fine), system size, a short description, and photos the owner has permission to publish.
- 🛠 Same `h1` to `h3` heading skip as Services. **[fixed]**

### FAQs (`src/app/faqs/page.tsx`)
- ✅ 8 FAQs in an accessible accordion, with FAQPage structured data.
- 🟡 Installation timelines (1–3 days and 1–4 weeks) and battery claims are generic.
- 🔴 Owner to confirm the answers and timelines.
- 🛠 Same `h1` to `h3` heading skip. **[fixed]**

### Contact (`src/app/contact/page.tsx`)
- ✅ Quote form, contact details, office hours, short FAQ.
- 🟡 Phone, email, Facebook, hours, and the "within 1–2 business days" response promise.
- 🔴 Real contact details, office address, optional map, and the service-area list.

### Header / navigation (`src/components/layout/Header.tsx`)
- ✅ Sticky header, top bar (≥768px), 7 links with `aria-current`, quote CTA, hamburger below 1024px, Escape closes the menu.
- 🛠 **Bug:** with the menu open, tapping the logo navigated but left the menu open over the new page. **[fixed]**
- 🛠 **Bug:** at ≥768px the 40px top bar is also sticky, so the header is 112px tall. Anchor links such as `/contact#quote` landed about 24px under it. **[fixed: the top bar now scrolls away and only the 72px bar sticks]**
- 🛠 With the menu open, keyboard Tab could reach page content hidden behind it. Focus didn't return to the toggle after Escape. **[fixed]**

### Footer (`src/components/layout/Footer.tsx`)
- ✅ Brand blurb, quick links, service links, contact, CTA, copyright.
- 🟡 Address ("Office address to follow"), phone, email, Facebook.
- 🔴 Registered business name (if it differs) and any license or registration numbers to display.
- 🔴 Privacy Policy and Terms pages are not present. The form collects personal data, so the owner or their legal adviser should supply the policy text.

### Mobile CTA (`src/components/layout/MobileCtaBar.tsx`)
- ✅ Fixed Call + Get a Free Quote bar below 640px. The body is padded so the bar never covers the footer.
- 🛠 The bar covered the form's submit area and was redundant while the quote form was on screen. **[fixed: it hides while the quote section is visible]**

### Quote form (`src/components/quote/*`, `src/lib/quote.ts`)
- ✅ All 8 fields with labels, inline errors, focus on the first invalid field, a loading state, and a demo success state. A single `submitQuoteRequest()` is the integration point.
- 🔴 **Launch blocker:** the form does not send leads anywhere yet. It must be connected to an email service, API route or Supabase (Phase 2) before launch, otherwise enquiries are silently lost.
- 🔴 Currency for the monthly-bill field (currently free text, no symbol). Response-time promise. Privacy statement wording.
- 🛠 Errors only appeared after pressing submit. **[fixed: fields validate on blur once touched]**
- 🛠 Generic "Select an option" placeholder text, no character counter on the message, and placeholder text contrast was 3.6:1. **[fixed]**
- 🛠 No spam protection. **[fixed: a hidden honeypot field; real protection should be added server-side in Phase 2]**

### SEO
- ✅ Per-page title, description, canonical, Open Graph and Twitter tags (`src/lib/seo.ts`). Also sitemap, robots, LocalBusiness and FAQPage JSON-LD, OG image, and prepared service-area structure.
- 🟡 JSON-LD includes the placeholder phone, email, Facebook and service areas. It will be correct once §2 is filled in.
- 🔴 Final domain (`NEXT_PUBLIC_SITE_URL`). Real service areas for location pages.
- 🛠 If `NEXT_PUBLIC_SITE_URL` was not set on Vercel, canonical and OG URLs fell back to `http://localhost:3000`. **[fixed: falls back to Vercel's production URL]**
- 🛠 Added BreadcrumbList JSON-LD on inner pages, a web manifest and an Apple touch icon. **[fixed]**
- 🛠 Recommended later: Google Search Console verification, and a Google Business Profile with matching name, address and phone.

### Accessibility
- ✅ Semantic landmarks, skip link, visible focus rings, labelled form controls, `aria-invalid` and `aria-describedby`, accessible accordion, decorative icons hidden, alt text on all images, reduced-motion support.
- ✅ Contrast checked: body text 5.7:1, orange text 5.0:1, buttons 6.7:1. Only the form placeholder text failed. **[fixed]**
- 🛠 Heading skips, menu focus handling, placeholder contrast. **[fixed]**

### Responsive behavior
- ✅ Verified at 1440, 1024, 768 and 375px on all 7 pages with no horizontal scrolling.
- 🛠 Hero headline wrap at 1024px, anchor offsets at ≥768px, mobile CTA overlapping the form. **[fixed]**

### Performance and security
- ✅ All pages are statically generated. `next/image` serves AVIF/WebP, the hero image is prioritised, and the only runtime dependencies are next, react and react-dom.
- 🛠 No security headers were set. **[fixed: nosniff, Referrer-Policy, X-Frame-Options and Permissions-Policy in `next.config.ts`]**

---

## 2. Placeholder inventory (exact controlling files)

| Placeholder | Current value | Controlling file | Where it appears |
| --- | --- | --- | --- |
| Phone | `+00 000 000 0000` / `tel:+000000000000` | `src/lib/site.ts` → `contact.phone`, `contact.phoneHref` | Header top bar, mobile menu, mobile CTA bar, CTA banners, FAQ help box, quote section, footer, JSON-LD |
| Email | `info@example.com` | `src/lib/site.ts` → `contact.email` | Header top bar, quote section, footer, JSON-LD |
| Facebook | `https://www.facebook.com/` (generic) | `src/lib/site.ts` → `social.facebook` | Header top bar, quote section, footer, JSON-LD `sameAs` |
| Address | `Office address to follow` | `src/lib/site.ts` → `contact.address` | Footer |
| Office hours | `Mon – Sat, 8:00 AM – 5:00 PM` | `src/lib/site.ts` → `contact.hours` | Quote section, footer |
| Service areas | `Service Area 1–3`, `Region placeholder` | `src/data/service-areas.ts` | JSON-LD `areaServed`; future location pages and sitemap |
| Company statistics | `100+` systems, `10+` years, `24/7` monitoring | `src/lib/site.ts` → `stats` | About section stats row and the orange "years" badge (`src/components/sections/AboutSection.tsx`) |
| Testimonials | Maria S., Daniel R., Angela T. (fictional) | `src/data/testimonials.ts` | Home, About, Projects |
| Testimonial rating | 5 stars, "Rated 5 out of 5" | `src/components/sections/Testimonials.tsx` | Testimonial cards |
| Project data | 6 fictional projects, locations like `City, Province`, sizes, descriptions | `src/data/projects.ts` | Home (first 3), Projects page |
| Savings percentages | 60% / 75% / 70% offsets, system size ranges | `src/data/benefits.ts` → `savingsExamples` | Benefits section (Home, Net Metering) |
| Response time | "within 1–2 business days" | `src/components/quote/QuoteForm.tsx`, `src/app/contact/page.tsx` | Form success message, Contact hero |
| Logo | Inline SVG sun + panel mark with text | `src/components/layout/Logo.tsx`; favicon `src/app/icon.svg`; Apple icon `src/app/apple-icon.png` | Header, footer, browser tab |
| Social share image | Generated illustration with company name | `public/images/og-image.jpg` (from `scripts/generate-placeholders.mjs`); path in `src/lib/site.ts` → `ogImage` | Link previews |
| Hero image | Generated illustration | `public/images/hero.jpg` (imported in `src/components/sections/Hero.tsx`) | Home hero |
| About image | Generated illustration | `public/images/about.jpg` (imported in `src/components/sections/AboutSection.tsx`) | Home, About |
| Project images | 6 generated illustrations | `public/images/projects/*.jpg` (paths in `src/data/projects.ts`) | Project cards |

### Business claims to confirm (wording the owner must approve)

| Claim | File |
| --- | --- |
| "Free site assessment", "Quality, warrantied components", "Save from month one" | `src/components/sections/Hero.tsx` |
| "Tier-1 components", "Trained installers and engineers", "We handle the paperwork" | `src/data/why-choose-us.ts` |
| Service details: hybrid/battery-ready, carport and ground-mount, ROI projections, monitoring setup, panel cleaning; form options "Battery / Hybrid System", "Maintenance & Repair" | `src/data/services.ts` |
| 5-step process incl. "monitoring & support" | `src/data/services.ts` → `installationProcess` |
| "Transparent proposals with no hidden costs", "After-sales support and system monitoring" | `src/components/sections/AboutSection.tsx` |
| Mission, approach and commitment statements | `src/app/about/page.tsx` |
| Net-metering assistance steps and document list | `src/app/net-metering/page.tsx`, `src/data/net-metering.ts` |
| Install timelines (1–3 days and 1–4 weeks), battery answer, "complete checklist for your area" | `src/data/faqs.ts` |
| "Higher property value", "Protection from rate increases" | `src/data/benefits.ts` |
| "No-obligation" proposal and quote | `src/components/quote/QuoteSection.tsx`, `src/components/sections/CtaBanner.tsx`, `src/data/faqs.ts` |
| "Your details are only used to prepare your quotation" | `src/components/quote/QuoteForm.tsx` |
| "Completed by our team" (projects intro), "Homeowners and businesses trust us" | `src/components/sections/ProjectsSection.tsx`, `src/app/projects/page.tsx`, `src/components/sections/Testimonials.tsx` |

---

## 3. Required before launch

**Blockers**
1. Connect the quote form to a real destination (Phase 2). Today every enquiry is discarded.
2. Replace the fictional testimonials and projects with real, approved ones, or remove those sections. Publishing invented reviews or projects as genuine is misleading and may breach consumer-protection rules.
3. Real phone, email, Facebook URL, address and hours in `src/lib/site.ts`.
4. Privacy Policy page (the form collects personal data) and the final privacy statement wording.
5. Set `NEXT_PUBLIC_SITE_URL` to the final domain.

**Strongly recommended**
6. Official logo (SVG) and favicon, plus real photography for the hero, about section and projects.
7. Owner sign-off on every claim in the table above, the statistics and the savings percentages.
8. Real service areas, then build the `/service-areas/[slug]` location pages.
9. Utility-specific net-metering document checklist and timelines.
10. Analytics and Google Search Console, and a Google Business Profile with consistent name, address and phone.
