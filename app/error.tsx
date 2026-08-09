"use client";
export default function ErrorPage({reset}:{reset:()=>void}){
 return <main className="statePage">
  <div className="stateIcon">!</div>
  <h1>Algo não saiu como esperado</h1>
  <p className="muted">Seus dados continuam protegidos. Tente carregar novamente.</p>
  <button className="btn primary" onClick={()=>reset()}>Tentar novamente</button>
 </main>
}
