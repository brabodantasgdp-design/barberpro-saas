import {createShop} from "./actions";
import {createServerSupabase} from "@/lib/supabase/server";
import {SetupWizard} from "@/components/onboarding/SetupWizard";
export default async function Onboarding({searchParams}:{searchParams:Promise<{error?:string}>}){
 const q=await searchParams;const supabase=await createServerSupabase();const {data:{user}}=await supabase.auth.getUser();
 const {data:membership}=user?await supabase.from("shop_members").select("shop_id").eq("user_id",user.id).limit(1).maybeSingle():{data:null};
 if(membership)return <main className="onboardingPage"><SetupWizard shopId={membership.shop_id}/></main>;
 return <main className="authPage"><section className="authCard onboardingCard"><div className="authBrand"><span>✦</span> BARBERPRO</div><h1>Crie sua barbearia</h1><p className="muted">Primeiro montamos sua identidade. Depois configuramos a operação.</p>{q.error&&<div className="errorBox">Não foi possível criar a barbearia.</div>}<form className="authForm" action={createShop}><label>Seu nome<input name="ownerName" required/></label><label>Nome da barbearia<input name="name" required/></label><label>Link público<input name="slug"/></label><label>WhatsApp<input name="phone"/></label><button className="btn primary">Criar e configurar</button></form></section></main>
}
