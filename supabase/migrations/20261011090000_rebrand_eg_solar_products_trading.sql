-- =============================================================================
-- Rebrand: Solar Net Metering Services → EG Solar Products Trading (Oct 2026)
--
-- Safe to re-run. Only values that still hold the previous seeded text are
-- changed, so anything an admin has since edited is left alone. Obsolete
-- services are deactivated (hidden), never deleted. Facebook/Messenger URLs
-- are intentionally unchanged (pending owner confirmation).
-- =============================================================================

-- 1. Business settings
update public.business_settings set
  business_name  = case when business_name = 'Solar Net Metering Services' then 'EG Solar Products Trading' else business_name end,
  phone_display  = case when phone_display = '0997 731 0543' then '0955 270 4060' else phone_display end,
  phone_e164     = case when phone_e164 = '+639977310543' then '+639552704060' else phone_e164 end,
  email          = case when email = 'solarandnetmeteringservices@gmail.com' then 'egsolarproductstrading@gmail.com' else email end,
  office_address = coalesce(nullif(trim(office_address), ''), 'Batinguel, Dumaguete City, Philippines')
where id;

-- 2. Services: the six confirmed categories, in this order
insert into public.services (slug, title, description, details, icon, is_active, display_order) values
  ('solar-system-supply', 'Solar System Supply',
   'Solar systems and components for homes and businesses, including inverters and batteries.',
   array['Complete solar system packages', 'Inverters', 'Batteries', 'Product inquiries and pre-orders'], 'panel', true, 1),
  ('solar-installation', 'Solar Installation',
   'Installation of solar systems for residential and commercial properties, including hybrid systems with battery storage.',
   array['Residential and commercial properties', 'Grid-tied and hybrid systems', 'Battery storage', 'Site assessment before installation'], 'home', true, 2),
  ('system-design-consultation', 'System Design & Consultation',
   'We look at your property and electricity use and recommend a suitable solar system.',
   array['Site assessment', 'Review of your electricity bill and usage', 'System sizing and quotation'], 'chart', true, 3),
  ('permits-documents', 'Permits & Documents Processing',
   'Help preparing and processing the permits and documents for your solar project.',
   array['Building Permit', 'Electrical Permit', 'Final Inspection Permit', 'Requirements can vary by project and electric cooperative'], 'fileText', true, 4),
  ('maintenance-after-sales', 'Maintenance & After-Sales Support',
   'Support after installation, including maintenance and help with questions about your system.',
   array['Solar system maintenance', 'After-sales support', 'Help with questions about your system'], 'headset', true, 6)
on conflict (slug) do nothing;

-- Existing net-metering service becomes "Net Metering Assistance" (5th), only if still the seeded wording.
update public.services set
  title = 'Net Metering Assistance',
  description = 'Net-metering application assistance for NORECO 1 and NORECO 2 customers.',
  display_order = 5
where slug = 'net-metering' and title = 'Net Metering';

-- Previous categories: hidden from the website, kept for the record (an admin can re-activate them).
update public.services set is_active = false, display_order = 100 + display_order
where slug in ('residential-solar', 'commercial-solar', 'hybrid-solar', 'solar-street-lights', 'installation-support')
  and is_active
  and display_order < 100;

-- 3. FAQs: brands now promoted, and the confirmed pre-order offer
update public.faqs set
  question = 'What brands do you offer?',
  answer = 'We offer or promote inverters from brands including Deye, Solis, GoodWe and SRNE, and batteries from brands including LVTopsun, Puston, SRNE, DuroSel and Deye. Stock and models change, so ask us about current availability.'
where question = 'What brands do you use?'
  and answer = 'We install and promote products from brands including SRNE, Deye and LVTopsun.';

insert into public.faqs (question, answer, status, display_order)
select 'Do you accept pre-orders for inverters and batteries?',
       'Yes. We accept pre-orders for inverters and batteries. Stock, models and prices change, so please contact us to confirm availability before ordering.',
       'published',
       (select coalesce(max(display_order), 0) + 1 from public.faqs)
where not exists (select 1 from public.faqs where question = 'Do you accept pre-orders for inverters and batteries?');
