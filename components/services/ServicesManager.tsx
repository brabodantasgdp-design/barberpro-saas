"use client";
import {useState} from "react";
type Service={id:string;name:string;duration_minutes:number;buffer_minutes:number;price_cents:number;active:boolean};
export function ServicesManager({shopId,initial}:{shopId:string;initial:Service[]}){
 const [items,setItems]=useState(initial);const [open,setOpen]=useState(false);const [edit,setEdit]=useState<Service|null>(null);
 async function create(form:FormData){const r=await fetch("/api/services",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({shopId,name:form.get("name"),durationMinutes:Number(form.get("duration")),bufferMinutes:Number(form.get("buffer")||0),priceCents:Math.round(Number(form.get("price"))*100)})});const j=await r.json();if(r.ok){setItems(x=>[...x,j]);setOpen(false)}}
 async function update(form:FormData){if(!edit)return;const r=await fetch(`/api/services/${edit.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({name:form.get("name"),durationMinutes:Number(form.get("duration")),bufferMinutes:Number(form.get("buffer")),priceCents:Math.round(Number(form.get("price"))*100)})});const j=await r.json();if(r.ok){setItems(x=>x.map(s=>s.id===edit.id?j:s));setEdit(null)}}
 async function remove(id:string){const r=await fetch(`/api/services/${id}`,{method:"DELETE"});if(r.ok)setItems(x=>x.filter(s=>s.id!==id))}
 return <>
  <div className="top"><div><h1>Serviços</h1><div className="muted">Preço, duração e intervalo entre clientes.</div></div><button className="btn primary" onClick={()=>setOpen(true)}>+ Serviço</button></div>
  <div className="serviceAdminGrid">{items.map(s=><article className="card serviceAdmin" key={s.id}><div><b>{s.name}</b><div className="muted">{s.duration_minutes} min + {s.buffer_minutes} min de intervalo</div></div><strong>R$ {(s.price_cents/100).toFixed(2).replace(".",",")}</strong><div><button className="btn" onClick={()=>setEdit(s)}>Editar</button> <button className="btn" onClick={()=>remove(s.id)}>Arquivar</button></div></article>)}</div>
  {(open||edit)&&<div className="modal open"><form className="dialog" action={edit?update:create}><h3>{edit?"Editar serviço":"Novo serviço"}</h3><div className="form">
   <div className="field"><label>Nome</label><input name="name" required defaultValue={edit?.name}/></div>
   <div className="twocol"><div className="field"><label>Duração</label><input name="duration" type="number" min="5" required defaultValue={edit?.duration_minutes||30}/></div><div className="field"><label>Buffer</label><input name="buffer" type="number" min="0" defaultValue={edit?.buffer_minutes||5}/></div></div>
   <div className="field"><label>Preço R$</label><input name="price" type="number" step=".01" defaultValue={edit?edit.price_cents/100:40}/></div>
   <div className="dialogactions"><button type="button" className="btn" onClick={()=>{setOpen(false);setEdit(null)}}>Cancelar</button><button className="btn primary">Salvar</button></div>
  </div></form></div>}
 </>;
}
