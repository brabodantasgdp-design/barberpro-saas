import Link from "next/link";
import {getCurrentMembership} from "@/lib/auth";

export default async function Cliente({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {supabase,membership}=await getCurrentMembership();
 const {data:c}=await supabase.from("clients").select("id,name,phone,email,notes").eq("id",id).eq("shop_id",membership.shop_id).single();
 if(!c)return <div>Cliente não encontrado.</div>;
 const {data:a}=await supabase.from("appointments")
  .select("id,starts_at,status,price_cents,services(name),shop_members!appointments_staff_id_fkey(display_name)")
  .eq("client_id",id).eq("shop_id",membership.shop_id).order("starts_at",{ascending:false});
 const valid=(a??[]).filter((x:any)=>!["cancelled","no_show"].includes(x.status));
 const total=valid.reduce((s:number,x:any)=>s+(x.price_cents??0),0);
 return <>
  <Link href="/clientes" className="backLink">← Clientes</Link>
  <div className="clientHero"><div className="avatar xl">{c.name?.[0]||"C"}</div><div><h1>{c.name}</h1><div className="muted">{c.phone}{c.email?` · ${c.email}`:""}</div></div></div>
  <section className="kpis"><div className="card kpi"><small>VISITAS</small><b>{valid.length}</b></div><div className="card kpi"><small>VALOR TOTAL</small><b>R$ {(total/100).toFixed(2).replace(".",",")}</b></div><div className="card kpi"><small>NO-SHOW</small><b>{(a??[]).filter((x:any)=>x.status==="no_show").length}</b></div></section>
  <section className="card"><div className="panelhead"><b>Histórico</b></div><div className="historyList">{(a??[]).map((x:any)=><div className="historyRow" key={x.id}><div><b>{new Date(x.starts_at).toLocaleDateString("pt-BR")} · {new Date(x.starts_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</b><span>{x.services?.name||"Serviço"} · {x.shop_members?.display_name||"Profissional"}</span></div><span className={`statusPill ${x.status}`}>{x.status}</span><strong>R$ {(x.price_cents/100).toFixed(2).replace(".",",")}</strong></div>)}</div></section>
 </>;
}
