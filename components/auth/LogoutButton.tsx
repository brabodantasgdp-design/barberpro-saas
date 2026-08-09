import {signOut} from "@/app/logout/actions";
export function LogoutButton({compact=false}:{compact?:boolean}){
 return <form action={signOut}><button className={compact?"mobileLogout":"logoutButton"} type="submit">↪ <span>Sair do sistema</span></button></form>;
}
