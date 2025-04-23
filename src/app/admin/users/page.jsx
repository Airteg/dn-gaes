"use client";

import { useSearchParams, useRouter } from "next/navigation";
import UsersTable from "@/components/admin/users/UsersTable.jsx";
import { useUsers } from "@/hooks/useUsers";

// Користувач відкриває сторінку /admin/users
// Компонент UsersPage запускається
export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const filter = searchParams.get("filter") || "";
  const showDeleted = searchParams.get("showDeleted") === "true";

  // Використовує useSearchParams для отримання параметрів запиту з URL
  // Використовує useRouter для навігації між сторінками
  // Викликає хук useUsers, який викликає fetchWithAuth
  // і повертає дані, статус завантаження та помилку
  const { data, isLoading, error } = useUsers({ filter, showDeleted, page });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>❌ Помилка: {error.message}</p>;
  console.log("📡 ~ UsersPage: data.users", data.users);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Керування користувачами</h1>
      <UsersTable
        users={data.users}
        total={data.total}
        page={page}
        filter={filter}
        showDeleted={showDeleted}
      />
    </div>
  );
}
