import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function GET(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const {data:me}=await supabase.from("shop_members")
    .select("shop_id,role").eq("user_id",user.id).single();
  if(!me)return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const q=new URL(req.url).searchParams;
  const from=q.get("from") ?? new Date(new Date().setDate(1)).toISOString();
  const to=q.get("to") ?? new Date().toISOString();

  let query=supabase.from("appointments")
    .select("id,staff_id,status,price_cents,starts_at,shop_members!appointments_staff_id_fkey(display_name,commission_percent),services(name)")
    .eq("shop_id",me.shop_id)
    .gte("starts_at",from)
    .lte("starts_at",to);

  if(me.role==="barber"){
    const {data:self}=await supabase.from("shop_members").select("id").eq("user_id",user.id).single();
    query=query.eq("staff_id",self?.id);
  }

  const {data,error}=await query;
  if(error)return NextResponse.json({error:error.message},{status:400});

  const rows=(data??[]).filter((x:any)=>!["cancelled","no_show"].includes(x.status));
  const gross=rows.reduce((s:any,a:any)=>s+(a.price_cents??0),0);
  const byStaff=new Map<string,{name:string,gross:number,count:number,commission:number}>();

  for(const a of rows as any[]){
    const id=a.staff_id;
    const name=a.shop_members?.display_name ?? "Profissional";
    const pct=Number(a.shop_members?.commission_percent??0);
    const item=byStaff.get(id)??{name,gross:0,count:0,commission:0};
    item.gross+=a.price_cents??0;
    item.count++;
    item.commission=Math.round(item.gross*pct/100);
    byStaff.set(id,item);
  }

  return NextResponse.json({
    gross,
    count:rows.length,
    averageTicket:rows.length?Math.round(gross/rows.length):0,
    byStaff:[...byStaff.entries()].map(([id,v])=>({id,...v}))
  });
}
