 "use server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export async function signIn(formData:FormData){
  const supabase=await createServerSupabase();
  const email=String(formData.get("email")||"");
  const password=String(formData.get("password")||"");
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error) redirect("/login?error=credenciais");
  redirect("/dashboard");
}

export async function signUp(formData:FormData){
  const supabase=await createServerSupabase();
  const email=String(formData.get("email")||"");
  const password=String(formData.get("password")||"");
  const {error}=await supabase.auth.signUp({email,password});
  if(error) redirect("/login?error=cadastro");
  redirect("/onboarding");
}
