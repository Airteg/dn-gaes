"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/app/providers/AuthProvider";

const Menu = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setForceUpdate((prev) => prev + 1); // Примусовий ререндер після логіну
  }, [user]);

  useEffect(() => {
    setIsOpen(false); // Закриваємо меню при зміні маршруту
  }, [pathname]);

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const linkClasses = (href) =>
    `block py-2 px-4 ${
      pathname === href
        ? "bg-gray-700 text-yellow-300"
        : "hover:bg-gray-700 md:hover:bg-transparent"
    }`;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">ДНІСТРОВСЬКА ГАЕС</div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="focus:outline-none text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
        <div
          className={`absolute top-16 left-0 w-full bg-gray-800 md:static md:w-auto md:flex md:space-x-4 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link href="/" className={linkClasses("/")}>
            Головна
          </Link>
          <Link href="/news" className={linkClasses("/news")}>
            Новини
          </Link>
          <Link href="/documents" className={linkClasses("/documents")}>
            Документи
          </Link>
          <Link href="/contacts" className={linkClasses("/contacts")}>
            Контакти
          </Link>
          {isDesktop &&
            user &&
            (user.role === "admin" || user.role === "moderator") && (
              <Link href="/admin" className={linkClasses("/admin")}>
                Адміністрування
              </Link>
            )}
        </div>
        <div>
          {user ? (
            <div>
              {user.firstName} {user.lastName} ({user.role})
              <button
                onClick={logout}
                className="ml-4 bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              >
                Вийти
              </button>
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
};

export default Menu;
