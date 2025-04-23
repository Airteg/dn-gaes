"use client";

import { useSearchParams, useRouter } from "next/navigation";
import UsersTable from "@/components/admin/users/UsersTable.jsx";
import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const filter = searchParams.get("filter") || "";
  const showDeleted = searchParams.get("showDeleted") === "true";

  const { data, isLoading, error } = useUsers({ filter, showDeleted, page });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>❌ Помилка: {error.message}</p>;

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
