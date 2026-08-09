import {getCurrentMembership} from "@/lib/auth";
export default async function Configuracoes(){
 const {membership}=await getCurrentMembership();
 const shop:any=(membership as any)?.shops;
 return <>
  <div className="top"><div><h1>Configurações</h1><div className="muted">Sua marca e identidade pública.</div></div></div>
  <div className="settingsGrid">
   <section className="card"><div className="panelhead"><b>Identidade</b></div><div className="panelbody form">
    <div className="brandPreview"><div className="avatar large">{shop?.logo_url?<img src={shop.logo_url} alt="Logo"/>:(shop?.name||"B")[0]}</div><div><b>{shop?.name||"Sua barbearia"}</b><div className="muted">Logo usada no painel e agendamento.</div></div></div>
    <form action="/api/shop/logo" method="post" encType="multipart/form-data"><input type="file" name="file" accept="image/*"/><button className="btn primary">Atualizar logo</button></form>
   </div></section>
   <section className="card"><div className="panelhead"><b>Página pública</b></div><div className="panelbody">
    <p className="muted">Seu cliente agenda sem precisar criar conta.</p><code>/agendar/{shop?.slug||"sua-barbearia"}</code>
   </div></section>
  </div>
 </>;
}
