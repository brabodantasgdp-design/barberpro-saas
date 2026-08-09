 "use server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export async function signIn(formData:FormData){
  const supabase=await createServerSupabase();
  const email=String(formData.get("email")||"");
  const password=String(formData.get("password")||"");
  const {data:authData,error}=await supabase.auth.signInWithPassword({email,password});
  if(error || !authData.user) redirect("/login?error=credenciais");
  const {data:membership}=await supabase.from("shop_members").select("id").eq("user_id",authData.user.id).limit(1).maybeSingle();
  redirect(membership?"/dashboard":"/onboarding");
}

export async function signUp(formData:FormData){
  const supabase=await createServerSupabase();
  const email=String(formData.get("email")||"");
  const password=String(formData.get("password")||"");
  const {data,error}=await supabase.auth.signUp({email,password});
  if(error) redirect("/login?error=cadastro");
  if(!data.session) redirect("/login?message=confirme-email");
  redirect("/onboarding");
}
