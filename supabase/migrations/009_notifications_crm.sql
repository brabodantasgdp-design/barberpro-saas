
-- BarberPro V10: persistent notifications and CRM notes.

alter table public.clients add column if not exists notes text;

create table if not exists public.notification_jobs(
 id uuid primary key default gen_random_uuid(),
 shop_id uuid not null references public.shops(id) on delete cascade,
 appointment_id uuid references public.appointments(id) on delete cascade,
 channel text not null check(channel in ('whatsapp','email')),
 template text not null,
 destination text not null,
 scheduled_for timestamptz not null,
 status text not null default 'pending' check(status in ('pending','processing','sent','failed','cancelled')),
 attempts int not null default 0,
 provider_message_id text,
 last_error text,
 sent_at timestamptz,
 created_at timestamptz not null default now(),
 unique(appointment_id,channel,template)
);
create index if not exists notification_jobs_due_idx on public.notification_jobs(status,scheduled_for);
create index if not exists notification_jobs_shop_idx on public.notification_jobs(shop_id,scheduled_for desc);
alter table public.notification_jobs enable row level security;

create policy "shop reads notifications" on public.notification_jobs for select
using(public.is_shop_member(shop_id));

create or replace function public.enqueue_appointment_reminders(p_appointment uuid)
returns void language plpgsql security definer set search_path=public as $$
declare a record;
begin
 select ap.id,ap.shop_id,ap.starts_at,c.phone,c.email into a
 from public.appointments ap join public.clients c on c.id=ap.client_id
 where ap.id=p_appointment;
 if not found then return; end if;

 if coalesce(a.phone,'')<>'' then
  insert into public.notification_jobs(shop_id,appointment_id,channel,template,destination,scheduled_for)
  values(a.shop_id,a.id,'whatsapp','reminder_24h',a.phone,a.starts_at-interval '24 hours'),
        (a.shop_id,a.id,'whatsapp','reminder_2h',a.phone,a.starts_at-interval '2 hours')
  on conflict do nothing;
 end if;
 if coalesce(a.email,'')<>'' then
  insert into public.notification_jobs(shop_id,appointment_id,channel,template,destination,scheduled_for)
  values(a.shop_id,a.id,'email','reminder_24h',a.email,a.starts_at-interval '24 hours')
  on conflict do nothing;
 end if;
end;
$$;
