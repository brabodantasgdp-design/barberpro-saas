# BarberPro — Deployment Checklist

## Supabase
- Apply migrations in order.
- Configure Auth redirect URLs.
- Create `barber-assets` Storage bucket/policies.
- Set production RLS policies.
- Verify booking exclusion/locking strategy.
- Configure backup/PITR according to plan.
- Use a separate Supabase project for staging.

## Vercel
Required env vars:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Never expose SERVICE_ROLE to browser code.

## Before first paying customer
- Run `npm test`.
- Test two simultaneous bookings for same slot against staging.
- Test Owner, Partner, Manager, Reception and Barber accounts.
- Test tenant A cannot access tenant B IDs.
- Test mobile Safari/Chrome and desktop Chrome/Edge.
- Verify cancellation/reschedule and timezone behavior.
- Configure notification provider before enabling reminders.
- Add monitoring/error tracking.
- Add Terms, Privacy and LGPD flows.
