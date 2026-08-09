import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req:Request){
  const session=await createServerSupabase();
  const {data:{user}}=await session.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const {data:me}=await session.from("shop_members")
    .select("shop_id,role").eq("user_id",user.id).single();
  if(!me || !["owner","partner","manager"].includes(me.role))
    return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const body=await req.json();
  const admin=createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {data,error}=await admin.auth.admin.inviteUserByEmail(body.email,{
    data:{pending_shop_id:me.shop_id,pending_role:body.role||"barber",display_name:body.name}
  });

  if(error) return NextResponse.json({error:"INVITE_FAILED"},{status:400});
  return NextResponse.json({invited:true,userId:data.user?.id});
}
