import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import User from "@/models/User";
import connectToDatabase from "@/utils/db";

// 🔹 Отримати список користувачів (тільки для адмінів)
async function getUsers(req) {
  await connectToDatabase();

  const users = await User.find().select("-password"); // Вилучаємо поле пароля
  return NextResponse.json(users);
}

// 🔹 Оновити статус або роль користувача (тільки для адмінів)
async function updateUser(req) {
  await connectToDatabase();
  const { id, status, role } = await req.json();

  // Перевіряємо, чи користувач існує
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json(
      { error: "Користувач не знайдений" },
      { status: 404 },
    );
  }

  // Оновлюємо статус або роль, якщо передано
  if (status) user.status = status;
  if (role) user.role = role;

  await user.save();
  return NextResponse.json({ message: "Користувача оновлено" });
}

// 🔹 Видалити користувача (м'яке видалення)
async function deleteUser(req) {
  await connectToDatabase();
  const { id } = await req.json();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json(
      { error: "Користувач не знайдений" },
      { status: 404 },
    );
  }

  user.isDeleted = true; // Позначаємо як видаленого
  await user.save();

  return NextResponse.json({ message: "Користувача видалено" });
}

// 🛡 Додаємо захист для адмінів
export const GET = authMiddleware(getUsers, "admin");
export const PATCH = authMiddleware(updateUser, "admin");
export const DELETE = authMiddleware(deleteUser, "admin");
