import { NextResponse } from "next/server";
import clientPromise from "@/utils/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  const { email } = await req.json();

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json(
      { error: "Користувача не знайдено" },
      { status: 404 },
    );
  }

  const resetToken = Math.random().toString(36).slice(2); // Простий токен
  const expires = new Date(Date.now() + 3600000); // 1 година

  await db
    .collection("users")
    .updateOne({ email }, { $set: { resetToken, resetTokenExpires: expires } });

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Скидання пароля",
    text: `Перейдіть за посиланням для скидання пароля: ${resetLink}`,
  });

  return NextResponse.json({ message: "Email надіслано" }, { status: 200 });
}
