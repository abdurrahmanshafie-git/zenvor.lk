create extension if not exists "pgcrypto";

create schema if not exists private;

do $$
begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

alter type public.order_status add value if not exists 'delivered';

do $$
begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null;
end $$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  price numeric(12,2) not null check (price >= 0),
  category text not null,
  description text not null default '',
  fabric text,
  fit text,
  gsm integer check (gsm is null or gsm > 0),
  sizes text[] not null default array['S','M','L','XL'],
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  image_url text not null check (image_url !~* '^\s*javascript:'),
  gallery_images text[] not null default '{}',
  series text,
  active boolean not null default true,
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  image_url text not null check (image_url !~* '^\s*javascript:'),
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ordered', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  selected_size text not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id, selected_size)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ZNV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references auth.users(id) on delete restrict,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  status public.order_status not null default 'pending',
  payment_method text not null default 'cod',
  payment_status public.payment_status not null default 'pending',
  payment_provider text,
  payment_reference text,
  payment_payload jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_matches check (total = subtotal + delivery_fee)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  selected_size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  image_url text,
  created_at timestamptz not null default now(),
  constraint order_items_line_total_matches check (line_total = unit_price * quantity)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'open', 'resolved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  change integer not null,
  stock_after integer not null check (stock_after >= 0),
  reason text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.reserve_order_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_stock integer;
begin
  if new.product_id is null then
    return new;
  end if;

  update public.products
     set stock = stock - new.quantity,
         updated_at = now()
   where id = new.product_id
     and active = true
     and stock >= new.quantity
   returning stock into next_stock;

  if next_stock is null then
    raise exception 'Insufficient stock for product %', new.product_id
      using errcode = '23514';
  end if;

  insert into public.inventory_logs (product_id, order_id, change, stock_after, reason, created_by)
  values (new.product_id, new.order_id, -new.quantity, next_stock, 'order_created', (select auth.uid()));

  return new;
end;
$$;

drop trigger if exists reserve_order_stock on public.order_items;
create trigger reserve_order_stock
after insert on public.order_items
for each row execute function private.reserve_order_stock();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','categories','products','product_images','carts','cart_items','orders','order_items','inquiries','inventory_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
drop policy if exists "Profiles are editable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select to authenticated
using ((select auth.uid()) = id or private.is_admin());
create policy "Profiles are editable by owner"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and role = 'customer');
create policy "Admins can manage profiles"
on public.profiles for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select to anon, authenticated
using (active = true or private.is_admin());
create policy "Admins manage categories"
on public.categories for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins manage products" on public.products;
create policy "Public can read active products"
on public.products for select to anon, authenticated
using (active = true or private.is_admin());
create policy "Admins manage products"
on public.products for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Public can read active product images" on public.product_images;
drop policy if exists "Admins manage product images" on public.product_images;
create policy "Public can read active product images"
on public.product_images for select to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and (products.active = true or private.is_admin())
  )
);
create policy "Admins manage product images"
on public.product_images for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Customers manage own carts" on public.carts;
create policy "Customers manage own carts"
on public.carts for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Customers manage own cart items" on public.cart_items;
create policy "Customers manage own cart items"
on public.cart_items for all to authenticated
using (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = (select auth.uid())
      and carts.status = 'active'
  )
)
with check (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = (select auth.uid())
      and carts.status = 'active'
  )
);

drop policy if exists "Customers create own orders" on public.orders;
drop policy if exists "Customers view own orders" on public.orders;
drop policy if exists "Customers delete empty pending orders" on public.orders;
drop policy if exists "Admins update orders" on public.orders;
drop policy if exists "Admins manage orders" on public.orders;
create policy "Customers create own orders"
on public.orders for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Customers view own orders"
on public.orders for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());
create policy "Customers delete empty pending orders"
on public.orders for delete to authenticated
using (
  (select auth.uid()) = user_id
  and status = 'pending'
  and not exists (select 1 from public.order_items where order_items.order_id = orders.id)
);
create policy "Admins manage orders"
on public.orders for update to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Customers create own order items" on public.order_items;
drop policy if exists "Customers view own order items" on public.order_items;
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Customers create own order items"
on public.order_items for insert to authenticated
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
      and orders.status = 'pending'
  )
);
create policy "Customers view own order items"
on public.order_items for select to authenticated
using (
  private.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);
create policy "Admins manage order items"
on public.order_items for all to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Anyone can create inquiries" on public.inquiries;
drop policy if exists "Admins view inquiries" on public.inquiries;
drop policy if exists "Admins update inquiries" on public.inquiries;
create policy "Anyone can create inquiries"
on public.inquiries for insert to anon, authenticated
with check (true);
create policy "Admins view inquiries"
on public.inquiries for select to authenticated
using (private.is_admin());
create policy "Admins update inquiries"
on public.inquiries for update to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins view inventory logs" on public.inventory_logs;
drop policy if exists "Admins create inventory logs" on public.inventory_logs;
create policy "Admins view inventory logs"
on public.inventory_logs for select to authenticated
using (private.is_admin());
create policy "Admins create inventory logs"
on public.inventory_logs for insert to authenticated
with check (private.is_admin());

grant usage on schema public to anon, authenticated;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
revoke all on all functions in schema private from public;
grant execute on function private.is_admin() to anon, authenticated;
grant select on public.categories, public.products, public.product_images to anon;
grant select on public.categories, public.products, public.product_images to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.categories, public.products, public.product_images to authenticated;
grant select, insert, update, delete on public.carts, public.cart_items to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, update on public.inquiries to authenticated;
grant select, insert on public.inventory_logs to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute function private.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function private.set_updated_at();
drop trigger if exists carts_updated_at on public.carts;
create trigger carts_updated_at before update on public.carts for each row execute function private.set_updated_at();
drop trigger if exists cart_items_updated_at on public.cart_items;
create trigger cart_items_updated_at before update on public.cart_items for each row execute function private.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function private.set_updated_at();
drop trigger if exists inquiries_updated_at on public.inquiries;
create trigger inquiries_updated_at before update on public.inquiries for each row execute function private.set_updated_at();

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists categories_active_idx on public.categories(active, sort_order);
create index if not exists products_active_idx on public.products(active);
create index if not exists products_featured_idx on public.products(featured) where active = true;
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_idx on public.products(category);
create index if not exists product_images_product_id_idx on public.product_images(product_id, sort_order);
create index if not exists carts_user_id_idx on public.carts(user_id);
create unique index if not exists carts_one_active_per_user_idx on public.carts(user_id) where status = 'active';
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists inquiries_status_idx on public.inquiries(status);
create index if not exists inventory_logs_product_id_idx on public.inventory_logs(product_id, created_at desc);

insert into public.categories (name, slug, sort_order) values
('Drop Shoulder', 'drop-shoulder', 10),
('Regular Fit', 'regular-fit', 20),
('Over Sized', 'over-sized', 30)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.products (id, slug, name, price, category, image_url, gallery_images, description, fabric, fit, gsm, sizes, colors, stock, active, featured)
values
('zenith-mtn-black', 'zenith-mountain-tee-black', 'Zenith Mountain Tee / Black', 4500, 'Drop Shoulder', '/images/1/1.png', array['/images/1/1.png','/images/1/2.png','/images/1/3.png','/images/1/4.png'], '450 GSM Heavyweight cotton. Features the architectural Zenith Mountain rear graphic and minimalist front identity.', 'Heavyweight cotton jersey', 'Drop shoulder', 450, array['S','M','L','XL'], array['Vintage Black'], 24, true, true),
('zenith-mtn-white', 'zenith-mountain-tee-white', 'Zenith Mountain Tee / White', 4500, 'Regular Fit', '/images/2/1.png', array['/images/2/1.png','/images/2/2.png','/images/2/3.png','/images/2/4.png'], 'Optical white heavyweight cotton. Structural drop-shoulder fit with high-density textile printing.', 'Heavyweight cotton jersey', 'Regular fit', 450, array['S','M','L','XL'], array['Pure White'], 18, true, false),
('enso-series-black', 'enso-circular-tee-black', 'Enso Circular Tee / Black', 4200, 'Over Sized', '/images/3/1.png', array['/images/3/1.png','/images/3/2.png','/images/3/3.png','/images/3/4.png'], 'Inspired by the Japanese Enso - a symbol of absolute enlightenment and strength. 300 GSM luxury jersey.', 'Luxury cotton jersey', 'Oversized', 300, array['S','M','L','XL'], array['Pitch Black'], 20, true, true),
('enso-series-navy', 'enso-circular-tee-navy', 'Enso Circular Tee / Navy', 4200, 'Drop Shoulder', '/images/4/1.png', array['/images/4/1.png','/images/4/2.png','/images/4/3.png','/images/4/4.png'], 'Deep midnight navy palette. Boxy silhouette with articulated Enso brush-stroke graphic.', 'Luxury cotton jersey', 'Drop shoulder', 300, array['S','M','L','XL'], array['Midnight'], 16, true, false),
('earth-signature-tan', 'signature-earth-tee', 'Signature Earth Tee', 5500, 'Regular Fit', '/images/5/1.png', array['/images/5/1.png','/images/5/2.png','/images/5/3.png','/images/5/4.png'], 'Earth-toned luxury. Features the Zenvor Pattern mountain logo in marble-textured finish.', 'Premium compact cotton', 'Regular fit', 380, array['M','L','XL'], array['Desert Tan'], 12, true, true)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  price = excluded.price,
  category = excluded.category,
  image_url = excluded.image_url,
  gallery_images = excluded.gallery_images,
  description = excluded.description,
  fabric = excluded.fabric,
  fit = excluded.fit,
  gsm = excluded.gsm,
  sizes = excluded.sizes,
  colors = excluded.colors,
  stock = excluded.stock,
  active = excluded.active,
  featured = excluded.featured;

insert into public.product_images (product_id, image_url, sort_order, is_primary)
select p.id, image_url, ordinality - 1, ordinality = 1
from public.products p
cross join lateral unnest(p.gallery_images) with ordinality as gallery(image_url, ordinality)
on conflict do nothing;

-- After creating your admin user in Supabase Auth, promote it with:
-- update public.profiles set role = 'admin' where email = 'you@example.com';
