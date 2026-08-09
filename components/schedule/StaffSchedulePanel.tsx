"use client";
import {useState} from "react";
import {WeeklyScheduleEditor} from "./WeeklyScheduleEditor";
import { EmptyState } from "@/components/EmptyState";
type Staff={id:string;display_name:string};
type Day={weekday:number;enabled:boolean;start:string;end:string};
export function StaffSchedulePanel({staff,schedules}:{staff:Staff[];schedules:Record<string,Day[]>}){
 const [id,setId]=useState(staff[0]?.id||"");
 const person=staff.find(x=>x.id===id);
 return <section className="card">
  <div className="panelhead"><b>Jornada semanal</b><select className="compactSelect" value={id} onChange={e=>setId(e.target.value)}>{staff.map(p=><option value={p.id} key={p.id}>{p.display_name}</option>)}</select></div>
  <div className="panelbody">{person?<WeeklyScheduleEditor key={id} staffId={id} initial={schedules[id]||[]}/>:<EmptyState eyebrow="Jornada" title="Adicione um profissional primeiro" description="A jornada semanal fica vinculada a cada pessoa da equipe." action="Ir para equipe" href="/equipe"/>}</div>
 </section>
}
