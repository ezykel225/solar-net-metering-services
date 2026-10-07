-- =============================================================================
-- Seed: confirmed content migrated from the local TypeScript data files
-- (generated from src/lib/site.ts, src/data/*.ts and src/lib/solar-calculator.ts).
-- Safe to run once on an empty database; each insert is skipped if data exists.
-- =============================================================================

insert into public.business_settings (id, business_name, phone_display, phone_e164, email, facebook_url, messenger_url, service_area_text, service_area_short, office_address, business_hours, quote_cta_label, quotes_are_free)
values (true, 'Solar Net Metering Services', '0997 731 0543', '+639977310543', 'solarandnetmeteringservices@gmail.com', 'https://www.facebook.com/profile.php?id=61567843505161', 'https://www.facebook.com/messages/t/61567843505161/', 'Serving Dumaguete City and nearby areas in Negros Oriental, with selected projects in surrounding locations.', 'Dumaguete City & Negros Oriental', null, null, 'Get a Free Quote', true)
on conflict (id) do nothing;

insert into public.calculator_settings (id, residential_rate, low_voltage_rate, high_voltage_rate, rate_source, rate_billing_period, rates_updated_on, not_sure_method, not_sure_custom_rate, peak_sun_hours, system_efficiency, panel_wattage, coverage_low, coverage_medium, coverage_high, min_monthly_bill, max_monthly_bill, max_bill_reduction_share, export_credit_ratio, export_credit_verified, export_credit_source, disclaimer)
values (true, 14.3522, 13.5024, 10.9692, 'NORECO published power rates', null, '2026-10-07', 'average', null, 4.5, 0.8, 580, 0.6, 0.75, 0.9, 1000, 500000, 0.85, 0.5, false, 'Placeholder assumption. Not yet confirmed by an official NORECO net-metering credit reference.', 'This calculator provides an initial estimate only. Actual system size, solar generation and savings depend on electricity usage, roof orientation, shading, equipment efficiency, weather, utility rates, site conditions and net-metering approval.')
on conflict (id) do nothing;

insert into public.projects (title, location, categories, system_size, battery_size, description, main_image_path, main_image_alt, image_is_illustration, is_featured, status, display_order)
select * from (values
  ('Siaton Hybrid Solar Installation', 'Siaton, Negros Oriental', array['Residential Solar', 'Hybrid Solar']::text[], '10kW hybrid solar system', '15kWh', 'A 10kW hybrid solar system with 15kWh of battery storage, installed for a residential client in Siaton.', '/images/projects/siaton-hybrid.jpg', 'Illustration of a house with rooftop solar panels', true, false, 'published', 1),
  ('Sibulan Solar Installation', 'Sibulan, Negros Oriental', '{}'::text[], null, null, 'A solar installation for a client in Sibulan, who shared their satisfaction with the completed project.', '/images/projects/sibulan-installation.jpg', 'Illustration of a home with solar panels on its roof at sunset', true, false, 'published', 2)
) as v(title, location, categories, system_size, battery_size, description, main_image_path, main_image_alt, image_is_illustration, is_featured, status, display_order)
where not exists (select 1 from public.projects);

insert into public.solar_packages (name, system_size, price_php, inclusions, note, is_active, is_featured, status, display_order)
select * from (values
  ('3kW Hybrid Solar System Package', '3kW', 180000, array['3kW Hybrid Inverter', '24V 100Ah wall-mounted battery', '5 high-efficiency solar panels (around 580W–600W each)', 'Mounting structures / basic accessories', 'Wiring and protection devices', 'Basic installation support']::text[], 'Prices and package availability are subject to confirmation and may change.', true, false, 'published', 1),
  ('5kW Hybrid Solar System Package', '5kW', 330000, array['5kW Hybrid Inverter', '10kWh wall-mounted lithium battery', '8–9 high-efficiency solar panels (around 580W–600W each)', 'Mounting structures / basic accessories', 'Wiring and protection devices', 'Basic installation support', 'Net-metering assistance']::text[], 'Prices and package availability are subject to confirmation and may change.', true, false, 'published', 2)
) as v(name, system_size, price_php, inclusions, note, is_active, is_featured, status, display_order)
where not exists (select 1 from public.solar_packages);

insert into public.testimonials (display_name, quote_original, quote_lang, translation_en, location, status, display_order)
select * from (values
  ('Ma’am Jing T.', 'Salamat kaayo sa Solar and Netmetering Services. Dako jud og tabang sa among bill sa kuryente!', 'ceb', 'Thank you very much to Solar and Netmetering Services. It''s a really big help on our electricity bill!', null, 'published', 1)
) as v(display_name, quote_original, quote_lang, translation_en, location, status, display_order)
where not exists (select 1 from public.testimonials);

insert into public.services (slug, title, description, details, icon, is_active, display_order)
select * from (values
  ('residential-solar', 'Residential Solar', 'Solar installation for homes, with panels, inverters and optional battery storage.', array['Site assessment and quotation', 'Solar panels and inverters', 'Hybrid systems with battery storage', 'Net-metering assistance']::text[], 'home', true, 1),
  ('commercial-solar', 'Commercial Solar', 'Solar installation for businesses that want to reduce what they buy from the grid.', array['Site assessment and quotation', 'Solar panels and inverters', 'Hybrid and battery storage options', 'Installation support']::text[], 'building', true, 2),
  ('hybrid-solar', 'Hybrid Solar & Battery Storage', 'Hybrid systems that combine solar panels, a hybrid inverter and battery storage.', array['Hybrid inverters', 'Wall-mounted battery storage', 'Solar panels', 'See our current packages below']::text[], 'battery', true, 3),
  ('net-metering', 'Net Metering', 'Net-metering services and application assistance for NORECO 1 and NORECO 2 customers.', array['Net-metering application processing for NORECO 1 and NORECO 2', 'Help preparing the advertised requirements', 'Guidance throughout the application']::text[], 'meter', true, 4),
  ('solar-street-lights', 'Solar Street Lights', 'All-in-one solar street lights with a built-in panel, LED light, battery and controller.', array['Dusk-to-dawn operation', 'Remote control', 'Weather-resistant design', 'Bulk orders and nationwide shipping']::text[], 'lamp', true, 5),
  ('installation-support', 'Site Assessment & Installation Support', 'From site assessment and quotation to installation and support for your solar system.', array['Site assessment', 'Quotation for your property', 'Solar installation', 'Installation support']::text[], 'wrench', true, 6)
) as v(slug, title, description, details, icon, is_active, display_order)
where not exists (select 1 from public.services);

insert into public.faqs (question, answer, status, display_order)
select * from (values
  ('What is net metering?', 'Net metering is an arrangement with your electric cooperative. When your solar panels produce more electricity than your property uses, the excess is exported to the grid and credited to your account, which can help reduce your electricity bill.', 'published', 1),
  ('How much can solar save me?', 'It depends on your electricity use, system size and other factors. One customer with a 6kW hybrid system shared that their monthly bill went from about ₱5,553 to about ₱90 after one month, but this is not a guaranteed result. Actual savings vary based on system size, electricity use, weather, utility charges, and other factors. Request a quotation for an estimate based on your own bill.', 'published', 2),
  ('How long does installation take?', 'It depends on the size of the system, your site and the permits involved. Contact us with your details and we can discuss an estimated schedule for your project. The net-metering application is a separate process with your electric cooperative.', 'published', 3),
  ('Can solar work during cloudy weather?', 'Yes. Solar panels still generate electricity on cloudy days, although output is lower. Grid-connected systems draw from the grid when solar production is low, and hybrid systems can also use stored battery power.', 'published', 4),
  ('What documents are required for net metering?', 'We currently help customers with requirements including a Building Permit, Electrical Permit, Final Inspection Permit and a valid government-issued ID of the owner. Requirements and processing steps may vary depending on the electric cooperative and project. Contact us for the current checklist.', 'published', 5),
  ('Do you handle the net-metering application?', 'Yes. We process net-metering applications for NORECO 1 and NORECO 2 customers and help you prepare the requirements.', 'published', 6),
  ('Do I need batteries?', 'Not necessarily. A solar system can be connected to the grid without batteries. If you want stored power for use at night or during outages, we offer hybrid solar systems with battery storage.', 'published', 7),
  ('Do you sell solar street lights?', 'Yes. We offer all-in-one solar street lights with an integrated solar panel, LED light, battery and controller. They run dusk to dawn, come with a remote control and are designed to be weather-resistant. Bulk orders and nationwide shipping are available.', 'published', 8),
  ('What brands do you use?', 'We install and promote products from brands including SRNE, Deye and LVTopsun.', 'published', 9),
  ('Which areas do you serve?', 'We serve Dumaguete City and nearby areas in Negros Oriental, with selected projects in surrounding locations such as Sibulan, Siaton and Siquijor. Contact us to check if we can serve your location.', 'published', 10),
  ('How do I get a quotation?', 'Fill out the quote form with your details and average monthly bill, call or text us, or send us a message on Facebook Messenger. Our team will get back to you to discuss your property and needs.', 'published', 11)
) as v(question, answer, status, display_order)
where not exists (select 1 from public.faqs);
