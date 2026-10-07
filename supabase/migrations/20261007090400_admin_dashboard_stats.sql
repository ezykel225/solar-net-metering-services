-- =============================================================================
-- Dashboard counts in one request (instead of one request per card).
--
-- SECURITY INVOKER: runs with the caller's own permissions, so RLS still
-- applies. It returns NULL unless the caller is an admin (is_admin()).
-- =============================================================================

create or replace function public.admin_dashboard_stats()
returns json
language sql
stable
security invoker
set search_path = ''
as $$
  select json_build_object(
    'projects_total', (select count(*) from public.projects where status <> 'archived'),
    'projects_published', (select count(*) from public.projects where status = 'published'),
    'packages_active', (select count(*) from public.solar_packages where status = 'published' and is_active),
    'testimonials_published', (select count(*) from public.testimonials where status = 'published'),
    'quotes_new', (select count(*) from public.quote_requests where status = 'new'),
    'promotions_active', (
      select count(*) from public.promotions
      where is_active
        and (starts_on is null or starts_on <= (now() at time zone 'Asia/Manila')::date)
        and (ends_on is null or ends_on >= (now() at time zone 'Asia/Manila')::date)
    ),
    'export_credit_verified', (select export_credit_verified from public.calculator_settings)
  )
  where (select public.is_admin());
$$;

revoke execute on function public.admin_dashboard_stats() from public, anon;
grant execute on function public.admin_dashboard_stats() to authenticated;
