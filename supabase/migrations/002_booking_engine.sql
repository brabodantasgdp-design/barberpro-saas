
-- BarberPro V2: transactional booking + tenant authorization helpers.
create extension if not exists btree_gist;

create or replace function public.is_shop_member(target_shop uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(
    select 1 from public.shop_members
    where shop_id=target_shop and user_id=auth.uid()
  );
$$;

create or replace function public.has_shop_role(target_shop uuid, allowed public.member_role[])
returns boolean language sql stable security definer set search_path=public as $$
  select exists(
    select 1 from public.shop_members
    where shop_id=target_shop and user_id=auth.uid() and role=any(allowed)
  );
$$;

-- Active appointments for the same barber may never overlap.
alter table public.appointments
add constraint appointments_no_overlap
exclude using gist (
  staff_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (status in ('pending','confirmed','arrived','in_service'));

-- Approved time blocks for a barber may not overlap each other.
alter table public.time_blocks
add constraint time_blocks_no_overlap
exclude using gist (
  staff_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (status='approved');

create or replace function public.book_appointment(
  p_shop uuid,
  p_staff uuid,
  p_service uuid,
  p_client uuid,
  p_starts_at timestamptz,
  p_notes text default null
) returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  v_duration int;
  v_buffer int;
  v_price int;
  v_end timestamptz;
  v_id uuid;
  v_local_start timestamp;
  v_local_end timestamp;
  v_weekday int;
  v_tz text;
begin
  select duration_minutes, buffer_minutes, price_cents
    into v_duration,v_buffer,v_price
  from public.services
  where id=p_service and shop_id=p_shop and active=true;

  if not found then raise exception 'SERVICE_NOT_AVAILABLE'; end if;

  if not exists(
    select 1 from public.shop_members sm
    join public.staff_services ss on ss.staff_id=sm.id and ss.service_id=p_service
    where sm.id=p_staff and sm.shop_id=p_shop
  ) then raise exception 'STAFF_CANNOT_PERFORM_SERVICE'; end if;

  select timezone into v_tz from public.shops where id=p_shop;
  if v_tz is null then raise exception 'SHOP_NOT_FOUND'; end if;

  v_end := p_starts_at + make_interval(mins => v_duration + v_buffer);
  v_local_start := p_starts_at at time zone v_tz;
  v_local_end := v_end at time zone v_tz;
  v_weekday := extract(dow from v_local_start)::int;

  if not exists(
    select 1 from public.work_schedules ws
    where ws.staff_id=p_staff and ws.weekday=v_weekday
      and v_local_start::time >= ws.start_time
      and v_local_end::time <= ws.end_time
  ) then raise exception 'OUTSIDE_WORK_SCHEDULE'; end if;

  if exists(
    select 1 from public.time_blocks b
    where b.staff_id=p_staff and b.status='approved'
      and tstzrange(b.starts_at,b.ends_at,'[)') && tstzrange(p_starts_at,v_end,'[)')
  ) then raise exception 'TIME_BLOCKED'; end if;

  -- Exclusion constraint is the final race-condition protection.
  insert into public.appointments(
    shop_id,staff_id,service_id,client_id,starts_at,ends_at,status,price_cents,notes
  ) values (
    p_shop,p_staff,p_service,p_client,p_starts_at,v_end,'confirmed',v_price,p_notes
  ) returning id into v_id;

  return v_id;
exception
  when exclusion_violation then
    raise exception 'TIME_ALREADY_BOOKED';
end;
$$;

-- Tenant read policies
create policy shops_member_read on public.shops for select
using (public.is_shop_member(id));

create policy services_member_all on public.services for all
using (public.is_shop_member(shop_id))
with check (public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

create policy clients_member_read on public.clients for select
using (public.is_shop_member(shop_id));

create policy clients_staff_write on public.clients for insert
with check (public.is_shop_member(shop_id));

create policy appointments_member_read on public.appointments for select
using (
  public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[])
  or exists(
    select 1 from public.shop_members me
    where me.id=appointments.staff_id and me.user_id=auth.uid()
  )
);

create policy blocks_member_read on public.time_blocks for select
using (public.is_shop_member(shop_id));

create policy blocks_manager_write on public.time_blocks for all
using (public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]))
with check (public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));
