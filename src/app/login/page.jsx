"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputClass =
    "w-full mt-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/", // Перенаправлення на головну після входу
      redirect: true,
      // Щоб побачити результат у консолі, якщо щось не так,
      // redirect: false,
    });
    // ... і розкоментувати код нижче
    // if (result?.error) {
    //   console.log("Login failed:", result.error);
    // } else if (result?.ok) {
    //   console.log("Login successful:", result);
    //   window.location.href = result.url; // 🔁 вручну перенаправляємо
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100/10 px-4">
      <div className="w-full max-w-md bg-white/10 p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вхід</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Увійти через Google
        </button>

        <div className="mt-4 text-sm text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Забули пароль?
          </a>
        </div>
        <div className="mt-2 text-sm text-center">
          Немає акаунту?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Зареєструватися
          </a>
        </div>
      </div>
    </div>
  );
}
