import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/users/UsersTable";

export default async function UsersPage({ searchParams: searchParamsPromise }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const searchParams = await searchParamsPromise;
  const page = Number(searchParams?.page ?? 1);
  const filter = searchParams?.filter ?? "";
  const showDeleted = searchParams?.showDeleted === "true";

  // Використовуємо відносний URL, який працює і на локалі, і на продакшені
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/admin/users?page=${page}&filter=${encodeURIComponent(filter)}&showDeleted=${showDeleted}`,
    { cache: "no-store" },
  );
  const { users = [], total = 0 } = await res.json();

  const serializedUsers = users.map((user) => ({
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt,
    nickname: user.nickname,
    position: user.position,
    placeOfWork: user.placeOfWork,
  }));

  console.log("🚀 ~ serializedUsers:", serializedUsers);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Керування користувачами</h1>
      <UsersTable
        users={serializedUsers}
        total={total}
        page={page}
        filter={filter}
        showDeleted={showDeleted}
      />
    </div>
  );
}
