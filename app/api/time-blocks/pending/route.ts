import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";
export async function GET(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const {data:me}=await supabase.from("shop_members").select("shop_id,role").eq("user_id",user.id).single();
 if(!me||!["owner","partner","manager"].includes(me.role))
   return NextResponse.json({error:"FORBIDDEN"},{status:403});
 const {data,error}=await supabase.from("time_blocks")
  .select("id,staff_id,starts_at,ends_at,reason,status,shop_members!time_blocks_staff_id_fkey(display_name)")
  .eq("shop_id",me.shop_id).eq("status","pending").order("starts_at");
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json(data??[]);
}
