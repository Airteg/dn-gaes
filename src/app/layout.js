import "../styles/globals.css";
import Menu from "../components/Menu";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata = {
  title: "Нижньодністровська ГЕС",
  description: "ПрАТ Нижньодністровська ГЕС",
  keywords: "Нижньодністровська ГЕС, гідроелектростанція, енергетика", // Додано ключові слова
  openGraph: {
    title: "Нижньодністровська ГЕС",
    description: "ПрАТ Нижньодністровська ГЕС",
    url: "https://your-domain.com", // Замініть на ваш домен
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        {/* Next.js автоматично додасть title і meta з metadata, але можна вручну для точності */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          <div>
            <Menu />
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
