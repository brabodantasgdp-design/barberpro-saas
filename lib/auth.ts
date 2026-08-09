import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export async function requireUser(){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  return {supabase,user};
}

export async function getCurrentMembership(){
  const {supabase,user}=await requireUser();
  const {data}=await supabase
    .from("shop_members")
    .select("id,shop_id,role,display_name,photo_url,commission_percent,can_block_time,block_requires_approval,shops(name,slug,logo_url,theme)")
    .eq("user_id",user.id)
    .limit(1)
    .maybeSingle();
  if(!data) redirect("/onboarding");
  return {supabase,user,membership:data};
}
