import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {env} from "@/lib/env";

export async function GET(){
 try{
  const supabase=createClient(env("NEXT_PUBLIC_SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{
   auth:{persistSession:false,autoRefreshToken:false}
  });
  const {error}=await supabase.from("shops").select("id",{head:true,count:"exact"}).limit(1);
  if(error)throw error;
  return NextResponse.json({status:"ok",database:"ok"});
 }catch{
  return NextResponse.json({status:"degraded"},{status:503});
 }
}
