import {getCurrentMembership} from "@/lib/auth";
import {redirect} from "next/navigation";
import {RealDashboard} from "@/components/dashboard/RealDashboard";

export default async function Dashboard(){
 const {supabase,membership}=await getCurrentMembership();
 if(!membership)redirect("/onboarding");
 const start=new Date();start.setHours(0,0,0,0);
 const end=new Date(start);end.setDate(end.getDate()+1);
 const [{data:appointments},{data:staff}]=await Promise.all([
  supabase.from("appointments")
   .select("id,staff_id,starts_at,status,price_cents,clients(name),services(name),shop_members!appointments_staff_id_fkey(display_name)")
   .eq("shop_id",membership.shop_id).gte("starts_at",start.toISOString()).lt("starts_at",end.toISOString()).order("starts_at"),
  supabase.from("shop_members").select("id,display_name,photo_url,commission_percent").eq("shop_id",membership.shop_id).order("display_name")
 ]);
 return <RealDashboard appointments={(appointments??[]) as any} staff={(staff??[]) as any} member={membership as any}/>;
}
