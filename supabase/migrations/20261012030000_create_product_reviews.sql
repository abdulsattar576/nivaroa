-- Create Product Reviews Table for authentic customer feedback
create table if not exists public.product_reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    customer_name text not null,
    customer_email text,
    rating integer not null check (rating >= 1 and rating <= 5),
    title text,
    comment text not null,
    is_verified_buyer boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_product_reviews_product_id on public.product_reviews(product_id);
create index if not exists idx_product_reviews_created_at on public.product_reviews(created_at desc);

-- Enable RLS
alter table public.product_reviews enable row level security;

-- Policies
-- 1. Anyone can read reviews
create policy "product_reviews_are_readable_by_everyone"
on public.product_reviews
for select
to anon, authenticated
using (true);

-- 2. Anyone (logged-in user or guest customer) can submit a review
create policy "anyone_can_insert_product_reviews"
on public.product_reviews
for insert
to anon, authenticated
with check (true);

-- 3. Admins can moderate / delete reviews
create policy "admins_can_delete_product_reviews"
on public.product_reviews
for delete
to authenticated
using ((select public.is_admin()));

