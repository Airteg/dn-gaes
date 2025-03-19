import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      // 🔹 Якщо токена немає, доступ заборонено
      if (!token) return false;

      // 🔹 Блокуємо доступ до адмін-панелі для гостей і "pending" користувачів
      if (pathname.startsWith("/admin") && token.status !== "active") {
        return false;
      }

      return true; // ✅ Доступ дозволено
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // 🔹 Захищені маршрути
};
