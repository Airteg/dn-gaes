import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  await connectToDatabase();
  const { token, newPassword } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

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
