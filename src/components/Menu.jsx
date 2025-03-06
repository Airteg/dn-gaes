"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchUser = () => {
      const token = localStorage.getItem("token");
      // console.log("📌 Отриманий токен у Menu:", token);

      if (!token) {
        setUser(null);
        return;
      }

      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("📌 Дані користувача у Menu:", data);
          if (!data.error) setUser(data);
        })
        .catch((err) => console.error("❌ Помилка запиту у Menu:", err));
    };

    fetchUser();
    window.addEventListener("storage", fetchUser); // Відслідковуємо зміни

    return () => window.removeEventListener("storage", fetchUser); // Очищення
  }, []);

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
          {/* {user ? `${user.firstName} ${user.lastName} (${user.role})` : "Гість"} */}
          {user ? (
            <div>
              {user.firstName} {user.lastName} ({user.role})
              <button
                onClick={handleLogout}
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
