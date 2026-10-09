create table public.products (
    id uuid primary key default gen_random_uuid(),

    name text not null,

    price numeric(10, 2) not null check (price >= 0),

    category_id uuid
        references public.categories(id)
        on delete set null,

    image_path text,

    product_description text,

    quantity integer not null default 0 check (quantity >= 0),
   
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Public read access: Anyone (anon or authenticated) can view products
create policy "products are readable by everyone"
on public.products
for select
to anon, authenticated
using (true);

-- Admin mutation access: Only administrators can insert products
create policy "admins can insert products"
on public.products
for insert
to authenticated
with check ((select public.is_admin()));

-- Admin mutation access: Only administrators can update products
create policy "admins can update products"
on public.products
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Admin mutation access: Only administrators can delete products
create policy "admins can delete products"
on public.products
for delete
to authenticated
using ((select public.is_admin()));