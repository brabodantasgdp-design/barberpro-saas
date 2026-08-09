-- Optional STAGING seed after creating/authenticating an owner.
-- Keep production databases free of demo data.

insert into public.shops(id,name,slug,timezone)
values('11111111-1111-1111-1111-111111111111','Barbearia Demo','barbearia-demo','America/Sao_Paulo')
on conflict do nothing;

insert into public.services(id,shop_id,name,duration_minutes,buffer_minutes,price_cents,active)
values
('21111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','Corte masculino',30,5,4000,true),
('21111111-1111-1111-1111-111111111112','11111111-1111-1111-1111-111111111111','Corte + barba',50,5,6500,true)
on conflict do nothing;
