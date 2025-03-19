import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // 🔹 Використовуємо jose для перевірки токена

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // 🔹 Готуємо секретний ключ

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
      // 🔹 Перевіряємо токен через `jose`
      const { payload } = await jwtVerify(token, secret);
      console.log("✅ Токен дійсний, користувач:", payload);

      req.user = payload; // 🔹 Тепер req містить `user`

      if (requiredRole) {
        const roles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];
        if (!roles.includes(payload.role)) {
          console.error("❌ Недостатньо прав:", payload.role);
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
