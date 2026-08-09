import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const form=await req.formData();
  const file=form.get("file");
  const staffId=String(form.get("staffId")||"");
  if(!(file instanceof File) || !staffId) return NextResponse.json({error:"INVALID_REQUEST"},{status:400});

  const {data:me}=await supabase.from("shop_members")
    .select("id,shop_id,role").eq("user_id",user.id).single();
  if(!me) return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const canEdit=me.id===staffId || ["owner","partner","manager"].includes(me.role);
  if(!canEdit) return NextResponse.json({error:"FORBIDDEN"},{status:403});

  const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
  const path=`${me.shop_id}/staff/${staffId}.${ext}`;
  const bytes=await file.arrayBuffer();

  const {error}=await supabase.storage.from("barber-assets")
    .upload(path,bytes,{contentType:file.type,upsert:true});
  if(error) return NextResponse.json({error:"UPLOAD_FAILED"},{status:400});

  const {data:publicUrl}=supabase.storage.from("barber-assets").getPublicUrl(path);
  await supabase.from("shop_members").update({photo_url:publicUrl.publicUrl}).eq("id",staffId);

  return NextResponse.json({url:publicUrl.publicUrl});
}
