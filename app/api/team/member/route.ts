import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";

export async function PATCH(req:Request){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
 const body=await req.json();
 const {data:me}=await supabase.from("shop_members").select("shop_id,role").eq("user_id",user.id).single();
 if(!me||!["owner","partner","manager"].includes(me.role))
   return NextResponse.json({error:"FORBIDDEN"},{status:403});

 const patch:any={};
 if(body.displayName!==undefined)patch.display_name=body.displayName;
 if(body.commissionPercent!==undefined)patch.commission_percent=Math.max(0,Math.min(100,Number(body.commissionPercent)));
 if(body.canBlockTime!==undefined)patch.can_block_time=!!body.canBlockTime;
 if(body.blockRequiresApproval!==undefined)patch.block_requires_approval=!!body.blockRequiresApproval;
 if(body.role!==undefined && ["owner","partner"].includes(me.role))patch.role=body.role;

 const {data,error}=await supabase.from("shop_members").update(patch)
   .eq("id",body.id).eq("shop_id",me.shop_id).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json(data);
}
