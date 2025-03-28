import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/utils/db";

export const GET = async (req) => {
  const session = await auth(); // 🔹 Отримаємо сесію з next-auth
  const client = await clientPromise;
  const db = client.db();

  const user = session?.user || null;

  const filter = user ? {} : { shareholdersOnly: false };

  const documents = await db.collection("documents").find(filter).toArray();
  return NextResponse.json(documents);
};
