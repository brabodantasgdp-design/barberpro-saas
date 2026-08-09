import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const {data:me}=await supabase.from("shop_members")
    .select("shop_id,role").eq("user_id",user.id).single();
  if(!me || !["owner","partner"].includes(me.role))
    return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const form=await req.formData();
  const file=form.get("file");
  if(!(file instanceof File)) return NextResponse.json({error:"INVALID_REQUEST"},{status:400});

  const ext=(file.name.split(".").pop()||"png").toLowerCase();
  const path=`${me.shop_id}/branding/logo.${ext}`;
  const bytes=await file.arrayBuffer();

  const {error}=await supabase.storage.from("barber-assets")
    .upload(path,bytes,{contentType:file.type,upsert:true});
  if(error) return NextResponse.json({error:"UPLOAD_FAILED"},{status:400});

  const {data:url}=supabase.storage.from("barber-assets").getPublicUrl(path);
  await supabase.from("shops").update({logo_url:url.publicUrl}).eq("id",me.shop_id);

  return NextResponse.json({url:url.publicUrl});
}
