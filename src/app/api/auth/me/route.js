import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import User from "@/models/User";
import connectToDatabase from "@/utils/db";

async function handler(req) {
  await connectToDatabase();
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return NextResponse.json(
      { error: "Користувач не знайдений" },
      { status: 404 },
    );
  }

  return NextResponse.json(user);
}

// Обгортка middleware
export const GET = authMiddleware(handler);
