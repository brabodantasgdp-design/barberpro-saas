import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

async function context(id:string){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return {error:NextResponse.json({error:"UNAUTHORIZED"},{status:401})};
 const {data:me}=await supabase.from("shop_members").select("id,shop_id,role").eq("user_id",user.id).single();
 if(!me)return {error:NextResponse.json({error:"FORBIDDEN"},{status:403})};
 const {data:a}=await supabase.from("appointments").select("id,shop_id,staff_id,status,notes").eq("id",id).single();
 if(!a||a.shop_id!==me.shop_id)return {error:NextResponse.json({error:"NOT_FOUND"},{status:404})};
 const can=["owner","partner","manager","reception"].includes(me.role)||(me.role==="barber"&&a.staff_id===me.id);
 if(!can)return {error:NextResponse.json({error:"FORBIDDEN"},{status:403})};
 return {supabase,me,a};
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params; const c:any=await context(id); if(c.error)return c.error;
 const body=await req.json();
 if(body.action==="cancel"){
   const {data,error}=await c.supabase.from("appointments").update({status:"cancelled"}).eq("id",id).select().single();
   if(error)return NextResponse.json({error:error.message},{status:400});
   await c.supabase.rpc("log_audit",{p_shop:c.me.shop_id,p_action:"appointment.cancel",p_entity_type:"appointment",p_entity_id:id,p_payload:{}});
   return NextResponse.json(data);
 }
 if(body.action==="reschedule"){
   const {data,error}=await c.supabase.rpc("reschedule_appointment",{p_appointment:id,p_new_staff:body.staffId??c.a.staff_id,p_new_start:body.startsAt});
   if(error)return NextResponse.json({error:error.message.includes("TIME_ALREADY_BOOKED")?"TIME_ALREADY_BOOKED":"RESCHEDULE_FAILED"},{status:error.message.includes("TIME_ALREADY_BOOKED")?409:400});
   return NextResponse.json({id:data});
 }
 if(body.action==="notes"){
   const {data,error}=await c.supabase.from("appointments").update({notes:body.notes??null}).eq("id",id).select().single();
   if(error)return NextResponse.json({error:error.message},{status:400});
   return NextResponse.json(data);
 }
 return NextResponse.json({error:"INVALID_ACTION"},{status:400});
}
