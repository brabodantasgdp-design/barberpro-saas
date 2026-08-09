import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const {data:membership}=await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id",user.id)
    .limit(1)
    .single();

  if(!membership) return NextResponse.json({error:"NO_SHOP"},{status:404});

  const shopId=membership.shop_id;
  const now=new Date();
  const start=new Date(now); start.setHours(0,0,0,0);
  const end=new Date(start); end.setDate(end.getDate()+1);

  const [{data:appointments},{data:staff}] = await Promise.all([
    supabase.from("appointments")
      .select("id,staff_id,status,price_cents,starts_at")
      .eq("shop_id",shopId)
      .gte("starts_at",start.toISOString())
      .lt("starts_at",end.toISOString()),
    supabase.from("shop_members")
      .select("id,display_name,photo_url,commission_percent")
      .eq("shop_id",shopId)
  ]);

  const valid=(appointments??[]).filter(a=>!["cancelled","no_show"].includes(a.status));
  const revenue=valid.reduce((s,a)=>s+(a.price_cents??0),0);
  const completed=valid.filter(a=>a.status==="completed").length;

  const byStaff=(staff??[]).map(s=>{
    const own=valid.filter(a=>a.staff_id===s.id);
    const gross=own.reduce((sum,a)=>sum+(a.price_cents??0),0);
    return {
      id:s.id,name:s.display_name,photoUrl:s.photo_url,
      appointments:own.length,gross,
      commission:Math.round(gross*(Number(s.commission_percent||0)/100))
    };
  });

  return NextResponse.json({
    revenue,appointments:valid.length,completed,
    averageTicket:valid.length?Math.round(revenue/valid.length):0,
    byStaff
  });
}
