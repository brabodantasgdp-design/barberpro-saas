import assert from "node:assert/strict";
function overlaps(aStart,aEnd,bStart,bEnd){return aStart < bEnd && bStart < aEnd}
function fitsWithin(start,end,workStart,workEnd){return start>=workStart && end<=workEnd}
assert.equal(overlaps(9,10,10,11),false);
assert.equal(overlaps(9,10.1,10,11),true);
assert.equal(fitsWithin(9,10,9,18),true);
assert.equal(fitsWithin(17.5,18.5,9,18),false);
console.log("time-overlap tests: OK");
