# Critical E2E — production gate

## Owner
1. Sign up.
2. Create shop.
3. Create service.
4. Configure weekly schedule.
5. Invite barber.
6. Verify public booking link.

## Customer
1. Open public link without login.
2. Pick service.
3. Pick barber.
4. Pick available slot.
5. Submit name + phone.
6. Confirm booking.
7. Verify success screen.

## Race condition
1. Open same slot in two independent browser sessions.
2. Submit simultaneously.
3. Exactly one succeeds.
4. Losing session receives a friendly "horário acabou de ser ocupado" response.

## Operation
1. Appointment appears in dashboard and agenda.
2. Reception marks Arrived.
3. Barber marks In service.
4. Barber marks Completed.
5. Revenue and commission update.
6. Client history shows the visit.

## Reschedule
1. Reschedule a future booking.
2. Old appointment becomes cancelled.
3. New appointment is confirmed.
4. Old slot becomes available again.
5. New slot cannot be double-booked.

## Isolation
Repeat with Tenant B and verify no A IDs/data can be read or mutated.
