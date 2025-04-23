import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/utils/db";
import Document from "@/models/Document";

export const GET = async (req) => {
  const session = await auth();
  await connectToDatabase();

  const user = session?.user || null;

  const filter = user ? {} : { shareholdersOnly: false };

  const documents = await Document.find(filter).populate(
    "uploadedBy",
    "name email",
  );
  return NextResponse.json(documents);
};

export const POST = async (req) => {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();

  try {
    const data = await req.json();
    const document = new Document({
      ...data,
      uploadedBy: session.user.id,
    });
    await document.save();

    return NextResponse.json({ message: "Документ додано" }, { status: 201 });
  } catch (error) {
    console.error("❌ Помилка додавання документа:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const session = await auth();
  if (!session?.user || !["admin", "moderator"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();

  try {
    const id = params.id;
    const data = await req.json();

    const result = await Document.findByIdAndUpdate(id, data, { new: true });

    if (!result) {
      return NextResponse.json(
        { error: "Документ не знайдено" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Документ оновлено" });
  } catch (error) {
    console.error("❌ Помилка оновлення документа:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
};
