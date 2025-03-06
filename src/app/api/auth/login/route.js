import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    // Перевіряємо, чи є такий користувач
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Невірний email або пароль" },
        { status: 401 },
      );
    }

    // Перевіряємо, чи користувач підтверджений адміном
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Ваш акаунт ще не активовано" },
        { status: 403 },
      );
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Невірний email або пароль" },
        { status: 401 },
      );
    }

    // Генеруємо JWT токен
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Термін дії токена 7 днів
    );

    return NextResponse.json(
      { token, message: "Вхід успішний" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Помилка входу:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
