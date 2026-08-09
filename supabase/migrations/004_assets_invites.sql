
-- BarberPro V5: assets, employee invitation completion and richer policies.

insert into storage.buckets(id,name,public)
values('barber-assets','barber-assets',true)
on conflict(id) do update set public=true;

create policy "shop members upload barber assets"
on storage.objects for insert to authenticated
with check (
  bucket_id='barber-assets'
  and exists(
    select 1 from public.shop_members sm
    where sm.user_id=auth.uid()
      and (storage.foldername(name))[1]=sm.shop_id::text
  )
);

create policy "shop members update barber assets"
on storage.objects for update to authenticated
using (
  bucket_id='barber-assets'
  and exists(
    select 1 from public.shop_members sm
    where sm.user_id=auth.uid()
      and (storage.foldername(name))[1]=sm.shop_id::text
  )
);

create policy "public can view barber assets"
on storage.objects for select to public
using(bucket_id='barber-assets');

-- New account can claim invitation metadata after first authenticated session.
create or replace function public.claim_pending_membership()
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  v_user uuid:=auth.uid();
  v_meta jsonb;
  v_shop uuid;
  v_role public.member_role;
  v_name text;
  v_member uuid;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  select raw_user_meta_data into v_meta from auth.users where id=v_user;

  if coalesce(v_meta->>'pending_shop_id','')='' then return null; end if;
  v_shop:=(v_meta->>'pending_shop_id')::uuid;
  v_role:=coalesce((v_meta->>'pending_role')::public.member_role,'barber');
  v_name:=coalesce(v_meta->>'display_name','Funcionário');

  insert into public.shop_members(shop_id,user_id,role,display_name)
  values(v_shop,v_user,v_role,v_name)
  on conflict(shop_id,user_id) do update set role=excluded.role
  returning id into v_member;

  return v_member;
end;
$$;

-- Barber may create own block when allowed.
create policy "staff can create own time blocks"
on public.time_blocks for insert
with check (
  exists(
    select 1 from public.shop_members me
    where me.id=time_blocks.staff_id
      and me.shop_id=time_blocks.shop_id
      and me.user_id=auth.uid()
      and me.can_block_time=true
  )
  or public.has_shop_role(shop_id,array['owner','partner','manager']::public.member_role[])
);
