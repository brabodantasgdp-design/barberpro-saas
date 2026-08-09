 "use server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

function slugify(v:string){
 return v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
  .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);
}

export async function createShop(formData:FormData){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");

 const name=String(formData.get("name")||"").trim();
 const slug=slugify(String(formData.get("slug")||name));
 const phone=String(formData.get("phone")||"").trim();

 if(!name || !slug) redirect("/onboarding?error=dados");

 const {data,error}=await supabase.rpc("create_shop_with_owner",{
  p_name:name,p_slug:slug,p_owner_name:String(formData.get("ownerName")||"Proprietário"),p_phone:phone||null
 });
 if(error || !data) redirect("/onboarding?error=criar");
 redirect("/dashboard");
}
