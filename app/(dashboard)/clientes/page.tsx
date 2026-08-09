import Link from "next/link";
import {getCurrentMembership} from "@/lib/auth";

export default async function Clientes(){
 const {supabase,membership}=await getCurrentMembership();
 const {data}=await supabase.from("clients")
  .select("id,name,phone,email,created_at,appointments(id,status,price_cents,starts_at)")
  .eq("shop_id",membership.shop_id).order("name");
 return <>
  <div className="top"><div><h1>Clientes</h1><div className="muted">Histórico e relacionamento em um só lugar.</div></div></div>
  <div className="clientGrid">{(data??[]).map((c:any)=>{
   const valid=(c.appointments??[]).filter((a:any)=>!["cancelled","no_show"].includes(a.status));
   const total=valid.reduce((s:number,a:any)=>s+(a.price_cents??0),0);
   return <Link href={`/clientes/${c.id}`} className="card clientCard" key={c.id}>
    <div className="avatar large">{c.name?.[0]||"C"}</div><div><b>{c.name}</b><span>{c.phone}</span></div>
    <div className="clientStats"><span><small>Visitas</small><strong>{valid.length}</strong></span><span><small>Total</small><strong>R$ {(total/100).toFixed(2).replace(".",",")}</strong></span></div>
   </Link>
  })}</div>
 </>;
}
