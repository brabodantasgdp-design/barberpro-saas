import "./globals.css";
export const metadata = { title: "BarberPro", description: "Gestão e agendamento para barbearias" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
