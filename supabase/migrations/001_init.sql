create extension if not exists "pgcrypto";

create table public.shops (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 logo_url text,
 theme text not null default 'dark-premium',
 timezone text not null default 'America/Sao_Paulo',
 created_at timestamptz not null default now()
);

create type public.member_role as enum ('owner','partner','manager','barber','reception');

create table public.shop_members (
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role public.member_role not null default 'barber',
 display_name text not null,
 photo_url text,
 commission_percent numeric(5,2) not null default 0,
 can_block_time boolean not null default true,
 block_requires_approval boolean not null default false,
 unique(shop_id,user_id)
);

create table public.services (
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 name text not null,
 duration_minutes int not null check(duration_minutes > 0),
 buffer_minutes int not null default 0 check(buffer_minutes >= 0),
 price_cents int not null check(price_cents >= 0),
 active boolean not null default true
);

create table public.staff_services (
 staff_id uuid not null references public.shop_members(id) on delete cascade,
 service_id uuid not null references public.services(id) on delete cascade,
 primary key(staff_id,service_id)
);

create table public.work_schedules (
 id uuid primary key default gen_random_uuid(),
 staff_id uuid not null references public.shop_members(id) on delete cascade,
 weekday int not null check(weekday between 0 and 6),
 start_time time not null,
 end_time time not null,
 check(end_time > start_time)
);

create table public.time_blocks (
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 staff_id uuid not null references public.shop_members(id) on delete cascade,
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 reason text,
 status text not null default 'approved' check(status in ('pending','approved','rejected')),
 created_by uuid references auth.users(id),
 check(ends_at > starts_at)
);

create table public.clients (
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 name text not null,
 phone text not null,
 email text,
 notes text,
 created_at timestamptz not null default now()
);

create type public.appointment_status as enum ('pending','confirmed','arrived','in_service','completed','cancelled','no_show');

create table public.appointments (
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 staff_id uuid not null references public.shop_members(id),
 service_id uuid not null references public.services(id),
 client_id uuid not null references public.clients(id),
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 status public.appointment_status not null default 'confirmed',
 price_cents int not null,
 notes text,
 created_at timestamptz not null default now(),
 check(ends_at > starts_at)
);

create index appointments_staff_time_idx on public.appointments(staff_id,starts_at,ends_at);
create index appointments_shop_time_idx on public.appointments(shop_id,starts_at);

alter table public.shops enable row level security;
alter table public.shop_members enable row level security;
alter table public.services enable row level security;
alter table public.staff_services enable row level security;
alter table public.work_schedules enable row level security;
alter table public.time_blocks enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;

-- Exemplo inicial de isolamento multi-tenant:
create policy "members can read own shop" on public.shop_members
for select using (user_id = auth.uid() or exists (
 select 1 from public.shop_members me
 where me.shop_id = shop_members.shop_id and me.user_id = auth.uid()
));

-- IMPORTANTE:
-- Na próxima migration, criar policies completas por papel e uma função RPC
-- book_appointment(...) com lock/transação para validar disponibilidade e impedir overbooking.
