import { auth } from "@/auth";
import { updateUser, markUserAsDeleted } from "@/utils/db/users";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const params = await context.params; // Очікуємо проміс
    const id = params.id;
    const data = await req.json();
    // console.log("PUT /api/admin/users/[id] called with id:", id, "data:", data);
    // Захист від порожнього name
    if (data.name === "") {
      delete data.name;
    }
    const result = await updateUser(id, data);
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const params = await context.params; // Очікуємо проміс
    const id = params.id;
    // console.log("DELETE /api/admin/users/[id] called with id:", id);
    const result = await markUserAsDeleted(id);
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User marked as deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
