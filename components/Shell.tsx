"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, LayoutDashboard, Plus, Scissors, Settings2, Sparkles, UserRound, Users } from "lucide-react";

const primaryNav = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/clientes", label: "Clientes", icon: UserRound },
];
const studioNav = [
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/equipe", label: "Equipe", icon: Users },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icon: Settings2 },
];

function NavLink({ href, label, icon: Icon, pathname }: { href: string; label: string; icon: typeof LayoutDashboard; pathname: string }) {
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  return <Link className={active ? "active" : ""} href={href}><Icon size={17} strokeWidth={1.8} /><span>{label}</span></Link>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brandGlyph"><Sparkles size={15} /></span><span>BARBER<span>PRO</span></span></div>
      <div className="workspaceSwitch"><span className="workspaceAvatar">B</span><span><small>Seu espaço</small><strong>Barbearia principal</strong></span><span className="workspaceDot" /></div>
      <div className="navLabel">Operação</div>
      <nav className="nav">{primaryNav.map(item => <NavLink key={item.href} {...item} pathname={pathname} />)}</nav>
      <div className="navLabel navLabelSpaced">Gestão</div>
      <nav className="nav">{studioNav.map(item => <NavLink key={item.href} {...item} pathname={pathname} />)}</nav>
      <div className="sidebarFooter"><div className="proBadge"><Sparkles size={14} /><span><b>BarberPro Pro</b><small>Seu negócio, no controle.</small></span></div><Link href="/configuracoes" className="profileMini"><span className="avatar">B</span><span><b>Minha conta</b><small>Administrador</small></span></Link></div>
    </aside>
    <main className="main">{children}</main>
    <nav className="bottom"><Link href="/dashboard"><LayoutDashboard size={18} /><span>Hoje</span></Link><Link href="/agenda"><CalendarDays size={18} /><span>Agenda</span></Link><Link className="plus" href="/agenda"><Plus size={22} /></Link><Link href="/clientes"><UserRound size={18} /><span>Clientes</span></Link><Link href="/equipe"><Users size={18} /><span>Equipe</span></Link></nav>
  </div>;
}
