"use client";
import {useState} from "react";
type Staff={id:string;display_name:string};
type Service={id:string;name:string;duration_minutes:number;price_cents:number};

export function ManualBookingDrawer({staff,services}:{staff:Staff[];services:Service[]}){
 const [open,setOpen]=useState(false);const [busy,setBusy]=useState(false);const [msg,setMsg]=useState("");
 async function submit(form:FormData){
  setBusy(true);setMsg("");
  const date=String(form.get("date")); const time=String(form.get("time"));
  const startsAt=new Date(`${date}T${time}:00`).toISOString();
  const r=await fetch("/api/appointments/manual",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
   clientName:form.get("name"),clientPhone:form.get("phone"),staffId:form.get("staff"),serviceId:form.get("service"),startsAt
  })});
  const j=await r.json();setBusy(false);
  if(r.ok){setMsg("Agendamento criado.");setTimeout(()=>location.reload(),500)}
  else setMsg(j.error==="TIME_ALREADY_BOOKED"?"Horário já ocupado.":"Não foi possível agendar.");
 }
 return <>
  <button className="btn primary" onClick={()=>setOpen(true)}>+ Agendamento</button>
  {open&&<div className="drawerBackdrop" onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}><aside className="drawer">
    <div className="drawerHead"><div><h3>Novo agendamento</h3><p className="muted">Crie sem sair da agenda.</p></div><button className="iconbtn" onClick={()=>setOpen(false)}>×</button></div>
    <form className="form" action={submit}>
     <div className="field"><label>Cliente</label><input name="name" required placeholder="Nome do cliente"/></div>
     <div className="field"><label>WhatsApp</label><input name="phone" required placeholder="(21) 99999-9999"/></div>
     <div className="field"><label>Serviço</label><select name="service">{services.map(s=><option value={s.id} key={s.id}>{s.name} · R$ {(s.price_cents/100).toFixed(2).replace(".",",")}</option>)}</select></div>
     <div className="field"><label>Profissional</label><select name="staff">{staff.map(s=><option value={s.id} key={s.id}>{s.display_name}</option>)}</select></div>
     <div className="twocol"><div className="field"><label>Data</label><input type="date" name="date" required/></div><div className="field"><label>Hora</label><input type="time" name="time" required/></div></div>
     {msg&&<div className="infoBox">{msg}</div>}
     <button className="btn primary" disabled={busy}>{busy?"Salvando...":"Confirmar agendamento"}</button>
    </form>
  </aside></div>}
 </>
}
