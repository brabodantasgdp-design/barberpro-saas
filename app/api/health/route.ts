import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {env} from "@/lib/env";

export async function GET(){
 let transportFailed=false;
 try{
  const supabase=createClient(env("NEXT_PUBLIC_SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{
   auth:{persistSession:false,autoRefreshToken:false},
   global:{fetch:async(input,init)=>{
    try{
     return await fetch(input,{...init,signal:AbortSignal.timeout(8000)});
    }catch(error){
     transportFailed=true;
     throw error;
    }
   }}
  });
  const {error}=await supabase.from("shops").select("id",{head:true,count:"exact"}).limit(1);
  if(error){
   return NextResponse.json({status:"degraded",reason:transportFailed?"supabase_unreachable":"database_query_failed"},{status:503});
  }
  return NextResponse.json({status:"ok",database:"ok"});
 }catch(error){
  const reason=error instanceof Error&&error.message.includes("Missing environment variable")?"config_missing":"supabase_unreachable";
  return NextResponse.json({status:"degraded",reason},{status:503});
 }
}
