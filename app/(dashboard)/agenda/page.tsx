import {getCurrentMembership} from "@/lib/auth";
import {StaffSchedulePanel} from "@/components/schedule/StaffSchedulePanel";
import {BlockApprovals} from "@/components/agenda/BlockApprovals";
import {AppointmentBoard} from "@/components/appointments/AppointmentBoard";
import {ManualBookingDrawer} from "@/components/appointments/ManualBookingDrawer";

export default async function Agenda(){
 const {supabase,membership}=await getCurrentMembership();
 const {data:staff}=await supabase.from("shop_members").select("id,display_name,photo_url").eq("shop_id",membership.shop_id).order("display_name");
 const ids=(staff??[]).map(x=>x.id);
 const {data:rows}=ids.length?await supabase.from("work_schedules").select("staff_id,weekday,start_time,end_time").in("staff_id",ids):{data:[] as any[]};
 const schedules:Record<string,any[]>={};for(const x of rows??[])(schedules[x.staff_id]??=[]).push({weekday:x.weekday,enabled:true,start:String(x.start_time).slice(0,5),end:String(x.end_time).slice(0,5)});
 const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+7);
 const {data:appointments}=await supabase.from("appointments")
  .select("id,staff_id,starts_at,ends_at,status,price_cents,clients(name),services(name)")
  .eq("shop_id",membership.shop_id).gte("starts_at",start.toISOString()).lt("starts_at",end.toISOString()).order("starts_at");
 const {data:services}=await supabase.from("services").select("id,name,duration_minutes,price_cents").eq("shop_id",membership.shop_id).eq("active",true).order("name");
 const {data:pending}=await supabase.from("time_blocks").select("id,starts_at,ends_at,reason").eq("shop_id",membership.shop_id).eq("status","pending").order("starts_at");
 return <><div className="top"><div><h1>Agenda</h1><div className="muted">Atendimento, jornada e disponibilidade num só lugar.</div></div><ManualBookingDrawer staff={(staff??[]) as any} services={(services??[]) as any}/></div>
 <div style={{marginTop:18}}><AppointmentBoard initial={(appointments??[]) as any} staff={(staff??[]) as any}/></div>
 <div className="settingsGrid"><StaffSchedulePanel staff={staff??[]} schedules={schedules}/><section className="card"><div className="panelhead"><b>Pedidos de bloqueio</b><span className="badge">{pending?.length||0}</span></div><div className="panelbody"><BlockApprovals initial={pending??[]}/></div></section></div></>
}
