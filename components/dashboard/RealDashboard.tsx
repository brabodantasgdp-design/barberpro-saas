type Appointment={id:string;starts_at:string;status:string;price_cents:number;clients?:{name:string}|null;services?:{name:string}|null;shop_members?:{display_name:string}|null};
type Staff={id:string;display_name:string;photo_url?:string|null;commission_percent:number};

export function RealDashboard({appointments,staff}:{appointments:Appointment[],staff:Staff[]}){
 const valid=appointments.filter(a=>!["cancelled","no_show"].includes(a.status));
 const revenue=valid.reduce((s,a)=>s+(a.price_cents||0),0);
 const avg=valid.length?Math.round(revenue/valid.length):0;
 const fmt=(v:number)=>`R$ ${(v/100).toFixed(2).replace(".",",")}`;
 return <>
  <div className="top"><div><h1>Visão geral</h1><div className="muted">O que está acontecendo hoje na sua barbearia.</div></div><a className="btn primary" href="/agenda">+ Agendamento</a></div>
  <section className="kpis">
   <div className="card kpi"><small>FATURAMENTO HOJE</small><b>{fmt(revenue)}</b></div>
   <div className="card kpi"><small>ATENDIMENTOS</small><b>{valid.length}</b></div>
   <div className="card kpi"><small>TICKET MÉDIO</small><b>{fmt(avg)}</b></div>
   <div className="card kpi"><small>CONCLUÍDOS</small><b>{valid.filter(a=>a.status==="completed").length}</b></div>
   <div className="card kpi"><small>NO-SHOW</small><b>{appointments.filter(a=>a.status==="no_show").length}</b></div>
  </section>
  <div className="grid">
   <section className="card"><div className="panelhead"><b>Próximos atendimentos</b><span className="muted">Hoje</span></div><div className="panelbody staff">
    {valid.length===0?<div className="emptyState">Nenhum atendimento para hoje.</div>:valid.slice(0,8).map(a=><div className="staffrow" key={a.id}>
     <b>{new Date(a.starts_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</b>
     <div style={{flex:1}}><strong>{a.clients?.name||"Cliente"}</strong><div className="muted">{a.services?.name||"Serviço"} · {a.shop_members?.display_name||"Profissional"}</div></div>
     <b>{fmt(a.price_cents)}</b>
    </div>)}
   </div></section>
   <section className="card"><div className="panelhead"><b>Produção da equipe</b></div><div className="panelbody staff">
    {staff.map(p=>{const own=valid.filter(a=>(a as any).staff_id===p.id);const gross=own.reduce((s,a)=>s+a.price_cents,0);return <div className="staffrow" key={p.id}>
     <div className="avatar">{p.photo_url?<img src={p.photo_url} alt={p.display_name}/>:p.display_name[0]}</div>
     <div style={{flex:1}}><b>{p.display_name}</b><div className="muted">{own.length} atendimentos</div></div><b>{fmt(gross)}</b>
    </div>})}
   </div></section>
  </div>
 </>;
}
