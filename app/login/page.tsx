import { signIn, signUp } from "./actions";

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const q=await searchParams;
 return <main className="authPage">
   <section className="authCard">
     <div className="authBrand"><span>✦</span> BARBERPRO</div>
     <h1>Entre na sua barbearia</h1>
     <p className="muted">Agenda, equipe e resultados em um só lugar.</p>
     {q.error && <div className="errorBox">Não foi possível concluir. Confira os dados e tente novamente.</div>}
     <form className="authForm">
       <label>E-mail<input name="email" type="email" required placeholder="voce@barbearia.com"/></label>
       <label>Senha<input name="password" type="password" required minLength={6} placeholder="••••••••"/></label>
       <button className="btn primary" formAction={signIn}>Entrar</button>
       <button className="btn" formAction={signUp}>Criar conta</button>
     </form>
   </section>
 </main>
}
