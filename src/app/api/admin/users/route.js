import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUsers } from "@/utils/db/users";

export const GET = async (req) => {
  // Перевірка авторизації:
  // ⛔ Забороняє доступ, якщо користувач не авторизований або не admin.
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Отримання параметрів з URL:
  // Витягує page, filter, showDeleted з URL, наприклад:
  // /api/admin/users?page=1&filter=Anna&showDeleted=false
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const filter = searchParams.get("filter") ?? "";
  const showDeleted = searchParams.get("showDeleted") === "true";

  // 🔍 Побудова фільтра для MongoDB:
  // Якщо є filter=Anna, шукає email або name, що містить "Anna" (нечутливо до регістру).
  const filterObj = filter
    ? {
        $or: [
          { email: { $regex: filter, $options: "i" } },
          { name: { $regex: filter, $options: "i" } },
        ],
      }
    : {};

  // 📦 Отримання користувачів:
  // Викликає getUsers з параметрами: filterObj, skip, limit, showDeleted.
  const { users, total } = await getUsers({
    filter: filterObj,
    skip: (page - 1) * 10,
    limit: 10,
    showDeleted,
  });

  // 🧼 Серіалізація користувачів:
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
  // console.log("🔍 Серіалізовані:", serializedUsers);

  // ✅ Повернення результату:
  // Повертає JSON з масивом користувачів та загальною кількістю.
  // Використовує NextResponse.json для формування відповіді.
  return NextResponse.json({ users: serializedUsers, total });
};
