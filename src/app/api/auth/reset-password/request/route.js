import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // 🔹 Використовуємо jose для генерації токена
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // 🔹 Готуємо секретний ключ

export async function POST(req) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Користувач не знайдений" },
      { status: 404 },
    );
  }

  // 🔹 Генеруємо токен для відновлення пароля (дійсний 1 годину)
  const resetToken = await new SignJWT({ id: user._id.toString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  // Зберігаємо токен у базі
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 година
  await user.save();

  // Використовуємо BASE_URL з .env
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  console.log(`🔗 Посилання для відновлення пароля: ${resetLink}`);

  return NextResponse.json({
    message: "Перевірте email для відновлення пароля",
    resetLink,
  });
}
