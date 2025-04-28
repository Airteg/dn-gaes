import Link from "next/link";
import { getUserRole } from "@/utils/auth/getUserRole";

export default async function AdminLayout({ children }) {
  const role = await getUserRole();

  return (
    <div className="w-dvw mx-auto p-6 document-cardrounded shadow-md">
      <nav className="bg-[var(--card-bg)] w-full h-12 flex gap-4 mb-6 text-fuchsia-200">
        {(role === "moderator" || role === "admin") && (
          <>
            <Link href="/admin/documents">Документи</Link>
            <Link href="/admin/news">Новини</Link>
          </>
        )}
        {role === "admin" && <Link href="/admin/users">Користувачі</Link>}
      </nav>
      {children}
    </div>
  );
}
