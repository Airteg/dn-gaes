import { NextResponse } from "next/server";
import clientPromise from "@/utils/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, password } = await req.json();

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Токен недійсний або прострочений" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetToken: "", resetTokenExpires: "" },
    },
  );

  return NextResponse.json({ message: "Пароль скинуто" }, { status: 200 });
}
