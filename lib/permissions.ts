export type Role="owner"|"partner"|"manager"|"barber"|"reception";
export type Permission=
 |"shop.manage"|"finance.all"|"team.manage"|"schedule.all"
 |"schedule.own"|"production.own"|"clients.read"|"clients.write"|"block.own";

const matrix:Record<Role,Set<Permission>>={
 owner:new Set(["shop.manage","finance.all","team.manage","schedule.all","schedule.own","production.own","clients.read","clients.write","block.own"]),
 partner:new Set(["finance.all","team.manage","schedule.all","schedule.own","production.own","clients.read","clients.write","block.own"]),
 manager:new Set(["team.manage","schedule.all","schedule.own","production.own","clients.read","clients.write","block.own"]),
 barber:new Set(["schedule.own","production.own","clients.read","block.own"]),
 reception:new Set(["schedule.all","clients.read","clients.write"])
};
export const can=(role:Role,permission:Permission)=>matrix[role].has(permission);
