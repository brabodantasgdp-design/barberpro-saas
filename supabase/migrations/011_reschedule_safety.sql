
-- BarberPro V12: safer atomic reschedule.
-- Cancelling the old appointment and creating the replacement happen in ONE transaction.
-- If the new booking fails, PostgreSQL rolls the cancellation back automatically.

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
 v_old record;
 v_new uuid;
 v_new_price int;
begin
 select id,shop_id,staff_id,service_id,client_id,status,price_cents,notes
 into v_old
 from public.appointments
 where id=p_appointment
 for update;

 if not found then raise exception 'APPOINTMENT_NOT_FOUND'; end if;
 if v_old.status in ('completed','no_show') then raise exception 'APPOINTMENT_NOT_RESCHEDULABLE'; end if;

 -- Free the old slot inside this transaction.
 update public.appointments set status='cancelled' where id=v_old.id;

 -- Reuse the same authoritative booking engine:
 -- service capability, working hours, blocks, duration/buffer and overlap protection.
 v_new := public.book_appointment(
   v_old.shop_id,
   p_new_staff,
   v_old.service_id,
   v_old.client_id,
   p_new_start,
   v_old.notes
 );

 -- A reschedule keeps the originally agreed price.
 update public.appointments
 set price_cents=v_old.price_cents
 where id=v_new;

 return v_new;
exception
 when others then
   -- Re-raising guarantees the entire transaction is rolled back.
   raise;
end;
$$;

revoke all on function public.reschedule_appointment(uuid,uuid,timestamptz) from anon;
