import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params; const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const {data:me}=await supabase.from("shop_members").select("shop_id,role").eq("user_id",user.id).single();
 if(!me||!["owner","partner","manager"].includes(me.role))return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const body=await req.json();
 const patch:any={};
 if(body.name!==undefined)patch.name=body.name;
 if(body.durationMinutes!==undefined)patch.duration_minutes=Number(body.durationMinutes);
 if(body.bufferMinutes!==undefined)patch.buffer_minutes=Number(body.bufferMinutes);
 if(body.priceCents!==undefined)patch.price_cents=Number(body.priceCents);
 if(body.active!==undefined)patch.active=!!body.active;
 const {data,error}=await supabase.from("services").update(patch).eq("id",id).eq("shop_id",me.shop_id).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json(data);
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params; const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const {data:me}=await supabase.from("shop_members").select("shop_id,role").eq("user_id",user.id).single();
 if(!me||!["owner","partner"].includes(me.role))return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const {count}=await supabase.from("appointments").select("id",{count:"exact",head:true}).eq("service_id",id);
 if((count||0)>0){
   const {error}=await supabase.from("services").update({active:false}).eq("id",id).eq("shop_id",me.shop_id);
   if(error)return NextResponse.json({error:error.message},{status:400});
   return NextResponse.json({archived:true});
 }
 const {error}=await supabase.from("services").delete().eq("id",id).eq("shop_id",me.shop_id);
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json({deleted:true});
}
