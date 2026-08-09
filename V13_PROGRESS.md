# BarberPro V13

Major security architecture change:

- Public booking is now ONE atomic database RPC.
- Public API no longer needs Supabase service-role credentials.
- Client create/reuse + booking + reminder enqueue happen in one transaction.
- Complete tenant RLS policies added for core operational tables.
- Anonymous direct writes to clients/appointments remain revoked.
- Public booking security surface tests added.
- RLS contract tests added.
- Deprecated `/api/public-client` now returns HTTP 410.
- Staging seed/runbook added.

This is a meaningful production-hardening step because public internet traffic
now gets a much smaller privileged surface.
