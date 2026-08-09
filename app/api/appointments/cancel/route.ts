import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function PATCH(req:Request){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const body=await req.json();
 const {data:me}=await supabase.from("shop_members").select("id,shop_id,role").eq("user_id",user.id).single();
 if(!me)return NextResponse.json({error:"FORBIDDEN"},{status:403});

 const {data:a}=await supabase.from("appointments").select("id,shop_id,staff_id,status").eq("id",body.id).single();
 if(!a || a.shop_id!==me.shop_id)return NextResponse.json({error:"NOT_FOUND"},{status:404});
 const can=["owner","partner","manager","reception"].includes(me.role) || (me.role==="barber"&&a.staff_id===me.id);
 if(!can)return NextResponse.json({error:"FORBIDDEN"},{status:403});

 const {data,error}=await supabase.from("appointments").update({status:"cancelled"}).eq("id",a.id).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 await supabase.rpc("log_audit",{p_shop:me.shop_id,p_action:"appointment.cancel",p_entity_type:"appointment",p_entity_id:a.id,p_payload:{from:a.status}});
 return NextResponse.json(data);
}
