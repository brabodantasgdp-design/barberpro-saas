import Link from "next/link";
import {getCurrentMembership} from "@/lib/auth";
import {LogoutButton} from "@/components/auth/LogoutButton";
import {ActiveNav} from "@/components/ActiveNav";

const items=[
 {icon:"◆",label:"Visão geral",href:"/dashboard"},
 {icon:"▣",label:"Agenda",href:"/agenda"},
 {icon:"♙",label:"Clientes",href:"/clientes"},
 {icon:"✂",label:"Serviços",href:"/servicos"},
 {icon:"♙",label:"Equipe",href:"/equipe"},
 {icon:"◉",label:"Relatórios",href:"/relatorios"},
 {icon:"⚙",label:"Configurações",href:"/configuracoes"},
];

export async function Shell({children}:{children:React.ReactNode}){
 const {membership}=await getCurrentMembership();
 const member=membership as any;
 const shop=member?.shops;
 return <div className="shell premiumShell">
  <aside className="sidebar premiumSidebar">
   <div className="brand premiumBrand"><i>B</i><span>BARBER<b>PRO</b><small>SISTEMA PREMIUM PARA BARBEARIAS</small></span></div>
   <div className="shopIdentity"><div className="avatar">{String(shop?.name||"B")[0]}</div><span><b>{shop?.name||"Barbearia"}</b><small>Premium Barbershop</small></span><em>⌄</em></div>
   <ActiveNav items={items}/>
   <div className="sidebarUser"><div><div className="avatar">{String(member?.display_name||"P")[0]}</div><span><b>{member?.display_name||"Proprietário"}</b><small>{member?.role==="owner"?"Proprietário":member?.role}</small></span></div><LogoutButton/></div>
  </aside>
  <main className="main premiumMain">{children}</main>
  <nav className="bottom premiumBottom"><Link href="/dashboard">◆<br/>Hoje</Link><Link href="/agenda">▣<br/>Agenda</Link><Link className="plus" href="/agenda">+</Link><Link href="/clientes">♙<br/>Clientes</Link><LogoutButton compact/></nav>
 </div>;
}
