import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

const allowed=["confirmed","arrived","in_service","completed","cancelled","no_show"];

export async function PATCH(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  const body=await req.json();
  if(!allowed.includes(body.status))return NextResponse.json({error:"INVALID_STATUS"},{status:400});

  const {data:me}=await supabase.from("shop_members")
    .select("id,shop_id,role").eq("user_id",user.id).single();
  if(!me)return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const {data:appt}=await supabase.from("appointments")
    .select("id,shop_id,staff_id,status").eq("id",body.id).single();
  if(!appt || appt.shop_id!==me.shop_id)return NextResponse.json({error:"NOT_FOUND"},{status:404});

  const canAll=["owner","partner","manager","reception"].includes(me.role);
  const canOwn=me.role==="barber" && appt.staff_id===me.id;
  if(!canAll && !canOwn)return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const {data,error}=await supabase.from("appointments").update({status:body.status}).eq("id",body.id).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  await supabase.rpc("log_audit",{p_shop:me.shop_id,p_action:"appointment.status",p_entity_type:"appointment",p_entity_id:body.id,p_payload:{from:appt.status,to:body.status}});
  return NextResponse.json(data);
}
