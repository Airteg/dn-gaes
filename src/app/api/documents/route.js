import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // 🔹 Використовуємо `jose`
import clientPromise from "@/utils/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // 🔹 Ключ для верифікації

// 📌 Отримати всі документи (авторизовані бачать всі, гості – тільки `shareholdersOnly: false`)
export const GET = async (req) => {
  const client = await clientPromise;
  const db = client.db();

  // Перевіряємо, чи є токен
  const authHeader = req.headers.get("authorization");
  let user = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];

      // 🔹 Замість `jwt.verify()`, використовуємо `await jwtVerify()`
      const { payload } = await jwtVerify(token, secret);
      user = payload;

      console.log("✅ Авторизований користувач:", user);
    } catch (error) {
      console.error("❌ Невірний токен:", error);
    }
  }

  console.log("📌 Отримано запит до /api/documents");
  console.log("📌 Авторизація:", authHeader || "Гість");

  // Якщо користувач НЕ залогінений, показуємо тільки `shareholdersOnly: false`
  const filter = user ? {} : { shareholdersOnly: false };
  console.log("🚀 ~ filter:", filter);

  const documents = await db.collection("documents").find(filter).toArray();
  return NextResponse.json(documents);
};
