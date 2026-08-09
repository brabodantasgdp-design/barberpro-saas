import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const {data:member}=await supabase.from("shop_members").select("id,shop_id,role").eq("user_id",user.id).limit(1).maybeSingle();
 if(!member)return NextResponse.json({error:"NO_MEMBERSHIP"},{status:403});
 if(!["owner","partner","manager"].includes(member.role))return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const body=await req.json();
 const {data,error}=await supabase.from("services").insert({
   shop_id:member.shop_id,name:body.name,duration_minutes:body.durationMinutes,
   buffer_minutes:body.bufferMinutes??0,price_cents:body.priceCents
 }).select().single();
 if(error) return NextResponse.json({error:error.message},{status:400});
 const {error:assignmentError}=await supabase.from("staff_services").upsert({staff_id:member.id,service_id:data.id});
 if(assignmentError){
   await supabase.from("services").delete().eq("id",data.id).eq("shop_id",member.shop_id);
   return NextResponse.json({error:assignmentError.message},{status:400});
 }
 return NextResponse.json(data,{status:201});
}
