"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

type NavItem={icon:string;label:string;href:string};

export function ActiveNav({items}:{items:NavItem[]}){
 const pathname=usePathname();
 return <nav className="nav premiumNav">
  {items.map(item=>{
   const active=pathname===item.href || (item.href!=="/dashboard" && pathname.startsWith(`${item.href}/`));
   return <Link className={active?"active":""} href={item.href} key={item.href}><i>{item.icon}</i>{item.label}</Link>;
  })}
 </nav>;
}
