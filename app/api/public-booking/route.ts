import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {parsePublicClient} from "@/lib/security/public-request";
import {env} from "@/lib/env";

export async function POST(req:Request){
 const body=await req.json();
 const required=["shopId","staffId","serviceId","startsAt"];
 if(required.some(k=>!body[k]))return NextResponse.json({error:"INVALID_REQUEST"},{status:400});

 const parsed=parsePublicClient({
  name:body.name,phone:body.phone,email:body.email
 });
 if(!parsed.ok)return NextResponse.json({error:parsed.error},{status:400});

 const supabase=createClient(
  env("NEXT_PUBLIC_SUPABASE_URL"),
  env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  {auth:{persistSession:false,autoRefreshToken:false}}
 );

 const {data,error}=await supabase.rpc("create_public_booking",{
  p_shop:body.shopId,
  p_staff:body.staffId,
  p_service:body.serviceId,
  p_name:parsed.value.name,
  p_phone:parsed.value.phone,
  p_email:parsed.value.email,
  p_starts_at:body.startsAt
 });

 if(error){
  const known=["INVALID_NAME","INVALID_PHONE","INVALID_EMAIL","SHOP_NOT_FOUND","SERVICE_NOT_AVAILABLE","STAFF_CANNOT_PERFORM_SERVICE","OUTSIDE_WORK_SCHEDULE","TIME_BLOCKED","TIME_ALREADY_BOOKED"];
  const code=known.find(x=>error.message.includes(x))??"BOOKING_FAILED";
  return NextResponse.json({error:code},{status:code==="TIME_ALREADY_BOOKED"?409:400});
 }
 return NextResponse.json({appointmentId:data},{status:201});
}
