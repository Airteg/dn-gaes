import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import clientPromise from "@/utils/db";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Неавторизовано" }, { status: 401 });
  }

  const { password } = await req.json();

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Пароль занадто короткий" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await users.updateOne(
    { email: session.user.email },
    {
      $set: { password: hashedPassword },
      $addToSet: { methods: "credentials" },
    },
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "Не вдалося оновити пароль" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Пароль успішно додано" });
}
