import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function PATCH(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const body=await req.json();
  const {data:me}=await supabase.from("shop_members").select("id,shop_id,role").eq("user_id",user.id).single();
  if(!me)return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const {data:a}=await supabase.from("appointments")
    .select("id,shop_id,staff_id,service_id,client_id,status")
    .eq("id",body.id).single();

  if(!a || a.shop_id!==me.shop_id)return NextResponse.json({error:"NOT_FOUND"},{status:404});
  const canAll=["owner","partner","manager","reception"].includes(me.role);
  const canOwn=me.role==="barber" && a.staff_id===me.id;
  if(!canAll&&!canOwn)return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const {data:newId,error}=await supabase.rpc("reschedule_appointment",{
    p_appointment:a.id,p_new_staff:body.staffId??a.staff_id,p_new_start:body.startsAt
  });
  if(error){
    const code=error.message.includes("TIME_ALREADY_BOOKED")?"TIME_ALREADY_BOOKED":"RESCHEDULE_FAILED";
    return NextResponse.json({error:code},{status:code==="TIME_ALREADY_BOOKED"?409:400});
  }
  return NextResponse.json({id:newId});
}
