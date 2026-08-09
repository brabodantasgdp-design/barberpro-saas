
-- BarberPro V3: onboarding + availability engine.

alter table public.shops add column if not exists phone text;

create or replace function public.create_shop_with_owner(
 p_name text,
 p_slug text,
 p_owner_name text,
 p_phone text default null
) returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare v_shop uuid; v_user uuid;
begin
 v_user:=auth.uid();
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 if exists(select 1 from public.shop_members where user_id=v_user) then
   raise exception 'USER_ALREADY_HAS_SHOP';
 end if;

 insert into public.shops(name,slug,phone)
 values(trim(p_name),lower(trim(p_slug)),p_phone)
 returning id into v_shop;

 insert into public.shop_members(shop_id,user_id,role,display_name)
 values(v_shop,v_user,'owner',trim(p_owner_name));

 return v_shop;
end;
$$;

-- Safe helper used by public booking page.
create or replace function public.get_available_slots(
 p_shop uuid,
 p_staff uuid,
 p_service uuid,
 p_date date
) returns table(slot_start timestamptz, slot_end timestamptz)
language plpgsql
security definer
set search_path=public
as $$
declare
 v_duration int;
 v_buffer int;
 v_tz text;
 v_weekday int;
 v_step int := 10;
begin
 select duration_minutes,buffer_minutes into v_duration,v_buffer
 from public.services where id=p_service and shop_id=p_shop and active=true;
 if not found then return; end if;

 if not exists(
   select 1 from public.shop_members sm
   join public.staff_services ss on ss.staff_id=sm.id and ss.service_id=p_service
   where sm.id=p_staff and sm.shop_id=p_shop
 ) then return; end if;

 select timezone into v_tz from public.shops where id=p_shop;
 v_weekday:=extract(dow from p_date)::int;

 return query
 with recursive candidate as (
   select
     ((p_date + ws.start_time) at time zone v_tz) as s,
     ((p_date + ws.end_time) at time zone v_tz) as work_end
   from public.work_schedules ws
   where ws.staff_id=p_staff and ws.weekday=v_weekday
   union all
   select s + make_interval(mins=>v_step), work_end
   from candidate
   where s + make_interval(mins=>v_step+v_duration+v_buffer) <= work_end
 ),
 filtered as (
   select s, s + make_interval(mins=>v_duration+v_buffer) as e
   from candidate
   where s + make_interval(mins=>v_duration+v_buffer) <= work_end
 )
 select f.s,f.e
 from filtered f
 where not exists(
   select 1 from public.time_blocks b
   where b.staff_id=p_staff and b.status='approved'
   and tstzrange(b.starts_at,b.ends_at,'[)') && tstzrange(f.s,f.e,'[)')
 )
 and not exists(
   select 1 from public.appointments a
   where a.staff_id=p_staff and a.status in ('pending','confirmed','arrived','in_service')
   and tstzrange(a.starts_at,a.ends_at,'[)') && tstzrange(f.s,f.e,'[)')
 )
 and f.s > now()
 order by f.s;
end;
$$;

-- Public-safe shop/service/staff views for booking.
create or replace view public.public_shops as
select id,name,slug,logo_url,theme,timezone,phone from public.shops;

create or replace view public.public_services as
select id,shop_id,name,duration_minutes,buffer_minutes,price_cents
from public.services where active=true;

create or replace view public.public_staff as
select id,shop_id,display_name,photo_url
from public.shop_members where role in ('owner','partner','manager','barber');

grant select on public.public_shops,public.public_services,public.public_staff to anon,authenticated;
grant execute on function public.get_available_slots(uuid,uuid,uuid,date) to anon,authenticated;
