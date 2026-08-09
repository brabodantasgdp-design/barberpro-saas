import assert from "node:assert/strict";
const roles={
 owner:{finance:true,allAppointments:true,commission:true},
 partner:{finance:true,allAppointments:true,commission:true},
 manager:{finance:true,allAppointments:true,commission:true},
 reception:{finance:false,allAppointments:true,commission:false},
 barber:{finance:false,allAppointments:false,commission:false}
};
assert.equal(roles.barber.finance,false);
assert.equal(roles.reception.allAppointments,true);
assert.equal(roles.owner.commission,true);
console.log("permission contract tests: OK");
