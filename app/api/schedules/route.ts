import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function PUT(req:Request){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const body=await req.json();
 const {data:me}=await supabase.from("shop_members").select("shop_id,role").eq("user_id",user.id).single();
 if(!me||!["owner","partner","manager"].includes(me.role))
   return NextResponse.json({error:"FORBIDDEN"},{status:403});

 const {data:target}=await supabase.from("shop_members").select("id").eq("id",body.staffId).eq("shop_id",me.shop_id).single();
 if(!target)return NextResponse.json({error:"INVALID_STAFF"},{status:400});

 await supabase.from("work_schedules").delete().eq("staff_id",body.staffId);
 const rows=(body.days||[]).filter((x:any)=>x.enabled).map((x:any)=>({
   staff_id:body.staffId,weekday:x.weekday,start_time:x.start,end_time:x.end
 }));
 if(!rows.length)return NextResponse.json({ok:true,rows:[]});
 const {data,error}=await supabase.from("work_schedules").insert(rows).select();
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json({ok:true,rows:data});
}
