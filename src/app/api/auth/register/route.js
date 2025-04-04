import { NextResponse } from "next/server";
import clientPromise from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Заповніть усі поля" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email уже зареєстровано" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({
    email,
    name,
    password: hashedPassword,
    role: "user",
    status: "active",
    authMethod: "credentials",
    methods: ["credentials"],
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Реєстрація успішна" }, { status: 200 });
}
