-- =============================================================================
-- Hardening: remove table privileges the API roles never need.
--
-- Hosted projects give anon/authenticated TRUNCATE, REFERENCES, TRIGGER
-- (and MAINTAIN on Postgres 17) on new tables by default. The Data API can't
-- use them, but TRUNCATE ignores RLS, so they are revoked as defence in depth.
-- service_role (server only) is unchanged.
-- =============================================================================

revoke truncate, references, trigger on all tables in schema public from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke truncate, references, trigger on tables from anon, authenticated;

do $$
begin
  if current_setting('server_version_num')::int >= 170000 then
    execute 'revoke maintain on all tables in schema public from anon, authenticated';
    execute 'alter default privileges for role postgres in schema public revoke maintain on tables from anon, authenticated';
  end if;
end;
$$;

-- Supabase's automatic-RLS event trigger function (present when "Enable
-- automatic RLS" is on). It only runs as an event trigger; API roles never
-- need to execute it directly.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
