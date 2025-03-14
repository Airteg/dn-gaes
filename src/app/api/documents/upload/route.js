import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "Файл не вибрано" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "documents");
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Перевіряємо, чи існує тека documents, якщо ні – створюємо її
    await fs.mkdir(uploadDir, { recursive: true });

    await fs.writeFile(filePath, buffer);
    return NextResponse.json({
      message: "Файл завантажено",
      filePath: `/documents/${fileName}`,
    });
  } catch (error) {
    console.error("Помилка запису файлу:", error);
    return NextResponse.json(
      { error: "Не вдалося зберегти файл" },
      { status: 500 },
    );
  }
}
