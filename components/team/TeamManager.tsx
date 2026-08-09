"use client";
import {useState} from "react";
type Person={id:string;display_name:string;photo_url?:string|null;role:string;commission_percent:number;can_block_time:boolean;block_requires_approval:boolean};
export function TeamManager({initial}:{initial:Person[]}){
 const [people,setPeople]=useState(initial); const [editing,setEditing]=useState<Person|null>(null); const [inviteOpen,setInviteOpen]=useState(false); const [busy,setBusy]=useState(false);
 async function uploadPhoto(staffId:string,file:File){const fd=new FormData();fd.append("staffId",staffId);fd.append("file",file);const r=await fetch("/api/staff/photo",{method:"POST",body:fd});const j=await r.json();if(r.ok)setPeople(p=>p.map(x=>x.id===staffId?{...x,photo_url:j.url}:x))}
 async function invite(form:FormData){setBusy(true);const r=await fetch("/api/staff/invite",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:form.get("name"),email:form.get("email"),role:form.get("role")})});setBusy(false);if(r.ok)setInviteOpen(false)}
 async function saveMember(form:FormData){
  if(!editing)return;setBusy(true);
  const r=await fetch("/api/team/member",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({
   id:editing.id,displayName:form.get("name"),role:form.get("role"),commissionPercent:Number(form.get("commission")),
   canBlockTime:form.get("canBlock")==="on",blockRequiresApproval:form.get("approval")==="on"
  })});
  const j=await r.json();setBusy(false);if(r.ok){setPeople(x=>x.map(p=>p.id===j.id?j:p));setEditing(null)}
 }
 return <>
  <div className="top" style={{marginBottom:18}}><div><h1>Equipe</h1><div className="muted">Acesso, foto, comissão e autonomia.</div></div><button className="btn primary" onClick={()=>setInviteOpen(true)}>+ Convidar</button></div>
  <div className="teamCards">{people.map(p=><article className="card teamCard" key={p.id}>
   <label className="photoPicker"><div className="avatar large">{p.photo_url?<img src={p.photo_url} alt={p.display_name}/>:p.display_name[0]}</div><input hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&uploadPhoto(p.id,e.target.files[0])}/><span>Trocar foto</span></label>
   <div className="teamInfo"><b>{p.display_name}</b><span>{p.role}</span><div className="teamNumbers"><div><small>Comissão</small><strong>{p.commission_percent}%</strong></div><div><small>Bloqueio</small><strong>{p.can_block_time?(p.block_requires_approval?"Aprovação":"Livre"):"Desativado"}</strong></div></div></div>
   <button className="btn" onClick={()=>setEditing(p)}>Editar perfil</button>
  </article>)}</div>

  {editing&&<div className="modal open"><form className="dialog" action={saveMember}><h3>Editar funcionário</h3><div className="form">
   <div className="field"><label>Nome</label><input name="name" defaultValue={editing.display_name}/></div>
   <div className="twocol"><div className="field"><label>Cargo</label><select name="role" defaultValue={editing.role}><option value="barber">Barbeiro</option><option value="reception">Recepção</option><option value="manager">Gerente</option><option value="partner">Sócio</option></select></div><div className="field"><label>Comissão %</label><input name="commission" type="number" min="0" max="100" defaultValue={editing.commission_percent}/></div></div>
   <label className="checkRow"><input name="canBlock" type="checkbox" defaultChecked={editing.can_block_time}/> Pode bloquear horários próprios</label>
   <label className="checkRow"><input name="approval" type="checkbox" defaultChecked={editing.block_requires_approval}/> Bloqueios precisam de aprovação</label>
   <div className="dialogactions"><button type="button" className="btn" onClick={()=>setEditing(null)}>Cancelar</button><button className="btn primary" disabled={busy}>Salvar</button></div>
  </div></form></div>}

  {inviteOpen&&<div className="modal open"><form className="dialog" action={invite}><h3>Convidar funcionário</h3><div className="form">
   <div className="field"><label>Nome</label><input name="name" required/></div><div className="field"><label>E-mail</label><input name="email" type="email" required/></div>
   <div className="field"><label>Cargo</label><select name="role"><option value="barber">Barbeiro</option><option value="reception">Recepção</option><option value="manager">Gerente</option></select></div>
   <div className="dialogactions"><button type="button" className="btn" onClick={()=>setInviteOpen(false)}>Cancelar</button><button className="btn primary" disabled={busy}>Enviar convite</button></div>
  </div></form></div>}
 </>
}
