-- Create a public storage bucket for product images if it doesn't already exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'products',
    'products',
    true,
    10485760, -- 10MB max file size
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

-- Storage RLS Policies for the products bucket
drop policy if exists "product images are publicly accessible" on storage.objects;
create policy "product images are publicly accessible"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'products'
    and (select public.is_admin())
);

drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images"
on storage.objects for update
to authenticated
using (
    bucket_id = 'products'
    and (select public.is_admin())
);

drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'products'
    and (select public.is_admin())
);

