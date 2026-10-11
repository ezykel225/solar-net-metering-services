-- =============================================================================
-- New completed project with real photos: Tierra Alta, Valencia (Oct 2026).
--
-- Photos are the client's original files, served from the website itself
-- (public/images/projects/tierra-alta/). The admin can replace or add photos
-- (Supabase Storage uploads) from Admin → Projects at any time.
--
-- Inserted as DRAFT: publish it in Admin → Projects once the website version
-- that contains these photo files is deployed (otherwise the live site would
-- show the project without its images). Safe to re-run (no duplicates).
-- =============================================================================

insert into public.projects (
  title, location, categories, system_size, battery_size, description,
  main_image_path, main_image_alt, image_is_illustration, additional_image_paths,
  is_featured, status, display_order
)
select
  'Tierra Alta Hybrid Solar + Net Metering Installation',
  'Tierra Alta, Valencia, Negros Oriental',
  array['Residential Solar', 'Hybrid Solar', 'Net Metering']::text[],
  '10.8kW solar array · 12kW hybrid inverter',
  '32kWh',
  'A completed hybrid solar and net-metering installation in Tierra Alta, Valencia, featuring an 18-panel 10.8kW solar array (18 × 600W panels), a 12kW hybrid inverter and 32kWh of battery storage (2 × 16kWh batteries). The system is designed to use solar energy during the day, store available energy in its batteries, and support net-metering export when applicable.',
  '/images/projects/tierra-alta/tierra-alta-rooftop-solar-array.webp',
  'Completed EG Solar Products Trading hybrid solar installation in Tierra Alta, Valencia: solar panels on a tiled roof',
  false,
  array[
    '/images/projects/tierra-alta/tierra-alta-rooftop-panels.webp',
    '/images/projects/tierra-alta/tierra-alta-inverter-and-batteries.webp',
    '/images/projects/tierra-alta/tierra-alta-inverter-and-batteries-2.webp',
    '/images/projects/tierra-alta/tierra-alta-net-meter.webp'
  ]::text[],
  true,
  'draft',
  0
where not exists (
  select 1 from public.projects where title = 'Tierra Alta Hybrid Solar + Net Metering Installation'
);
