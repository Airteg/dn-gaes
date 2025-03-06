import connectToDatabase from "@/utils/db";
import Document from "@/models/Document";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
  const { id } = await params; // ✅ Асинхронний доступ до params

  if (!id) {
    return NextResponse.json(
      { error: "Не передано ID документа" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  try {
    const updates = await req.json();
    const updatedDocument = await Document.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Документ не знайдено" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("❌ Помилка оновлення документа:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
};
