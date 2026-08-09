# BarberPro V13 — Staging Runbook

## 1. Create Supabase staging
Use a separate project from production.

## 2. Apply migrations
Apply `supabase/migrations/001_...` through `012_complete_rls_public_booking.sql` in order.

## 3. Configure Vercel Preview/Staging env
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

The service role remains server-only for administrative operations.
The PUBLIC BOOKING endpoint no longer needs service-role access.

## 4. Gates
- signup/login
- create first shop
- create service
- create staff schedule
- public booking
- simultaneous booking race
- status workflow
- commission report
- client history
- invite employee
- photo/logo Storage
- reschedule
- tenant A/B isolation

## 5. Do not launch paid customers until
- clean build passes
- migrations pass on empty staging database
- RLS cross-tenant tests pass
- mobile QA passes
- error monitoring/backups are configured
