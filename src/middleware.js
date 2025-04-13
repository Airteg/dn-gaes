import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/admin", "/dashboard"];
const adminRoutes = ["/admin"];
const restrictedAdminRoutes = ["/admin/users"];

export default async function middleware(req) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  console.log("🌍 NODE_ENV середовище:", process.env.NODE_ENV);
  // Отримуємо токен із детальнішим логуванням
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName, // Ім'я cookie для токена
    secureCookie: true, // Вказуємо, що це secure cookie (для HTTPS)
  });
  const { pathname } = req.nextUrl;

  // Логуємо деталі для діагностики
  console.log("🛡️ Деталі middleware:", {
    pathname,
    token, // Логуємо токен (або null, якщо його немає)
    cookies: req.cookies.getAll(), // Усі cookies із запиту
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
    cookieName: "__Secure-authjs.session-token",
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
    console.log("🚫 Немає токена, перенаправлення на /login з:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Якщо є токен
  if (token) {
    // Вважаємо undefined як "user"
    const role = token.role || "user";
    console.log("🧑‍⚖️ Ефективна роль користувача:", role);

    // Блокуємо /admin для "user" (включаючи undefined)
    if (isAdminRoute && role === "user") {
      console.log("⛔ Доступ заборонено для користувача:", {
        email: token.email,
        role,
      });
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Блокуємо /admin/users для "moderator"
    if (isRestrictedAdminRoute && role === "moderator") {
      console.log("🚫 Доступ заборонено для модератора:", {
        email: token.email,
        role,
      });
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin", "/api/auth/session"],
};
