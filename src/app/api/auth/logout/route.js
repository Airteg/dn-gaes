import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Вихід успішний" }, { status: 200 });
  // return NextResponse.redirect("/");
}
