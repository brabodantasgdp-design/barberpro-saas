import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";
export async function GET(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const {data:me}=await supabase.from("shop_members").select("shop_id").eq("user_id",user.id).single();
 if(!me)return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const {data,error}=await supabase.from("notification_jobs").select("*").eq("shop_id",me.shop_id).order("scheduled_for",{ascending:false}).limit(100);
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json(data??[]);
}
