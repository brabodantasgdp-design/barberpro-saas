import Link from "next/link";

type Appointment={id:string;staff_id:string;starts_at:string;status:string;price_cents:number;clients?:{name:string}|null;services?:{name:string}|null;shop_members?:{display_name:string}|null};
type Staff={id:string;display_name:string;photo_url?:string|null;commission_percent:number};
const statusLabel:Record<string,string>={pending:"Pendente",confirmed:"Confirmado",arrived:"Chegou",in_service:"Em atendimento",completed:"Concluído",cancelled:"Cancelado",no_show:"No-show"};

export function RealDashboard({appointments,staff,member}:{appointments:Appointment[];staff:Staff[];member:any}){
 const valid=appointments.filter(a=>!["cancelled","no_show"].includes(a.status));
 const revenue=valid.reduce((s,a)=>s+(a.price_cents||0),0); const avg=valid.length?Math.round(revenue/valid.length):0;
 const fmt=(v:number)=>`R$ ${(v/100).toFixed(2).replace(".",",")}`;
 const shop=member?.shops; const first=String(member?.display_name||"Proprietário").split(" ")[0];
 return <div className="productDashboard">
  <div className="dashboardHeader"><div><h1>Bom dia, {first} 👋</h1><p>Aqui está o resumo da sua barbearia hoje.</p></div><div><span className="today">▣ Hoje</span><Link className="btn primary" href="/agenda">＋ Novo agendamento</Link><span className="headerAvatar">{first[0]}</span></div></div>
  <section className="premiumKpis">
   {[['FATURAMENTO HOJE',fmt(revenue),'Hoje','▥'],['ATENDIMENTOS',String(valid.length),'Hoje','♙'],['TICKET MÉDIO',fmt(avg),'Hoje','▣'],['OCUPAÇÃO',staff.length?`${Math.min(100,Math.round(valid.length/(staff.length*4)*100))}%`:'0%','Estimativa','◷'],['CONCLUÍDOS',String(valid.filter(a=>a.status==='completed').length),'Hoje','✓']].map(x=><article className="card premiumKpi" key={x[0]}><i>{x[3]}</i><div><small>{x[0]}</small><b>{x[1]}</b><p><span>{x[2]}</span> período atual</p></div></article>)}
  </section>
  <section className="dashboardMainGrid">
   <article className="card agendaOverview"><div className="premiumPanelHead"><div><b>Agenda — Hoje</b><small>{appointments.length?`${appointments.length} horários registrados`:"Sua agenda começa aqui"}</small></div><Link href="/agenda">Ver agenda completa</Link></div>
    <div className="agendaStaffHead"><span>Horário</span>{staff.slice(0,4).map(s=><span key={s.id}><i>{s.photo_url?<img src={s.photo_url} alt=""/>:s.display_name[0]}</i>{s.display_name}</span>)}</div>
    {staff.length===0||appointments.length===0?<div className="dashboardEmpty"><b>Pronto para o primeiro atendimento?</b><p>Cadastre sua equipe, configure horários e crie um agendamento.</p><Link className="btn primary" href="/agenda">Abrir agenda</Link></div>:<div className="liveAgenda">{valid.slice(0,12).map(a=><div className={`liveAppointment status-${a.status}`} key={a.id}><time>{new Date(a.starts_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</time><div><b>{a.clients?.name||"Cliente"}</b><span>{a.services?.name||"Serviço"} · {a.shop_members?.display_name||"Profissional"}</span></div><strong>{fmt(a.price_cents)}</strong><em>{statusLabel[a.status]||a.status}</em></div>)}</div>}
   </article>
   <aside className="dashboardSide">
    <article className="card teamToday"><div className="premiumPanelHead"><div><b>Equipe hoje</b><small>Produção em tempo real</small></div><Link href="/equipe">Ver todos</Link></div>{staff.length===0?<div className="dashboardEmpty small"><p>Nenhum profissional cadastrado.</p><Link href="/equipe">Montar equipe</Link></div>:staff.slice(0,5).map(s=>{const own=valid.filter(a=>a.staff_id===s.id),gross=own.reduce((n,a)=>n+a.price_cents,0);return <div className="teamLine" key={s.id}><div className="avatar">{s.photo_url?<img src={s.photo_url} alt={s.display_name}/>:s.display_name[0]}</div><div><b>{s.display_name}</b><small>{own.length} atendimentos</small><span><i style={{width:`${Math.min(100,own.length*15)}%`}}/></span></div><strong>{fmt(gross)}</strong></div>})}</article>
    <article className="card upcoming"><div className="premiumPanelHead"><div><b>Próximos agendamentos</b><small>Atualização automática</small></div></div>{valid.slice(0,5).map(a=><div className="upcomingLine" key={a.id}><time>{new Date(a.starts_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</time><span><b>{a.clients?.name||"Cliente"}</b><small>{a.services?.name||"Serviço"}</small></span><em>{a.shop_members?.display_name||""}</em></div>)}{valid.length===0&&<div className="dashboardEmpty small"><p>Nenhum agendamento para hoje.</p></div>}</article>
   </aside>
  </section>
  <section className="dashboardBottom">
   <article className="card quickCard"><b>Indicadores rápidos</b><div><span>Clientes atendidos<strong>{valid.length}</strong></span><span>No-show<strong>{appointments.filter(a=>a.status==="no_show").length}</strong></span><span>Profissionais ativos<strong>{staff.length}</strong></span></div></article>
   <article className="card financeCard"><b>Resumo financeiro</b><strong>{fmt(revenue)}</strong><small>Faturamento de hoje</small><div className="fakeChart">▁▂▂▃▂▄▅▄▆▇█</div></article>
   <article className="card publicCard"><b>Página de agendamento</b><p>Seu link público está pronto para receber clientes.</p>{shop?.slug&&<Link href={`/agendar/${shop.slug}`}>barberpro.app/agendar/{shop.slug} ↗</Link>}</article>
  </section>
 </div>;
}
