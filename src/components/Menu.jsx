import { auth } from "@/auth";
import Image from "next/image.js";
import Link from "next/link";
import ButtonLogout from "./ButtonLogout.jsx";

export default async function Menu() {
  const session = await auth();
  const user = session?.user;
  console.log("🚀 ~ user:", session?.user);

  const linkClasses = (pathname, href) =>
    `block mx-1 py-2 px-4 ${
      pathname === href
        ? "bg-gray-700 text-yellow-300"
        : "hover:bg-gray-700 md:hover:bg-transparent"
    }`;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">ДНІСТРОВСЬКА ГАЕС</div>
        <div className="md:flex md:space-x-4 justify-around md:w-auto">
          <Link href="/" className={linkClasses("/", "/")}>
            Головна
          </Link>
          <Link href="/news" className={linkClasses("/news", "/news")}>
            Новини
          </Link>
          <Link
            href="/documents"
            className={linkClasses("/documents", "/documents")}
          >
            Документи
          </Link>
          <Link
            href="/contacts"
            className={linkClasses("/contacts", "/contacts")}
          >
            Контакти
          </Link>
          {/* {user && (user.role === "admin" || user.role === "moderator") && ( */}
          <Link href="/admin" className={linkClasses("/admin", "/admin")}>
            Адміністрування
          </Link>
          {/* // )} */}
        </div>
        <div>
          {user ? (
            <div>
              {user.image && (
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt={user.name ?? "Avatar"}
                  style={{
                    borderRadius: "50%",
                  }}
                />
              )}
              <Link href="/dashboard">
                {user.name} ({user.role})
              </Link>

              <ButtonLogout />
            </div>
          ) : (
            <Link href="/login" className="hover:underline">
              Увійти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
