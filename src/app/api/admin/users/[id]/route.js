import { auth } from "@/auth";
import { connectToDatabase } from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const params = await context.params;
    const id = params.id;
    const data = await req.json();

    if (data.name === "") {
      delete data.name;
    }

    await connectToDatabase();
    const result = await User.findByIdAndUpdate(id, data, { new: true });

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const params = await context.params;
    const id = params.id;

    await connectToDatabase();
    const result = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User marked as deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
