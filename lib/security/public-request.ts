import {cleanText,normalizePhone} from "./input";

export function parsePublicClient(input:any){
 const name=cleanText(input?.name,100);
 const phone=normalizePhone(input?.phone);
 const email=cleanText(input?.email,160).toLowerCase();
 if(name.length<2) return {ok:false as const,error:"INVALID_NAME"};
 if(phone.length<10) return {ok:false as const,error:"INVALID_PHONE"};
 if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  return {ok:false as const,error:"INVALID_EMAIL"};
 return {ok:true as const,value:{name,phone,email:email||null}};
}

/*
Rate limiting hook:
Use an external/shared store in production (Upstash Redis, managed Redis, etc.).
Do NOT implement in-memory counters in Vercel Functions because instances are ephemeral.
*/
