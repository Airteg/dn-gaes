import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/users/UsersTable";
import { getUsers } from "@/utils/db/users";

export default async function UsersPage({ searchParams: searchParamsPromise }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  // Очікуємо розв’язання промісу
  const searchParams = await searchParamsPromise;
  // console.log("searchParams resolved:", searchParams);

  // Безпечний доступ до параметрів
  const page = Number(searchParams?.page ?? 1);
  const filter = searchParams?.filter ?? "";
  const showDeleted = searchParams?.showDeleted === "true";

  const { users, total } = await getUsers({
    page,
    limit: 10,
    filter,
    showDeleted,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Керування користувачами</h1>
      <UsersTable
        users={users}
        total={total}
        page={page}
        filter={filter}
        showDeleted={showDeleted}
      />
    </div>
  );
}
