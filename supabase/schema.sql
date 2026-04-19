-- Artesanía Oak & Iron — PostgreSQL schema (Supabase)
-- Strict enums, RLS, and production logging trigger.

create extension if not exists "uuid-ossp";

-- ENUMS ------------------------------------------------------------
do $$ begin
  create type product_type as enum ('stock', 'custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_flow as enum ('stock', 'custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'Pendiente',
    'Sourcing_Madera',
    'En_Fabricacion',
    'Control_Calidad',
    'Acabado',
    'Listo_Entrega'
  );
exception when duplicate_object then null; end $$;

-- PRODUCTS ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null,
  type product_type not null,
  price_cents integer not null check (price_cents >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  base_wood_options text[] not null default '{}',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists products_type_idx on public.products(type);

-- ORDERS -----------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id),
  flow order_flow not null,
  status order_status not null default 'Pendiente',
  wood_type text,
  finish text,
  custom_specs jsonb,
  deposit_paid_cents integer not null default 0,
  total_cents integer not null,
  estimated_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- MANUFACTURING LOGS ----------------------------------------------
create table if not exists public.manufacturing_logs (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status order_status not null,
  notes text,
  changed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists logs_order_idx on public.manufacturing_logs(order_id);

-- TRIGGER: append log on status insert/change, bump updated_at ----
create or replace function public.log_order_status_change()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    insert into public.manufacturing_logs(order_id, status, notes, changed_by)
    values (new.id, new.status, 'Pedido creado', new.user_id);
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.manufacturing_logs(order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
    new.updated_at := now();
  end if;
  return new;
end $$;

drop trigger if exists trg_orders_status_log on public.orders;
create trigger trg_orders_status_log
before insert or update of status on public.orders
for each row execute function public.log_order_status_change();

-- RLS --------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.manufacturing_logs enable row level security;

drop policy if exists "products_select_all" on public.products;
create policy "products_select_all" on public.products
  for select using (true);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (
    auth.uid() = user_id
    or coalesce(auth.jwt() ->> 'role', '') = 'admin'
  );

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin" on public.orders
  for update using (
    coalesce(auth.jwt() ->> 'role', '') = 'admin'
  );

drop policy if exists "logs_select_own" on public.manufacturing_logs;
create policy "logs_select_own" on public.manufacturing_logs
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = manufacturing_logs.order_id
        and (
          o.user_id = auth.uid()
          or coalesce(auth.jwt() ->> 'role', '') = 'admin'
        )
    )
  );
