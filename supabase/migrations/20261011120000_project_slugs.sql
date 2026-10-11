-- =============================================================================
-- Project page addresses: /projects/<slug>
--
-- * New unique, URL-safe `slug` column on projects (ids and ordering untouched).
-- * Existing projects get a slug from their title.
-- * New projects (or a slug cleared in the admin) get one automatically; an
--   admin can also type a custom slug. Changing a title does NOT change the
--   slug, so published links keep working.
-- =============================================================================

alter table public.projects add column if not exists slug text;

alter table public.projects drop constraint if exists projects_slug_format;
alter table public.projects
  add constraint projects_slug_format
  check (slug is null or (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80));

-- Fills an empty slug from the title, adding -2, -3 … if it is already taken.
-- Trigger-only function (not callable through the API).
create or replace function public.projects_fill_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  n int;
begin
  if new.slug is not null and btrim(new.slug) <> '' then
    return new;
  end if;
  base := trim(both '-' from regexp_replace(lower(coalesce(new.title, '')), '[^a-z0-9]+', '-', 'g'));
  base := trim(both '-' from left(base, 70));
  if base = '' then
    base := 'project';
  end if;
  -- First free address: base, base-2, base-3 …
  select min(s.i) into n
  from generate_series(1, 10000) as s(i)
  where not exists (
    select 1 from public.projects p
    where p.id <> new.id
      and p.slug = case when s.i = 1 then base else base || '-' || s.i end
  );
  new.slug := case when n = 1 then base else base || '-' || n end;
  return new;
end;
$$;

revoke execute on function public.projects_fill_slug() from public, anon, authenticated;

drop trigger if exists projects_fill_slug on public.projects;
create trigger projects_fill_slug before insert or update on public.projects
  for each row execute function public.projects_fill_slug();

-- Backfill existing rows (the trigger fills each empty slug).
update public.projects set slug = null where slug is null;

alter table public.projects alter column slug set not null;
create unique index if not exists projects_slug_key on public.projects (slug);
