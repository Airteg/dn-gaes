import connectToDatabase from "@/utils/db";
import "../styles/globals.css";
import Menu from "../components/Menu.jsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.jsx";

export const metadata = {
  title: "Нижньодністровська ГЕС",
  description: "ПрАТ Нижньодністровська ГЕС",
};

export default async function RootLayout({ children }) {
  await connectToDatabase();
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <div>
            <Menu />
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
