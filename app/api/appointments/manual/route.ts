import {NextResponse} from "next/server";
import {createServerSupabase} from "@/lib/supabase/server";
import {createClient} from "@supabase/supabase-js";

export async function POST(req:Request){
  const session=await createServerSupabase();
  const {data:{user}}=await session.auth.getUser();
  if(!user)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const {data:me}=await session.from("shop_members")
    .select("shop_id,role").eq("user_id",user.id).single();
  if(!me || !["owner","partner","manager","reception","barber"].includes(me.role))
    return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const body=await req.json();
  const admin=createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let clientId=body.clientId as string|undefined;
  if(!clientId){
    if(!body.clientName || !body.clientPhone)
      return NextResponse.json({error:"CLIENT_REQUIRED"},{status:400});
    const {data:existing}=await admin.from("clients").select("id")
      .eq("shop_id",me.shop_id).eq("phone",body.clientPhone).maybeSingle();
    if(existing) clientId=existing.id;
    else{
      const {data:newClient,error:clientError}=await admin.from("clients").insert({
        shop_id:me.shop_id,name:body.clientName,phone:body.clientPhone,email:body.clientEmail||null
      }).select("id").single();
      if(clientError)return NextResponse.json({error:"CLIENT_CREATE_FAILED"},{status:400});
      clientId=newClient.id;
    }
  }

  const {data,error}=await admin.rpc("book_appointment",{
    p_shop:me.shop_id,p_staff:body.staffId,p_service:body.serviceId,p_client:clientId,
    p_starts_at:body.startsAt,p_notes:body.notes??null
  });

  if(error){
    const code=error.message.includes("TIME_ALREADY_BOOKED")?"TIME_ALREADY_BOOKED":"BOOKING_FAILED";
    return NextResponse.json({error:code},{status:code==="TIME_ALREADY_BOOKED"?409:400});
  }
  return NextResponse.json({appointmentId:data},{status:201});
}
