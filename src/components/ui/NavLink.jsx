"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const base = "block mx-1 py-2 px-4 transition";
  const active =
    "bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium rounded-md shadow-sm";
  const inactive =
    "text-[var(--link-color)] hover:text-[var(--link-hover)] hover:underline";

  return (
    <Link href={href} className={`${base} ${isActive ? active : inactive}`}>
      {children}
    </Link>
  );
}
