import {getCurrentMembership} from "@/lib/auth";
import {ReportsDashboard} from "@/components/reports/ReportsDashboard";

export default async function Relatorios(){
 const {supabase,membership}=await getCurrentMembership();
 if(!membership)return <div>Sem barbearia.</div>;

 const from=new Date();from.setDate(1);from.setHours(0,0,0,0);
 const {data}=await supabase.from("appointments")
  .select("id,staff_id,status,price_cents,starts_at,shop_members!appointments_staff_id_fkey(display_name,commission_percent)")
  .eq("shop_id",membership.shop_id).gte("starts_at",from.toISOString()).lte("starts_at",new Date().toISOString());

 const rows=(data??[]).filter((x:any)=>!["cancelled","no_show"].includes(x.status));
 const gross=rows.reduce((s:any,a:any)=>s+(a.price_cents??0),0);
 const map=new Map<string,any>();
 for(const a of rows as any[]){
   const item=map.get(a.staff_id)??{id:a.staff_id,name:a.shop_members?.display_name??"Profissional",gross:0,count:0,commission:0,pct:Number(a.shop_members?.commission_percent??0)};
   item.gross+=a.price_cents??0; item.count++; item.commission=Math.round(item.gross*item.pct/100); map.set(a.staff_id,item);
 }
 return <ReportsDashboard gross={gross} count={rows.length} averageTicket={rows.length?Math.round(gross/rows.length):0} byStaff={[...map.values()]}/>;
}
