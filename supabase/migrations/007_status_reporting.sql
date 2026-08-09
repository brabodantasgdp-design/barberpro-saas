
-- BarberPro V8: status & reporting support.
create index if not exists appointments_shop_status_time_idx on public.appointments(shop_id,status,starts_at);

create or replace view public.staff_daily_performance as
select
 a.shop_id,a.staff_id,date_trunc('day',a.starts_at) as day,
 count(*) filter(where a.status not in ('cancelled','no_show')) as appointments,
 count(*) filter(where a.status='completed') as completed,
 coalesce(sum(a.price_cents) filter(where a.status not in ('cancelled','no_show')),0) as gross_cents
from public.appointments a
group by a.shop_id,a.staff_id,date_trunc('day',a.starts_at);
