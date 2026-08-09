/*
Requires a disposable Supabase test project and env vars.
Test matrix:
1. seed shop, staff, service, schedule, client
2. call book_appointment twice concurrently for same slot
3. assert one success + one TIME_ALREADY_BOOKED
4. create approved block and assert slot disappears
5. reschedule and verify original becomes cancelled and replacement confirmed
*/
console.log("Integration suite scaffold ready. Configure test Supabase before running.");
