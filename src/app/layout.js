import "../styles/globals.css";
import Menu from "../components/Menu";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata = {
  title: "Нижньодністровська ГЕС",
  description: "ПрАТ Нижньодністровська ГЕС",
  keywords: "Нижньодністровська ГЕС, гідроелектростанція, енергетика",
  openGraph: {
    title: "Нижньодністровська ГЕС",
    description: "ПрАТ Нижньодністровська ГЕС",
    url: "https://your-domain.com",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen min-w-screen overflow-hidden">
            <Menu />
            <main className="min-w-full flex flex-1 justify-center mx-auto p-0 overflow-hidden">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
