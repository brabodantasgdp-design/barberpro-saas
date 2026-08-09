import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
 const supabase=await createServerSupabase();
 const body=await req.json();
 const {data,error}=await supabase.from("services").insert({
   shop_id:body.shopId,name:body.name,duration_minutes:body.durationMinutes,
   buffer_minutes:body.bufferMinutes??0,price_cents:body.priceCents
 }).select().single();
 if(error) return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json(data,{status:201});
}
