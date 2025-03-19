import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // 🔹 Використовуємо `jose` для перевірки токена
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // 🔹 Ключ для верифікації

export async function POST(req) {
  await connectToDatabase();
  const { token, newPassword } = await req.json();

  try {
    // 🔹 Перевіряємо токен через `jose`
    const { payload } = await jwtVerify(token, secret);
    const user = await User.findById(payload.id);

    if (
      !user ||
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return NextResponse.json(
        { error: "Недійсний або прострочений токен" },
        { status: 400 },
      );
    }

    // Хешуємо новий пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Видаляємо токен після зміни пароля
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: "Пароль успішно змінено" });
  } catch (error) {
    return NextResponse.json({ error: "Недійсний токен" }, { status: 400 });
  }
}
