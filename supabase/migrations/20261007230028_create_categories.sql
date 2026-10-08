create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),

    name text not null,
    slug text not null unique,
    parent_id uuid references public.categories(id) on delete set null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Helper function to check if the current user is an administrator
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = 'admin'::public.user_role
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;

-- Public read access: Anyone (anon or authenticated) can browse categories
drop policy if exists "categories are readable by everyone" on public.categories;
create policy "categories are readable by everyone"
on public.categories
for select
to anon, authenticated
using (true);

-- Admin mutation access: Only administrators can insert categories
drop policy if exists "admins can insert categories" on public.categories;
create policy "admins can insert categories"
on public.categories
for insert
to authenticated
with check ((select public.is_admin()));

-- Admin mutation access: Only administrators can update categories
drop policy if exists "admins can update categories" on public.categories;
create policy "admins can update categories"
on public.categories
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Admin mutation access: Only administrators can delete categories
drop policy if exists "admins can delete categories" on public.categories;
create policy "admins can delete categories"
on public.categories
for delete
to authenticated
using ((select public.is_admin()));