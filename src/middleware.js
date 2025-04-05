import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/admin", "/dashboard"];

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // console.log("🚀 ~ Middleware token:", token);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  // console.log("🚀 ~ token.role:", token?.role);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
