import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const {
      email,
      password,
      firstName,
      lastName,
      nickname,
      position,
      placeOfWork,
    } = await req.json();

    // 🔹 Перевірка, чи існує користувач
    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "Користувач із таким email або nickname вже існує" },
        { status: 400 },
      );
    }

    // 🔹 Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Створення нового користувача зі статусом "pending"
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
      position,
      placeOfWork,
      role: "user",
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Реєстрація успішна! Очікуйте підтвердження адміністратора.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
