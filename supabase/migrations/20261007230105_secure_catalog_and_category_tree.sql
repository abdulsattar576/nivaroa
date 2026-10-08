-- Public catalog reads are intentional; all catalog mutations require an admin.
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

alter table public.categories enable row level security;

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    price numeric(10, 2) not null check (price >= 0),
    category_id uuid references public.categories(id) on delete set null,
    image_path text,
    product_description text,
    quantity integer not null default 0 check (quantity >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "categories are readable by everyone" on public.categories;
create policy "categories are readable by everyone"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "admins can insert categories" on public.categories;
create policy "admins can insert categories"
on public.categories
for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "admins can update categories" on public.categories;
create policy "admins can update categories"
on public.categories
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "admins can delete categories" on public.categories;
create policy "admins can delete categories"
on public.categories
for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "products are readable by everyone" on public.products;
create policy "products are readable by everyone"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "admins can insert products" on public.products;
create policy "admins can insert products"
on public.products
for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "admins can update products" on public.products;
create policy "admins can update products"
on public.products
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "admins can delete products" on public.products;
create policy "admins can delete products"
on public.products
for delete
to authenticated
using ((select public.is_admin()));

alter table public.categories
    drop constraint if exists categories_parent_id_fkey,
    add constraint categories_parent_id_fkey
        foreign key (parent_id)
        references public.categories(id)
        on delete restrict;

alter table public.products
    drop constraint if exists products_category_id_fkey,
    add constraint products_category_id_fkey
        foreign key (category_id)
        references public.categories(id)
        on delete restrict;

create or replace function public.prevent_category_cycles()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.parent_id is null then
        return new;
    end if;

    -- Serialize hierarchy changes so concurrent updates cannot create a cycle.
    perform pg_advisory_xact_lock(774291);

    if new.parent_id = new.id then
        raise exception 'A category cannot be its own parent.'
            using errcode = '23514';
    end if;

    if exists (
        with recursive descendants(id) as (
            select id
            from public.categories
            where parent_id = new.id

            union

            select category.id
            from public.categories as category
            join descendants on category.parent_id = descendants.id
        )
        select 1
        from descendants
        where id = new.parent_id
    ) then
        raise exception 'A category cannot be moved below one of its descendants.'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

drop trigger if exists prevent_category_cycles on public.categories;
create trigger prevent_category_cycles
before insert or update of parent_id on public.categories
for each row execute function public.prevent_category_cycles();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();