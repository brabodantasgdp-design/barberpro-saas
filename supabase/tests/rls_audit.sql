-- Run in STAGING only.
-- This file documents the mandatory cross-tenant RLS assertions.
-- Create Tenant A + Tenant B users before executing assertions through authenticated clients.

-- Expected:
-- A cannot SELECT B shops private/member data.
-- A cannot UPDATE B services.
-- A cannot INSERT appointments into B through authenticated admin routes.
-- Barber cannot update own commission.
-- Reception cannot read financial reports if report endpoint enforces role.
-- Owner can manage own shop only.

select schemaname,tablename,policyname,cmd
from pg_policies
where schemaname='public'
order by tablename,policyname;
