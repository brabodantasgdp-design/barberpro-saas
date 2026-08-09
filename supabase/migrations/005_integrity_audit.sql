
-- BarberPro V6: integrity + audit foundation.

alter table public.work_schedules
add constraint work_schedule_unique_day unique(staff_id,weekday);

create table if not exists public.audit_logs(
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 actor_user_id uuid references auth.users(id),
 action text not null,
 entity_type text not null,
 entity_id uuid,
 payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists audit_logs_shop_time_idx on public.audit_logs(shop_id,created_at desc);
alter table public.audit_logs enable row level security;

create policy "management reads audit logs" on public.audit_logs for select
using(public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[]));

create or replace function public.log_audit(
 p_shop uuid,p_action text,p_entity_type text,p_entity_id uuid default null,p_payload jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_shop_member(p_shop) then raise exception 'FORBIDDEN'; end if;
 insert into public.audit_logs(shop_id,actor_user_id,action,entity_type,entity_id,payload)
 values(p_shop,auth.uid(),p_action,p_entity_type,p_entity_id,p_payload);
end;
$$;

-- A public booking may only be created through controlled server/RPC paths.
revoke insert,update,delete on public.appointments from anon;
revoke insert,update,delete on public.clients from anon;
