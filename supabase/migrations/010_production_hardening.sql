
-- BarberPro V11 production hardening.

create index if not exists appointments_shop_client_time_idx
on public.appointments(shop_id,client_id,starts_at desc);

create index if not exists appointments_shop_staff_time_idx
on public.appointments(shop_id,staff_id,starts_at);

create index if not exists members_user_shop_idx
on public.shop_members(user_id,shop_id);

-- Claim due notifications safely when multiple workers are running.
create or replace function public.claim_notification_jobs(p_limit int default 25)
returns setof public.notification_jobs
language plpgsql
security definer
set search_path=public
as $$
begin
 return query
 with due as (
   select id
   from public.notification_jobs
   where status='pending'
     and scheduled_for<=now()
     and attempts<5
   order by scheduled_for
   for update skip locked
   limit greatest(1,least(p_limit,100))
 )
 update public.notification_jobs j
 set status='processing',attempts=attempts+1
 from due
 where j.id=due.id
 returning j.*;
end;
$$;

revoke all on function public.claim_notification_jobs(int) from public,anon,authenticated;

create or replace function public.finish_notification_job(
 p_id uuid,p_success boolean,p_provider_message_id text default null,p_error text default null
) returns void
language plpgsql
security definer
set search_path=public
as $$
begin
 update public.notification_jobs
 set status=case when p_success then 'sent' else case when attempts>=5 then 'failed' else 'pending' end end,
     provider_message_id=case when p_success then p_provider_message_id else provider_message_id end,
     last_error=case when p_success then null else left(p_error,1000) end,
     sent_at=case when p_success then now() else sent_at end,
     scheduled_for=case when not p_success and attempts<5 then now()+make_interval(mins=>power(2,attempts)::int) else scheduled_for end
 where id=p_id;
end;
$$;

revoke all on function public.finish_notification_job(uuid,boolean,text,text) from public,anon,authenticated;
