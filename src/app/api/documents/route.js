import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { authMiddleware } from "@/middleware/authMiddleware";
import connectToDatabase from "@/utils/db";
import Document from "@/models/Document";

// 📌 Отримати всі документи (авторизовані бачать всі, гості – тільки `shareholdersOnly: false`)
export const GET = async (req) => {
  await connectToDatabase();

  // Перевіряємо, чи є токен
  const authHeader = req.headers.get("authorization");
  let user = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
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

  const documents = await Document.find(filter);
  return NextResponse.json(documents);
};

// 📌 Додати новий документ (тільки для модераторів та адміністраторів)
export const POST = authMiddleware(
  async (req) => {
    await connectToDatabase();
    const body = await req.json();

    const newDocument = new Document({
      title: body.title,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory || "",
      filePath: body.filePath,
      uploadedBy: body.uploadedBy,
      isArchived: false,
      isDeleted: false,
      shareholdersOnly: body.shareholdersOnly || false,
    });

    await newDocument.save();
    return NextResponse.json({ message: "Документ додано" }, { status: 201 });
  },
  ["moderator", "admin"],
);

// 📌 Видалити документ (помітити як `isDeleted: true`, тільки адміністратор)
export const DELETE = authMiddleware(
  async (req) => {
    await connectToDatabase();
    const { id } = await req.json();

    const document = await Document.findById(id);
    if (!document)
      return NextResponse.json(
        { error: "Документ не знайдено" },
        { status: 404 },
      );

    document.isDeleted = true;
    await document.save();

    return NextResponse.json({
      message: "Документ видалено (isDeleted: true)",
    });
  },
  ["moderator", "admin"],
);
