import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(p,"utf8");

const booking=read("supabase/migrations/002_booking_engine.sql");
const reschedule=read("supabase/migrations/011_reschedule_safety.sql");
const publicBooking=read("app/api/public-booking/route.ts");
const publicBookingSql=read("supabase/migrations/012_complete_rls_public_booking.sql");
const deprecatedClient=read("app/api/public-client/route.ts");

assert.match(booking,/appointments_no_overlap/);
assert.match(booking,/TIME_ALREADY_BOOKED/);
assert.match(booking,/OUTSIDE_WORK_SCHEDULE/);
assert.match(booking,/TIME_BLOCKED/);

assert.match(reschedule,/public\.book_appointment/);
assert.match(reschedule,/price_cents=v_old\.price_cents/);

assert.match(publicBooking,/parsePublicClient/);
assert.match(publicBooking,/create_public_booking/);
assert.doesNotMatch(publicBooking,/SUPABASE_SERVICE_ROLE_KEY/);
assert.match(publicBookingSql,/grant execute on function public\.create_public_booking/);
assert.match(deprecatedClient,/410/);

console.log("source integrity tests: OK");
