"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";

type Service={id:string;name:string;duration_minutes:number;price_cents:number};
type Staff={id:string;display_name:string;photo_url?:string|null};

export function PublicBookingWizard({
  shopId,slug,services,staffMap
}:{
  shopId:string;
  slug:string;
  services:Service[];
  staffMap:Record<string,Staff[]>;
}){
  const [service,setService]=useState<Service|null>(null);
  const [staff,setStaff]=useState<Staff|null>(null);
  const [date,setDate]=useState("");
  const [slots,setSlots]=useState<{slot_start:string;slot_end:string}[]>([]);
  const [slot,setSlot]=useState<string>("");
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(1);
  const [error,setError]=useState("");
  const [done,setDone]=useState<{id:string}|null>(null);

  const professionals=useMemo(()=>service?staffMap[service.id]||[]:[],[service,staffMap]);

  async function loadSlots(nextDate:string){
    if(!service||!staff||!nextDate) return;
    setDate(nextDate); setSlot(""); setError(""); setLoading(true);
    const qs=new URLSearchParams({shop:shopId,staff:staff.id,service:service.id,date:nextDate});
    const r=await fetch(`/api/availability?${qs.toString()}`);
    const j=await r.json();
    setSlots(j.slots||[]); setLoading(false);
  }

  async function submit(form:FormData){
    if(!service||!staff||!slot) return;
    setLoading(true);setError("");
    const bookingRes=await fetch("/api/public-booking",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({
        shopId,staffId:staff.id,serviceId:service.id,startsAt:slot,
        name:String(form.get("name")||""),
        phone:String(form.get("phone")||""),
        email:String(form.get("email")||"")
      })
    });
    const booking=await bookingRes.json();
    if(!bookingRes.ok){
      const messages:Record<string,string>={
        TIME_ALREADY_BOOKED:"Esse horário acabou de ser reservado. Escolha outro.",
        INVALID_PHONE:"Confira o número do WhatsApp.",
        INVALID_NAME:"Digite seu nome completo.",
        INVALID_EMAIL:"Confira o e-mail informado."
      };
      setError(messages[booking.error]||"Não foi possível confirmar o agendamento.");
      setLoading(false); return;
    }
    setDone({id:booking.appointmentId}); setLoading(false);
  }

  if(done) return <section className="bookingDone card">
    <div className="doneIcon">✓</div>
    <h2>Agendamento confirmado</h2>
    <p className="muted">{service?.name} com {staff?.display_name}</p>
    <p><b>{date}</b> · <b>{new Date(slot).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</b></p>
    <p className="muted">Você pode salvar esta página. Em seguida entraremos com WhatsApp/e-mail.</p>
  </section>;

  return <section className="wizard">
    <div className="steps">
      {[1,2,3,4].map(n=><i key={n} className={n<=step?"step on":"step"}/>)}
    </div>

    {step===1 && <div className="services">
      {services.length===0?<EmptyState eyebrow="Agenda em preparação" title="A agenda ainda está sendo montada" description="Esta barbearia ainda não publicou serviços para reserva. Volte em breve."/>:services.map(s=><button key={s.id} className="card service serviceBtn" onClick={()=>{setService(s);setStep(2)}}>
        <div><b>{s.name}</b><div className="muted">{s.duration_minutes} min</div></div>
        <b>R$ {(s.price_cents/100).toFixed(2).replace(".",",")}</b>
      </button>)}
    </div>}

    {step===2 && <div className="services">
      {professionals.map(p=><button key={p.id} className="card service serviceBtn" onClick={()=>{setStaff(p);setStep(3)}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div className="avatar">{p.photo_url?<img src={p.photo_url} alt={p.display_name}/>:p.display_name[0]}</div>
          <div style={{textAlign:"left"}}><b>{p.display_name}</b><div className="muted">Escolher profissional</div></div>
        </div>
        <span>›</span>
      </button>)}
      <button className="btn" onClick={()=>setStep(1)}>Voltar</button>
    </div>}

    {step===3 && <div className="card bookingStep">
      <label>Escolha a data<input type="date" value={date} onChange={e=>loadSlots(e.target.value)}/></label>
      {loading?<p className="muted">Buscando horários...</p>:<div className="slotGrid">
        {slots.length===0 && date && <p className="muted">Nenhum horário livre nessa data.</p>}
        {slots.map(s=>{
          const h=new Date(s.slot_start).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
          return <button key={s.slot_start} className={slot===s.slot_start?"slotBtn selected":"slotBtn"} onClick={()=>setSlot(s.slot_start)}>{h}</button>
        })}
      </div>}
      <div className="wizardActions">
        <button className="btn" onClick={()=>setStep(2)}>Voltar</button>
        <button className="btn primary" disabled={!slot} onClick={()=>setStep(4)}>Continuar</button>
      </div>
    </div>}

    {step===4 && <form className="card bookingStep" action={submit}>
      <h3>Seus dados</h3>
      <label>Nome<input name="name" required placeholder="Seu nome"/></label>
      <label>WhatsApp<input name="phone" required placeholder="(21) 99999-9999"/></label>
      <label>E-mail <span className="muted">(opcional)</span><input name="email" type="email" placeholder="voce@email.com"/></label>
      {error && <div className="errorBox">{error}</div>}
      <div className="summaryBox">
        <div><span>Serviço</span><b>{service?.name}</b></div>
        <div><span>Profissional</span><b>{staff?.display_name}</b></div>
        <div><span>Horário</span><b>{date} · {slot&&new Date(slot).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</b></div>
      </div>
      <div className="wizardActions">
        <button type="button" className="btn" onClick={()=>setStep(3)}>Voltar</button>
        <button className="btn primary" disabled={loading}>{loading?"Confirmando...":"Confirmar agendamento"}</button>
      </div>
    </form>}
  </section>
}
