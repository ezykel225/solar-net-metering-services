# Content Status

Last updated with the business information confirmed from the company's public Facebook page and screenshots.
Three levels:

- ✅ **Confirmed:** published by the business; used as-is.
- 🟡 **Needs owner approval:** website wording written from confirmed facts, or general explanations. Accurate to what we know, but the owner should approve the final copy.
- 🔴 **Placeholder / missing:** still not real, or hidden until supplied.

---

## ✅ Confirmed

| Content | Value | File |
| --- | --- | --- |
| Business name | Solar Net Metering Services | `src/lib/site.ts` |
| Mobile | 0997 731 0543 (`tel:+639977310543`) | `src/lib/site.ts` |
| Email | solarandnetmeteringservices@gmail.com | `src/lib/site.ts` |
| Facebook | facebook.com/profile.php?id=61567843505161 | `src/lib/site.ts` |
| Messenger (all "Message Us" CTAs) | facebook.com/messages/t/61567843505161/ | `src/lib/site.ts` |
| Area wording | "Serving Dumaguete City and nearby areas in Negros Oriental, with selected projects in surrounding locations." | `src/lib/site.ts` |
| Locations with public work/customers | Dumaguete City, Sibulan, Siaton, Siquijor (not a complete list) | `src/data/service-areas.ts` |
| Services | Residential, commercial, hybrid, panels, inverters, battery storage, installation, net-metering services/assistance, solar street lights, site assessment/quotation, installation support | `src/data/services.ts` |
| Net-metering cooperatives | NORECO 1, NORECO 2 | `src/data/net-metering.ts` |
| Advertised requirements | Building Permit, Electrical Permit, Final Inspection Permit, valid government-issued ID of the owner, plus the required disclaimer | `src/data/net-metering.ts` |
| Project: Siaton | 10kW hybrid system, 15kWh battery storage, Siaton, Negros Oriental, residential/hybrid | `src/data/projects.ts` |
| Project: Sibulan | Solar installation in Sibulan; size and category not stated | `src/data/projects.ts` |
| Customer result | 6kW hybrid; ≈₱5,553 → ≈₱90 after one month, with the savings disclaimer | `src/data/case-studies.ts` |
| Testimonial | "Salamat kaayo sa Solar and Netmetering Services. Dako jud og tabang sa among bill sa kuryente!" (Ma'am Jing T.) | `src/data/testimonials.ts` |
| Packages | 3kW (₱180,000) and 5kW (₱330,000) inclusions, with the price/availability note | `src/data/services.ts` |
| Street-light features | Integrated panel/LED/battery/controller, dusk-to-dawn, remote control, weather-resistant, bulk orders, nationwide shipping | `src/data/services.ts` |
| Brands | SRNE, Deye, LVTopsun, with a "no partnership implied" note | `src/data/services.ts` |
| Currency | Peso (₱) on the bill field | `src/components/quote/QuoteForm.tsx` |

## 🟡 Needs owner approval (wording)

| Content | File |
| --- | --- |
| Service card summaries and bullet points | `src/data/services.ts` (`services`) |
| 5-step project process (inquiry → assessment → installation → net metering → support) | `src/data/services.ts` (`installationProcess`) |
| "Why Choose Us" items | `src/data/why-choose-us.ts` |
| Benefits wording (bill reduction, credits, battery backup, clean energy) | `src/data/benefits.ts` |
| FAQ answers, especially installation time, cloudy weather and batteries | `src/data/faqs.ts` |
| "How we help" list on the Net Metering page | `src/app/net-metering/page.tsx` |
| About section intro and bullet points | `src/components/sections/AboutSection.tsx` |
| Hero highlights and float-card text | `src/components/sections/Hero.tsx` |
| Quote section steps, form success message, privacy line | `src/components/quote/QuoteSection.tsx`, `src/components/quote/QuoteForm.tsx` |
| CTA banner texts | `src/components/sections/CtaBanner.tsx`, page files |
| English translation of the testimonial (written by the web team) and the "Customer" label | `src/data/testimonials.ts`, `src/components/sections/Testimonials.tsx` |
| Project descriptions (Siaton, Sibulan) | `src/data/projects.ts` |
| **"Get a Free Quote"**: are quotations free? | `src/data/navigation.ts` → set `QUOTES_ARE_FREE` to `false` and every "free" wording updates: buttons, quote heading, submit button, Contact title |
| **Solar Calculator assumptions**: ₱12/kWh rate, 4.5 peak sun hours, 80% efficiency, 580W panels, exported energy valued at 50% of retail, 85% max bill reduction, ₱1,000–₱500,000 bill range | `src/lib/solar-calculator.ts` (`calculatorAssumptions`) |
| Calculator option wording (daytime usage, battery options, appliance list, result notes) | `src/lib/solar-calculator.ts` |
| Why Choose Us intro sentence (reworded to confirmed facts) | `src/components/sections/WhyChooseUs.tsx` |
| Property type options in the form | `src/lib/quote.ts` (`propertyTypes`) |
| Keep the package section live? (prices may change) | `src/data/services.ts` (`solarPackages`) |

## 🔴 Placeholder or missing

| Item | Current state | File |
| --- | --- | --- |
| Office address | Hidden; the service area is shown instead | `src/lib/site.ts` (`contact.address`) |
| Office hours | Hidden | `src/lib/site.ts` (`contact.hours`) |
| Company statistics | Hidden (empty list) | `src/lib/site.ts` (`stats`) |
| Logo | Inline illustrated mark | `src/components/layout/Logo.tsx`, `src/app/icon.svg`, `src/app/apple-icon.png` |
| Social share image | Generated illustration | `public/images/og-image.jpg` |
| Hero image | Illustration (alt text says so) | `public/images/hero.jpg` |
| About image | Illustration (alt text says so) | `public/images/about.jpg` |
| Project photos | Illustrations, labelled "Illustration · project photo coming soon" | `public/images/projects/siaton-hybrid.jpg`, `sibulan-installation.jpg` |
| Sibulan project size and category | Not shown | `src/data/projects.ts` |
| More projects and testimonials | Only confirmed ones shown | `src/data/projects.ts`, `src/data/testimonials.ts` |
| Street-light model specifications | Not shown (optional) | `src/data/services.ts` |
| Net-metering timelines and fees | Not stated | `src/data/faqs.ts` |
| Privacy Policy and consent checkbox | Not built | see `docs/QUOTE_SUBMISSION_PLAN.md` §6 |
| Quote form backend | Demo mode (nothing is sent) | see `docs/QUOTE_SUBMISSION_PLAN.md` |
| Final domain | Not set | `NEXT_PUBLIC_SITE_URL` (Vercel) |

## Asset replacement guide

Drop-in replacements: keep the same file name and the site picks the new file up on the next build.

| Asset | Replace this file | Also update | Recommended |
| --- | --- | --- | --- |
| **Logo (header and footer)** | Inline SVG in `src/components/layout/Logo.tsx` (one component; `onDark` prop renders the footer version) | Swap the `<svg>` for `<Image src="/images/logo.svg" …>` and, if supplied, a white version for `onDark` | SVG, horizontal; plus a white/reversed version |
| Favicon | `src/app/icon.svg` | — | Square SVG mark |
| Phone home-screen icon | `src/app/apple-icon.png` | `src/app/manifest.ts` lists both icons | 180×180 PNG, no transparency |
| Social share image | `public/images/og-image.jpg` (currently generated by `scripts/generate-placeholders.mjs`) | Path in `src/lib/site.ts` → `ogImage` | 1200×630 JPG with the real logo |
| **Hero photo** | `public/images/hero.jpg` (imported in `src/components/sections/Hero.tsx`) | `alt` text in `Hero.tsx` (currently says "Illustration…") | Landscape, ≥2000px wide, a home with installed panels |
| **About photo** | `public/images/about.jpg` (imported in `src/components/sections/AboutSection.tsx`) | `alt` text in `AboutSection.tsx` | ≥1600px, team at work or an installation close-up |
| **Siaton project photo** | `public/images/projects/siaton-hybrid.jpg` | `src/data/projects.ts` → Siaton entry: `imageAlt`, and set `imageIsIllustration: false` to remove the "Illustration" label | Landscape 16:10, ≥1600px, with client permission |
| **Sibulan project photo** | `public/images/projects/sibulan-installation.jpg` | `src/data/projects.ts` → Sibulan entry: `imageAlt`, `imageIsIllustration: false` | Same as above |

After replacing photos, stop using `npm run images:placeholders`, because it would overwrite them. Remove that script, or remove the replaced entries from its `images` list.

## Claims policy (applies to all future edits)

Never publish a guaranteed zero bill, guaranteed percentage savings, guaranteed net-metering approval, guaranteed property value increase, or guaranteed savings amounts.
Customer results always carry the savings disclaimer. Solar Calculator results are always ranges, shown with the calculator disclaimer; they never show a percentage reduction. Do not use "98% savings" as a general claim. Do not use "only 5 slots" unless the promotion is deliberately kept live.
