-- Enable open lookup on orders by order_number and ensure admins and checkout succeed without RLS blocks
drop policy if exists "anyone can view orders by order number" on public.orders;
create policy "anyone can view orders by order number"
on public.orders
for select
to anon, authenticated
using (true);

drop policy if exists "anyone can view order items" on public.order_items;
create policy "anyone can view order items"
on public.order_items
for select
to anon, authenticated
using (true);

