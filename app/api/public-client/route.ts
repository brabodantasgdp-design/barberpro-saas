import {NextResponse} from "next/server";
export async function POST(){
 return NextResponse.json(
  {error:"DEPRECATED_USE_PUBLIC_BOOKING"},
  {status:410}
 );
}
