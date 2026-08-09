import { getCurrentMembership } from "@/lib/auth";
import { TeamManager } from "@/components/team/TeamManager";

export default async function Equipe(){
 const {supabase,membership}=await getCurrentMembership();
 if(!membership) return <div>Sem barbearia vinculada.</div>;

 const {data}=await supabase.from("shop_members")
   .select("id,display_name,photo_url,role,commission_percent,can_block_time,block_requires_approval")
   .eq("shop_id",membership.shop_id)
   .order("display_name");

 return <TeamManager initial={(data??[]) as any}/>;
}
