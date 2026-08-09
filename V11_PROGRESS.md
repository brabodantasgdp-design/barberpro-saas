# BarberPro V11 — Production hardening

Added:
- `/api/health` production health check.
- centralized role permission contract.
- input sanitization helpers.
- production DB indexes.
- atomic notification claiming using `FOR UPDATE SKIP LOCKED`.
- bounded retry/backoff completion function.
- RLS audit SQL for staging.
- expanded executable production contract tests.
- critical browser E2E gate specification.
- `.env.example`.
- explicit production gate/runbook.

Important:
Local tests passing does NOT mean production is proven.
The next real step needs a Supabase staging project so migrations, RLS,
concurrency, storage, auth invitations and E2E can be tested against reality.
