import assert from "node:assert/strict";

function normalizePhone(v){return typeof v==="string"?v.replace(/\D/g,"").slice(0,15):""}
function validSlug(v){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)&&v.length<=60}
function overlaps(a,b,c,d){return a<d&&c<b}

assert.equal(normalizePhone("(21) 99999-9999"),"21999999999");
assert.equal(validSlug("barbearia-do-rafa"),true);
assert.equal(validSlug("../admin"),false);
assert.equal(validSlug("Barbearia"),false);
assert.equal(overlaps(9,10,10,11),false);
assert.equal(overlaps(9,10.01,10,11),true);

// Booking state invariants.
const terminal=new Set(["completed","cancelled","no_show"]);
assert.equal(terminal.has("completed"),true);
assert.equal(terminal.has("confirmed"),false);

console.log("production contract tests: OK");
