import { getCurrentMembership } from "@/lib/auth";
import { ServicesManager } from "@/components/services/ServicesManager";

export default async function Servicos(){
 const {supabase,membership}=await getCurrentMembership();
 if(!membership) return <div>Sem barbearia vinculada.</div>;
 const {data}=await supabase.from("services").select("*").eq("shop_id",membership.shop_id).order("name");
 return <ServicesManager shopId={membership.shop_id} initial={(data??[]) as any}/>;
}
