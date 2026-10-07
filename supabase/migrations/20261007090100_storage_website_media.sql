-- =============================================================================
-- Storage: website-media bucket for admin-uploaded images
--
--   * Public bucket: images are served to visitors via public URLs.
--   * Only admins (public.is_admin()) can upload, replace or delete.
--   * Size and type limits are enforced by Storage itself.
--   * Allowed folders: projects/, packages/, testimonials/, promotions/
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Admins may list objects in the bucket (needed by the Storage API for replace/remove).
create policy "website-media: admin read"
  on storage.objects for select to authenticated
  using (bucket_id = 'website-media' and (select public.is_admin()));

create policy "website-media: admin upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'website-media'
    and (select public.is_admin())
    and (storage.foldername(name))[1] in ('projects', 'packages', 'testimonials', 'promotions')
  );

create policy "website-media: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'website-media' and (select public.is_admin()))
  with check (
    bucket_id = 'website-media'
    and (select public.is_admin())
    and (storage.foldername(name))[1] in ('projects', 'packages', 'testimonials', 'promotions')
  );

create policy "website-media: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'website-media' and (select public.is_admin()));
