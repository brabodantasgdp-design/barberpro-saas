type EnvName=
 |"NEXT_PUBLIC_SUPABASE_URL"
 |"NEXT_PUBLIC_SUPABASE_ANON_KEY"
 |"SUPABASE_SERVICE_ROLE_KEY";

export function env(name:EnvName){
 const value=process.env[name];
 if(!value) throw new Error(`Missing required environment variable: ${name}`);
 return value;
}

export function publicEnv(){
 return {
  supabaseUrl:env("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey:env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
 };
}
