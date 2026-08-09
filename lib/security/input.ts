export function cleanText(value:unknown,max=200){
 if(typeof value!=="string")return "";
 return value.trim().replace(/[\u0000-\u001F\u007F]/g,"").slice(0,max);
}
export function normalizePhone(value:unknown){
 if(typeof value!=="string")return "";
 return value.replace(/\D/g,"").slice(0,15);
}
export function validSlug(value:string){
 return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)&&value.length<=60;
}
