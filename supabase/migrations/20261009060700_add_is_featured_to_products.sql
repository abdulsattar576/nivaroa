-- Add is_featured column to products table for homepage carousel and highlights
alter table public.products
add column if not exists is_featured boolean not null default false;

-- Partial index for high performance retrieval of featured products
create index if not exists idx_products_is_featured
on public.products (is_featured, created_at desc)
where is_featured = true;

