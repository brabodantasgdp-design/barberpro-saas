
-- BarberPro V7: schedule validation and public booking hardening.

create or replace function public.has_schedule_conflict(
 p_staff uuid,p_weekday int,p_start time,p_end time
) returns boolean language plpgsql security definer set search_path=public as $$
declare v_tz text;
begin
 select s.timezone into v_tz from public.shops s join public.shop_members m on m.shop_id=s.id where m.id=p_staff;
 return exists(
  select 1 from public.appointments a
  where a.staff_id=p_staff
    and a.status in ('pending','confirmed','arrived','in_service')
    and extract(dow from (a.starts_at at time zone v_tz))::int=p_weekday
    and ((a.starts_at at time zone v_tz)::time < p_start or (a.ends_at at time zone v_tz)::time > p_end)
 );
end;
$$;

create index if not exists clients_shop_phone_idx on public.clients(shop_id,phone);
create index if not exists blocks_staff_status_time_idx on public.time_blocks(staff_id,status,starts_at,ends_at);
create index if not exists services_shop_active_idx on public.services(shop_id,active);
