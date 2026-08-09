
-- BarberPro V9: atomic reschedule.

create or replace function public.reschedule_appointment(
 p_appointment uuid,
 p_new_staff uuid,
 p_new_start timestamptz
) returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
 v_shop uuid;
 v_service uuid;
 v_client uuid;
 v_old_status public.appointment_status;
 v_duration int;
 v_buffer int;
 v_end timestamptz;
begin
 select shop_id,service_id,client_id,status into v_shop,v_service,v_client,v_old_status
 from public.appointments where id=p_appointment for update;
 if not found then raise exception 'APPOINTMENT_NOT_FOUND'; end if;

 select duration_minutes,buffer_minutes into v_duration,v_buffer
 from public.services where id=v_service and shop_id=v_shop and active=true;
 if not found then raise exception 'SERVICE_NOT_AVAILABLE'; end if;

 v_end:=p_new_start + make_interval(mins=>v_duration+v_buffer);

 update public.appointments
 set status='cancelled'
 where id=p_appointment;

 begin
   insert into public.appointments(shop_id,staff_id,service_id,client_id,starts_at,ends_at,status,price_cents,notes)
   select v_shop,p_new_staff,v_service,v_client,p_new_start,v_end,'confirmed',price_cents,notes
   from public.appointments where id=p_appointment
   returning id into p_appointment;
 exception when exclusion_violation then
   raise exception 'TIME_ALREADY_BOOKED';
 end;

 return p_appointment;
end;
$$;
