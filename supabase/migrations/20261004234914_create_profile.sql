create type public.user_role as enum(
    'user',
    'admin'
);
create table public.profiles(
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text, 
    role public.user_role not null default 'user',
    created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()

);
alter table public.profiles enable row level security;
-- create policy
create policy "user can read on profile"
on public.profiles
for select
to authenticated
using (
    auth.uid()=id
)