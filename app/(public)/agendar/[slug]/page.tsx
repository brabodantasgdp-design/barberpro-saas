import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { PublicBookingWizard } from "@/components/PublicBookingWizard";

export default async function Booking({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const supabase=createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})}}
 );

 const {data:shop}=await supabase.from("public_shops").select("*").eq("slug",slug).maybeSingle();
 if(!shop) notFound();

 const {data:services}=await supabase.from("public_services").select("*").eq("shop_id",shop.id).order("price_cents");
 const {data:links}=await supabase.from("staff_services").select("staff_id,service_id");
 const staffIds=[...new Set((links??[]).map(x=>x.staff_id))];
 const {data:staff}=staffIds.length
  ? await supabase.from("public_staff").select("*").eq("shop_id",shop.id).in("id",staffIds)
  : {data:[] as any[]};

 const staffById=new Map((staff??[]).map(x=>[x.id,x]));
 const staffMap:Record<string,any[]>={};
 for(const l of links??[]){
   const person=staffById.get(l.staff_id);
   if(person) (staffMap[l.service_id]??=[]).push(person);
 }

 return <main className="public">
   <div className="publicTopline"><span>BARBERPRO</span><span>AGENDE ONLINE</span></div>
   <section className="hero">
     <div className="avatar" style={{margin:"0 auto 14px",width:64,height:64}}>
       {shop.logo_url?<img src={shop.logo_url} alt="Logo"/>:shop.name[0]}
     </div>
     <div className="eyebrow">Seu próximo visual começa aqui</div>
     <h1>{shop.name}</h1>
     <p className="muted">Agende seu horário sem criar conta.</p>
   </section>
   <PublicBookingWizard shopId={shop.id} slug={slug} services={services??[]} staffMap={staffMap}/>
 </main>
}
