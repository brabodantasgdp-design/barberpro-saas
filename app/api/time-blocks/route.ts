import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const body=await req.json();
  const {data:me}=await supabase
    .from("shop_members")
    .select("id,shop_id,role,can_block_time,block_requires_approval")
    .eq("user_id",user.id)
    .single();

  if(!me) return NextResponse.json({error:"NO_MEMBERSHIP"},{status:403});

  const isManager=["owner","partner","manager"].includes(me.role);
  const targetStaffId=body.staffId || me.id;

  if(!isManager && targetStaffId!==me.id)
    return NextResponse.json({error:"FORBIDDEN"},{status:403});
  if(!isManager && !me.can_block_time)
    return NextResponse.json({error:"BLOCK_NOT_ALLOWED"},{status:403});

  const status=isManager || !me.block_requires_approval ? "approved" : "pending";

  const {data,error}=await supabase.from("time_blocks").insert({
    shop_id:me.shop_id,
    staff_id:targetStaffId,
    starts_at:body.startsAt,
    ends_at:body.endsAt,
    reason:body.reason || null,
    status,
    created_by:user.id
  }).select().single();

  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json(data,{status:201});
}

export async function PATCH(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const body=await req.json();
  const {data:me}=await supabase.from("shop_members")
    .select("shop_id,role").eq("user_id",user.id).single();

  if(!me || !["owner","partner","manager"].includes(me.role))
    return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const {data,error}=await supabase.from("time_blocks")
    .update({status:body.status})
    .eq("id",body.id)
    .eq("shop_id",me.shop_id)
    .select().single();

  if(error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json(data);
}
