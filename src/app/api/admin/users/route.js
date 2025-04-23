import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUsers } from "@/utils/db/users";

export const GET = async (req) => {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const filter = searchParams.get("filter") ?? "";
  const showDeleted = searchParams.get("showDeleted") === "true";

  const filterObj = filter
    ? {
        $or: [
          { email: { $regex: filter, $options: "i" } },
          { name: { $regex: filter, $options: "i" } },
        ],
      }
    : {};

  const { users, total } = await getUsers({
    filter: filterObj,
    skip: (page - 1) * 10,
    limit: 10,
    showDeleted,
  });

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

  return NextResponse.json({ users: serializedUsers, total });
};
