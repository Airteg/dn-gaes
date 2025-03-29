import { NextResponse } from "next/server.js";
import { auth } from "@/auth";

const protectedRoutes = ["/admin", "/dashboard"];

export default async function middleware(req) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const user = session?.user;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
