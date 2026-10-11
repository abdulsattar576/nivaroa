-- Create Orders Table
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text unique not null,
    user_id uuid references auth.users(id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method text not null default 'cod' check (payment_method in ('cod', 'easypaisa', 'card')),
    payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address text not null,
    city text not null,
    postal_code text,
    notes text,
    subtotal numeric(10, 2) not null check (subtotal >= 0),
    shipping_fee numeric(10, 2) not null default 0 check (shipping_fee >= 0),
    total numeric(10, 2) not null check (total >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create Order Items Table
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    product_image text,
    price numeric(10, 2) not null check (price >= 0),
    quantity integer not null check (quantity > 0),
    total numeric(10, 2) not null check (total >= 0),
    created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for public.orders
-- 1. Users can view their own orders
create policy "users can view their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id or (select public.is_admin()));

-- 2. Admins can view all orders
create policy "admins can view all orders"
on public.orders
for select
to authenticated
using ((select public.is_admin()));

-- 3. Any user (guest or authenticated) can create an order
create policy "anyone can insert orders"
on public.orders
for insert
to anon, authenticated
with check (true);

-- 4. Admins can update orders (e.g. status)
create policy "admins can update orders"
on public.orders
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- 5. Admins can delete orders
create policy "admins can delete orders"
on public.orders
for delete
to authenticated
using ((select public.is_admin()));

-- Policies for public.order_items
-- 1. Users can view items belonging to their orders or admins
create policy "users can view their order items"
on public.order_items
for select
to authenticated
using (
    exists (
        select 1 from public.orders
        where orders.id = order_items.order_id
          and (orders.user_id = auth.uid() or (select public.is_admin()))
    )
);

-- 2. Anyone can insert order items during checkout
create policy "anyone can insert order items"
on public.order_items
for insert
to anon, authenticated
with check (true);

-- 3. Admins can update order items
create policy "admins can update order items"
on public.order_items
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- 4. Admins can delete order items
create policy "admins can delete order items"
on public.order_items
for delete
to authenticated
using ((select public.is_admin()));

