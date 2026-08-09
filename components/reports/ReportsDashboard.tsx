type StaffRow={id:string;name:string;gross:number;count:number;commission:number};
export function ReportsDashboard({gross,count,averageTicket,byStaff}:{gross:number;count:number;averageTicket:number;byStaff:StaffRow[]}){
 const fmt=(v:number)=>`R$ ${(v/100).toFixed(2).replace(".",",")}`;
 return <>
  <div className="top"><div><h1>Relatórios</h1><div className="muted">Faturamento, produtividade e comissão.</div></div></div>
  <section className="kpis">
   <div className="card kpi"><small>FATURAMENTO</small><b>{fmt(gross)}</b></div>
   <div className="card kpi"><small>ATENDIMENTOS</small><b>{count}</b></div>
   <div className="card kpi"><small>TICKET MÉDIO</small><b>{fmt(averageTicket)}</b></div>
   <div className="card kpi"><small>COMISSÃO TOTAL</small><b>{fmt(byStaff.reduce((s,x)=>s+x.commission,0))}</b></div>
  </section>
  <section className="card"><div className="panelhead"><b>Por profissional</b></div><div className="reportTable">
   <div className="reportHead"><span>Profissional</span><span>Atendimentos</span><span>Produção</span><span>Comissão</span></div>
   {byStaff.map(x=><div className="reportRow" key={x.id}><b>{x.name}</b><span>{x.count}</span><span>{fmt(x.gross)}</span><strong>{fmt(x.commission)}</strong></div>)}
  </div></section>
 </>
}
