import Link from "next/link";
export function Shell({children}:{children:React.ReactNode}){
 return <div className="shell">
  <aside className="sidebar"><div className="brand"><i>✦</i> BARBERPRO</div><nav className="nav">
   <Link className="active" href="/dashboard">⌂ Visão geral</Link><Link href="/agenda">▦ Agenda</Link><Link href="/clientes">◎ Clientes</Link><Link href="/servicos">✂ Serviços</Link><Link href="/equipe">♟ Equipe</Link><Link href="#">R$ Financeiro</Link><Link href="/relatorios">↗ Relatórios</Link><Link href="/configuracoes">⚙ Configurações</Link>
  </nav></aside>
  <main className="main">{children}</main>
  <nav className="bottom"><Link href="/dashboard">⌂<br/>Hoje</Link><Link href="/agenda">▦<br/>Agenda</Link><Link className="plus" href="/agenda">+</Link><Link href="/clientes">◎<br/>Clientes</Link><Link href="/equipe">♙<br/>Equipe</Link></nav>
 </div>
}
