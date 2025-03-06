import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();

  const users = await User.find({});
  return NextResponse.json({ users });
}
