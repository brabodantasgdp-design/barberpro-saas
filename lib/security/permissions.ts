export type Role="owner"|"partner"|"manager"|"reception"|"barber";
export const permissions={
 owner:{finance:true,team:true,schedules:true,allAppointments:true,branding:true},
 partner:{finance:true,team:true,schedules:true,allAppointments:true,branding:true},
 manager:{finance:true,team:true,schedules:true,allAppointments:true,branding:false},
 reception:{finance:false,team:false,schedules:false,allAppointments:true,branding:false},
 barber:{finance:false,team:false,schedules:false,allAppointments:false,branding:false},
} satisfies Record<Role,Record<string,boolean>>;

export function can(role:Role,key:keyof typeof permissions.owner){
 return permissions[role][key];
}
