import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req:Request){
 const q=new URL(req.url).searchParams;
 const shop=q.get("shop"),staff=q.get("staff"),service=q.get("service"),date=q.get("date");
 if(!shop||!staff||!service||!date) return NextResponse.json({error:"INVALID_REQUEST"},{status:400});

 const supabase=createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 );
 const {data,error}=await supabase.rpc("get_available_slots",{
   p_shop:shop,p_staff:staff,p_service:service,p_date:date
 });
 if(error) return NextResponse.json({error:"AVAILABILITY_FAILED"},{status:500});
 return NextResponse.json({slots:data??[]});
}
