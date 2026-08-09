# BarberPro V11 — Production Gate

The app should NOT be sold as production-ready until every item below is green.

## Automated locally
- `npm test`
- typecheck/build
- input/permission contracts

## Requires Supabase staging
- apply migrations 001 → 010 on a clean project
- validate all RLS policies
- simultaneous same-slot booking
- timezone edge cases
- invite/claim employee membership
- storage upload permissions
- reschedule transaction
- notification queue claiming with two workers

## Requires browser E2E
- owner onboarding
- public booking
- reception workflow
- barber workflow
- reports/commission
- client history
- mobile layout

## Business/legal
- LGPD privacy notice
- terms of service
- data deletion/export process
- backup/recovery procedure
- monitoring/error tracking

Passing local tests is necessary, but does not prove the Supabase/RLS/E2E items.
