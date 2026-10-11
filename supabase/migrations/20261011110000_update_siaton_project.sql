-- =============================================================================
-- Siaton project: confirmed details from the client's completion post
-- (10kW Hybrid Solar System, 300Ah LiFePO₄ Battery). Updates the existing
-- record in place — no duplicate. Image fields are deliberately untouched:
-- the illustration and its label stay until the real photo files are added.
-- Only applies while the record still has its original seeded title.
-- =============================================================================

update public.projects set
  title = 'Siaton 10kW Hybrid Solar Installation',
  location = 'Siaton, Negros Oriental',
  categories = array['Residential Solar', 'Hybrid Solar']::text[],
  system_size = '10kW Hybrid Solar System',
  battery_size = '300Ah LiFePO₄ Battery',
  description = 'A completed 10kW hybrid solar installation in Siaton, Negros Oriental, with a 300Ah LiFePO₄ battery. The project includes the rooftop solar installation and the indoor power-system setup.'
where title = 'Siaton Hybrid Solar Installation';
