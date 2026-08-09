
-- BarberPro V13: complete tenant RLS + atomic public booking RPC.

-- Helper: current member id for a shop.
create or replace function public.current_member_id(target_shop uuid)
returns uuid
language sql stable security definer set search_path=public
as $$
  select id from public.shop_members
  where shop_id=target_shop and user_id=auth.uid()
  limit 1
$$;

-- SHOPS
drop policy if exists "shops_member_read" on public.shops;
create policy "shops_member_read" on public.shops
for select using (public.is_shop_member(id));

create policy "shops_owner_partner_update" on public.shops
for update
using(public.has_shop_role(id,array['owner','partner']::public.member_role[]))
with check(public.has_shop_role(id,array['owner','partner']::public.member_role[]));

-- SHOP MEMBERS
drop policy if exists "members can read own shop" on public.shop_members;
create policy "members_read_same_shop" on public.shop_members
for select using(public.is_shop_member(shop_id));

create policy "management_update_members" on public.shop_members
for update
using(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]))
with check(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

-- SERVICES
drop policy if exists "services_member_all" on public.services;
create policy "services_read_same_shop" on public.services
for select using(public.is_shop_member(shop_id));

create policy "services_management_insert" on public.services
for insert with check(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

create policy "services_management_update" on public.services
for update
using(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]))
with check(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

create policy "services_owner_partner_delete" on public.services
for delete using(public.has_shop_role(shop_id,array['owner','partner']::public.member_role[]));

-- STAFF SERVICES
alter table public.staff_services enable row level security;
create policy "staff_services_read" on public.staff_services
for select using(exists(
 select 1 from public.shop_members sm
 where sm.id=staff_services.staff_id and public.is_shop_member(sm.shop_id)
));
create policy "staff_services_manage" on public.staff_services
for all
using(exists(
 select 1 from public.shop_members sm
 where sm.id=staff_services.staff_id
 and public.has_shop_role(sm.shop_id,array['owner','partner','manager']::public.member_role[])
))
with check(exists(
 select 1 from public.shop_members sm
 where sm.id=staff_services.staff_id
 and public.has_shop_role(sm.shop_id,array['owner','partner','manager']::public.member_role[])
));

-- WORK SCHEDULES
alter table public.work_schedules enable row level security;
create policy "work_schedules_read" on public.work_schedules
for select using(exists(
 select 1 from public.shop_members sm
 where sm.id=work_schedules.staff_id and public.is_shop_member(sm.shop_id)
));
create policy "work_schedules_manage" on public.work_schedules
for all
using(exists(
 select 1 from public.shop_members sm
 where sm.id=work_schedules.staff_id
 and public.has_shop_role(sm.shop_id,array['owner','partner','manager']::public.member_role[])
))
with check(exists(
 select 1 from public.shop_members sm
 where sm.id=work_schedules.staff_id
 and public.has_shop_role(sm.shop_id,array['owner','partner','manager']::public.member_role[])
));

-- CLIENTS
drop policy if exists "clients_member_read" on public.clients;
drop policy if exists "clients_staff_write" on public.clients;
create policy "clients_read_same_shop" on public.clients
for select using(public.is_shop_member(shop_id));
create policy "clients_insert_same_shop" on public.clients
for insert with check(public.is_shop_member(shop_id));
create policy "clients_update_ops" on public.clients
for update
using(public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[]))
with check(public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[]));

-- APPOINTMENTS
drop policy if exists "appointments_member_read" on public.appointments;
create policy "appointments_read_scope" on public.appointments
for select using(
 public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[])
 or staff_id=public.current_member_id(shop_id)
);
create policy "appointments_ops_update" on public.appointments
for update
using(
 public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[])
 or staff_id=public.current_member_id(shop_id)
)
with check(
 public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[])
 or staff_id=public.current_member_id(shop_id)
);

-- TIME BLOCKS
drop policy if exists "blocks_member_read" on public.time_blocks;
drop policy if exists "blocks_manager_write" on public.time_blocks;
create policy "blocks_read_same_shop" on public.time_blocks
for select using(public.is_shop_member(shop_id));
create policy "blocks_manage_admin" on public.time_blocks
for update
using(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]))
with check(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

-- NOTIFICATIONS
drop policy if exists "shop reads notifications" on public.notification_jobs;
create policy "notifications_management_read" on public.notification_jobs
for select using(public.has_shop_role(shop_id,array['owner','partner','manager','reception']::public.member_role[]));

-- AUDIT
drop policy if exists "management reads audit logs" on public.audit_logs;
create policy "audit_management_read" on public.audit_logs
for select using(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

-- Atomic public booking: create/reuse client + authoritative booking in one database transaction.
create or replace function public.create_public_booking(
 p_shop uuid,
 p_staff uuid,
 p_service uuid,
 p_name text,
 p_phone text,
 p_email text,
 p_starts_at timestamptz
) returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
 v_name text;
 v_phone text;
 v_email text;
 v_client uuid;
 v_booking uuid;
begin
 v_name:=left(trim(regexp_replace(coalesce(p_name,''),'[\x00-\x1F\x7F]','','g')),100);
 v_phone:=left(regexp_replace(coalesce(p_phone,''),'\D','','g'),15);
 v_email:=nullif(left(lower(trim(coalesce(p_email,''))),160),'');

 if length(v_name)<2 then raise exception 'INVALID_NAME'; end if;
 if length(v_phone)<10 then raise exception 'INVALID_PHONE'; end if;
 if v_email is not null and v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
   then raise exception 'INVALID_EMAIL';
 end if;

 if not exists(select 1 from public.shops where id=p_shop) then
   raise exception 'SHOP_NOT_FOUND';
 end if;

 select id into v_client
 from public.clients
 where shop_id=p_shop and phone=v_phone
 limit 1;

 if v_client is null then
   insert into public.clients(shop_id,name,phone,email)
   values(p_shop,v_name,v_phone,v_email)
   returning id into v_client;
 else
   update public.clients
   set name=v_name,
       email=coalesce(v_email,email)
   where id=v_client;
 end if;

 v_booking:=public.book_appointment(
   p_shop,p_staff,p_service,v_client,p_starts_at,null
 );

 perform public.enqueue_appointment_reminders(v_booking);
 return v_booking;
end;
$$;

revoke all on function public.create_public_booking(uuid,uuid,uuid,text,text,text,timestamptz) from public;
grant execute on function public.create_public_booking(uuid,uuid,uuid,text,text,text,timestamptz) to anon,authenticated;

-- Prevent anonymous direct writes. Public booking goes through RPC only.
revoke insert,update,delete on public.clients from anon;
revoke insert,update,delete on public.appointments from anon;
