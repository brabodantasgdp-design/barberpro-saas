"use client";
import {useState} from "react";
const names=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
type Day={weekday:number;enabled:boolean;start:string;end:string};

export function WeeklyScheduleEditor({staffId,initial}:{staffId:string;initial:Day[]}){
 const defaults=names.map((_,weekday)=>({weekday,enabled:weekday>0&&weekday<6,start:"09:00",end:"19:00"}));
 const [days,setDays]=useState(defaults.map(d=>initial.find(x=>x.weekday===d.weekday)||d));
 const [saved,setSaved]=useState(false);
 function patch(i:number,p:Partial<Day>){setDays(x=>x.map((d,n)=>n===i?{...d,...p}:d));setSaved(false)}
 async function save(){
  const r=await fetch("/api/schedules",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({staffId,days})});
  setSaved(r.ok);
 }
 return <div className="weekEditor">
  {days.map((d,i)=><div className="weekRow" key={d.weekday}>
   <label className="switchLabel"><input type="checkbox" checked={d.enabled} onChange={e=>patch(i,{enabled:e.target.checked})}/><b>{names[d.weekday]}</b></label>
   {d.enabled?<div className="timePair"><input type="time" value={d.start} onChange={e=>patch(i,{start:e.target.value})}/><span>até</span><input type="time" value={d.end} onChange={e=>patch(i,{end:e.target.value})}/></div>:<span className="muted">Folga</span>}
  </div>)}
  <div className="saveBar"><span className="muted">{saved?"✓ Jornada salva":""}</span><button className="btn primary" onClick={save}>Salvar jornada</button></div>
 </div>
}
