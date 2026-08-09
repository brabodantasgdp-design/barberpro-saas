import assert from "node:assert/strict";
import fs from "node:fs";
const api=fs.readFileSync("app/api/public-booking/route.ts","utf8");
const sql=fs.readFileSync("supabase/migrations/012_complete_rls_public_booking.sql","utf8");
const old=fs.readFileSync("app/api/public-client/route.ts","utf8");

assert.doesNotMatch(api,/SUPABASE_SERVICE_ROLE_KEY/);
assert.match(api,/create_public_booking/);
assert.match(sql,/grant execute on function public\.create_public_booking/);
assert.match(sql,/revoke insert,update,delete on public\.appointments from anon/);
assert.match(sql,/appointments_read_scope/);
assert.match(old,/410/);

console.log("public booking surface tests: OK");
