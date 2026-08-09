import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req:Request){
 try{
  const body=await req.json();
  const required=["shopId","staffId","serviceId","clientId","startsAt"];
  if(required.some(k=>!body[k])) return NextResponse.json({error:"INVALID_REQUEST"},{status:400});

  const supabase=createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {data,error}=await supabase.rpc("book_appointment",{
   p_shop:body.shopId,
   p_staff:body.staffId,
   p_service:body.serviceId,
   p_client:body.clientId,
   p_starts_at:body.startsAt,
   p_notes:body.notes ?? null
  });

  if(error){
   const known=["SERVICE_NOT_AVAILABLE","STAFF_CANNOT_PERFORM_SERVICE","OUTSIDE_WORK_SCHEDULE","TIME_BLOCKED","TIME_ALREADY_BOOKED","SHOP_NOT_FOUND"];
   const code=known.find(x=>error.message.includes(x)) ?? "UNKNOWN";
   return NextResponse.json({error:code},{status:code==="TIME_ALREADY_BOOKED"?409:400});
  }
  return NextResponse.json({id:data},{status:201});
 }catch{
  return NextResponse.json({error:"UNKNOWN"},{status:500});
 }
}
