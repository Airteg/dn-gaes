"use client";

import Image from "next/image";
import { useState } from "react";
import NavLink from "./ui/NavLink";
import ThemeToggleButton from "./ThemeToggleButton";
import ButtonLogout from "./ButtonLogout";

export default function MobileMenu({ user }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block min-[1480px]:hidden ml-4"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-[var(--background)]/95 z-50 p-6 text-[var(--foreground)] flex flex-col gap-6">
      {/* Верхній блок */}
      <div className="flex justify-between items-center border-b border-[var(--foreground)] pb-4">
        <div className="text-center leading-5">
          <h5>ПрАТ</h5>
          <h5>Нижньодністровська</h5>
          <h5>ГЕС</h5>
        </div>
        <ThemeToggleButton />
      </div>

      {/* Блок юзера */}
      <div className="flex items-center gap-3 border-b border-[var(--foreground)] pb-4">
        {user?.image && (
          <Image
            src={user.image}
            width={40}
            height={40}
            alt={user.name ?? "Avatar"}
            style={{ borderRadius: "50%" }}
          />
        )}
        <div className="flex flex-col">
          {user ? (
            <>
              <NavLink href="/dashboard">
                <p>{user.name}</p>
                <p>({user.role})</p>
              </NavLink>
              <ButtonLogout />
            </>
          ) : (
            <NavLink href="/login">Увійти</NavLink>
          )}
        </div>
      </div>

      {/* Навігація */}
      <div className="flex flex-col gap-2">
        <NavLink href="/">Головна</NavLink>
        <NavLink href="/news">Новини</NavLink>
        <NavLink href="/documents">Документи</NavLink>
        <NavLink href="/contacts">Контакти</NavLink>
        <NavLink href="/admin">Адміністрування</NavLink>
      </div>

      {/* Закрити */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-2xl text-[var(--foreground)]"
        aria-label="Закрити меню"
      >
        ✖
      </button>
    </div>
  );
}
