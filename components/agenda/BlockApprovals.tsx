"use client";
import {useState} from "react";
type Block={id:string;starts_at:string;ends_at:string;reason?:string|null};
export function BlockApprovals({initial}:{initial:Block[]}){
 const [items,setItems]=useState(initial); const [busy,setBusy]=useState<string|null>(null);
 async function decide(id:string,status:"approved"|"rejected"){
  setBusy(id);
  const r=await fetch("/api/time-blocks",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,status})});
  if(r.ok)setItems(x=>x.filter(i=>i.id!==id));
  setBusy(null);
 }
 return <div className="staff">
  {!items.length?<div className="emptyState">Nenhum pedido pendente.</div>:items.map(x=><div className="approvalRow" key={x.id}>
   <div><b>{new Date(x.starts_at).toLocaleString("pt-BR")}</b><div className="muted">{x.reason||"Sem motivo informado"}</div></div>
   <div className="approvalActions"><button disabled={busy===x.id} className="btn" onClick={()=>decide(x.id,"rejected")}>Recusar</button><button disabled={busy===x.id} className="btn primary" onClick={()=>decide(x.id,"approved")}>Aprovar</button></div>
  </div>)}
 </div>
}
