import { NextResponse } from "next/server";
import { auth } from "@/auth"; // ⚡ підключаємо next-auth v5

export function authMiddleware(handler, requiredRole = null) {
  return async (req) => {
    const session = await auth(); // ⚡ отримуємо сесію
    const user = session?.user;

    if (!user) {
      console.error("❌ Неавторизований доступ");
      return NextResponse.json(
        { error: "Неавторизований доступ" },
        { status: 401 },
      );
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        console.error("❌ Недостатньо прав:", user.role);
        return NextResponse.json(
          { error: "Недостатньо прав" },
          { status: 403 },
        );
      }
    }

    req.user = user;
    return handler(req);
  };
}
