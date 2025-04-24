"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const base = "block mx-1 py-2 px-3 transition";
  const active = "button-gradient shadow-sm text-[var(--link-color-active)]";
  const inactive =
    "text-[var(--link-color)] hover:text-[var(--link-hover)] hover:underline";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive}`}
    >
      {children}
    </Link>
  );
}
