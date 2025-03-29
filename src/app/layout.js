import "../styles/globals.css";
import Menu from "../components/Menu";

export const metadata = {
  title: "Нижньодністровська ГЕС",
  description: "ПрАТ Нижньодністровська ГЕС",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <Menu />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
