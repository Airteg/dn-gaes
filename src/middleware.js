import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/admin", "/dashboard"];
const adminRoutes = ["/admin"];
const restrictedAdminRoutes = ["/admin/users"];

export default async function middleware(req) {
  // Отримуємо токен із детальнішим логуванням
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "__Secure-authjs.session-token", // Явно вказуємо ім'я cookie
    secureCookie: true, // Вказуємо, що це secure cookie (для HTTPS)
  });
  const { pathname } = req.nextUrl;

  // Логуємо деталі для діагностики
  console.log("🚀 ~ Middleware details:", {
    pathname,
    token, // Логуємо токен (або null, якщо його немає)
    cookies: req.cookies.getAll(), // Логуємо всі cookies, які приходять із запитом
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set", // Перевіряємо, чи є NEXTAUTH_SECRET
    cookieName: "__Secure-authjs.session-token", // Підтверджуємо ім'я cookie
  });

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isRestrictedAdminRoute = restrictedAdminRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Гість — на логін
  if (isProtectedRoute && !token) {
    console.log("No token, redirecting to /login from:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Якщо є токен
  if (token) {
    // Вважаємо undefined як "user"
    const role = token.role || "user";
    console.log("🚀 ~ Effective role:", role);

    // Блокуємо /admin для "user" (включаючи undefined)
    if (isAdminRoute && role === "user") {
      console.log("Access denied for user:", { email: token.email, role });
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Блокуємо /admin/users для "moderator"
    if (isRestrictedAdminRoute && role === "moderator") {
      console.log("Access denied for moderator:", { email: token.email, role });
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin", "/api/auth/session"],
};
