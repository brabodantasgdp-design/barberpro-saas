import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request:NextRequest){
  const path=request.nextUrl.pathname;
  const protectedPath=/^\/(dashboard|agenda|equipe|clientes|onboarding|configuracoes|relatorios|servicos)(?:\/|$)/.test(path);
  const loginPath=path==="/login";

  // Public pages and API routes perform no session lookup here. Protected API
  // routes authenticate themselves, while protected pages are checked below.
  if(!protectedPath&&!loginPath)return NextResponse.next({request});

  const hasSessionCookie=request.cookies.getAll().some(({name})=>name.startsWith("sb-")&&name.includes("-auth-token"));
  if(!hasSessionCookie){
    if(loginPath)return NextResponse.next({request});
    const url=request.nextUrl.clone();
    url.pathname="/login";
    url.searchParams.set("next",path);
    return NextResponse.redirect(url);
  }

  let response=NextResponse.next({request});
  const supabase=createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        getAll(){return request.cookies.getAll();},
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]){
          cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
          response=NextResponse.next({request});
          cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
        }
      }
    }
  );

  const timeout=new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error("AUTH_TIMEOUT")),3000));
  let user=null;
  try{
    user=(await Promise.race([supabase.auth.getUser(),timeout])).data.user;
  }catch{
    // Fail closed: an unavailable Auth service never grants protected access.
  }
  if(loginPath&&user){
    const url=request.nextUrl.clone(); url.pathname="/dashboard"; return NextResponse.redirect(url);
  }
  if(protectedPath && !user){
    const url=request.nextUrl.clone();
    url.pathname="/login";
    url.searchParams.set("next",path);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config={
  matcher:["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
