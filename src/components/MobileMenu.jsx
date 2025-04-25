"use client";

import { useState } from "react";
import NavLink from "./ui/NavLink";
import ThemeToggleButton from "./ThemeToggleButton";
import UserSection from "./UserSection";

export default function MobileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 300); // тривалість анімації
  };

  if (!open && !closing) {
    return (
      <div className="flex items-center justify-between  xl:hidden">
        <button
          onClick={() => setOpen(true)}
          className="block xl:hidden ml-4"
          aria-label="Відкрити меню"
        >
          <svg
            className="w-6 h-6"
            stroke="var(--foreground)"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="grow-1 px-4 text-sm xl:text-base 2xl:text-lg mr-2 font-bold">
          <h4 className="text-[var(--t-color)]">Нижньодністровська ГЕС</h4>
        </div>
        <ThemeToggleButton />
      </div>
    );
  }

  return (
    <div
      className={`
        ${closing ? "slide-left" : "slide-right"}
        z-50 absolute top-0 left-0 w-full h-screen menu-gradient p-6
        text-[var(--foreground)] flex flex-col gap-6
      `}
    >
      <div className="flex justify-start items-center border-b border-[var(--foreground)] pb-4">
        <div className="text-sm xl:text-base 2xl:text-lg mr-2 font-bold">
          <h4 className="text-[var(--t-color)]">Нижньодністровська ГЕС</h4>
        </div>
      </div>

      <UserSection user={user} onClose={handleClose} />

      <div className="flex flex-col gap-2 border-t border-[var(--foreground)]">
        <NavLink href="/" onClick={handleClose}>
          <span>Головна</span>
        </NavLink>
        <NavLink href="/news" onClick={handleClose}>
          <span>Про нас</span>
        </NavLink>
        <NavLink href="/documents" onClick={handleClose}>
          <span>Документи</span>
        </NavLink>
        <NavLink href="/contacts" onClick={handleClose}>
          <span>Контакти</span>
        </NavLink>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-2xl text-[var(--foreground)] p-2"
        aria-label="Закрити меню"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
