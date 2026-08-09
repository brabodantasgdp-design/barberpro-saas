import assert from "node:assert/strict";
import fs from "node:fs";
const sql=fs.readFileSync("supabase/migrations/012_complete_rls_public_booking.sql","utf8");

for(const expected of [
 "shops_owner_partner_update",
 "members_read_same_shop",
 "services_management_insert",
 "work_schedules_manage",
 "clients_read_same_shop",
 "appointments_read_scope",
 "blocks_manage_admin",
 "notifications_management_read",
 "audit_management_read"
]) assert.match(sql,new RegExp(expected));

assert.match(sql,/staff_id=public\.current_member_id\(shop_id\)/);
console.log("RLS contract tests: OK");
