-- Extend products table with fields for rich product details page
alter table public.products
  add column if not exists slug text,
  add column if not exists images text[] default '{}'::text[],
  add column if not exists compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  add column if not exists sku text,
  add column if not exists highlights text[] default '{}'::text[],
  add column if not exists specifications jsonb default '{}'::jsonb,
  add column if not exists badge text,
  add column if not exists rating numeric(3, 2) default 5.0 check (rating >= 0 and rating <= 5),
  add column if not exists reviews_count integer default 0 check (reviews_count >= 0);

-- Populate slug for all existing products from their names
update public.products
set slug = lower(trim(both '-' from regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null or slug = '';

-- Fallback for empty slugs
update public.products
set slug = 'product-' || substr(id::text, 1, 8)
where slug is null or slug = '';

-- Ensure slugs are unique for existing records
with duplicates as (
  select id, slug, row_number() over (partition by slug order by created_at) as rn
  from public.products
)
update public.products p
set slug = p.slug || '-' || substr(p.id::text, 1, 6)
from duplicates d
where p.id = d.id and d.rn > 1;

-- Add unique constraint and index on slug
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_slug_key'
  ) then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
end $$;

create index if not exists idx_products_slug on public.products(slug);

-- Sync images array for existing records that have image_path
update public.products
set images = array[image_path]
where (images is null or cardinality(images) = 0)
  and image_path is not null
  and image_path <> '';

-- Auto-slugify trigger for future inserts and updates
create or replace function public.generate_product_slug()
returns trigger as $$
declare
  base_slug text;
  new_slug text;
  counter integer := 1;
begin
  -- Automatically sync images array if image_path is given and images is empty
  if (new.images is null or cardinality(new.images) = 0) and (new.image_path is not null and new.image_path <> '') then
    new.images := array[new.image_path];
  end if;

  -- Generate slug if empty
  if new.slug is null or trim(new.slug) = '' then
    base_slug := lower(regexp_replace(coalesce(new.name, 'product'), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    if base_slug = '' then
      base_slug := 'product';
    end if;
    new_slug := base_slug;
    while exists (
      select 1 from public.products 
      where slug = new_slug 
        and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) loop
      counter := counter + 1;
      new_slug := base_slug || '-' || counter;
    end loop;
    new.slug := new_slug;
  else
    new.slug := lower(regexp_replace(new.slug, '[^a-zA-Z0-9]+', '-', 'g'));
    new.slug := trim(both '-' from new.slug);
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists set_product_slug on public.products;
create trigger set_product_slug
before insert or update of name, slug on public.products
for each row
execute function public.generate_product_slug();

