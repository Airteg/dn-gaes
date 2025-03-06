import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function authMiddleware(handler, requiredRole = null) {
  return async (req) => {
    console.log("📌 Отримані заголовки:", req.headers.get("authorization"));

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ Токен не передано або некоректний!");
      return NextResponse.json(
        { error: "Неавторизований доступ" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Токен дійсний, користувач:", decoded);
      req.user = decoded;

      if (requiredRole) {
        const roles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];
        if (!roles.includes(decoded.role)) {
          console.error("❌ Недостатньо прав:", decoded.role);
          return NextResponse.json(
            { error: "Недостатньо прав" },
            { status: 403 },
          );
        }
      }

      return handler(req);
    } catch (error) {
      console.error("❌ Токен недійсний або прострочений!", error);
      return NextResponse.json(
        { error: "Невірний або прострочений токен" },
        { status: 401 },
      );
    }
  };
}
