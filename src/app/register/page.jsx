"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full mt-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Помилка реєстрації");

      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex self-center items-center justify-center bg-gray-100/10 p-4">
      <div className="w-full max-w-md bg-white/10 p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Реєстрація</h1>
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше ім’я"
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Підтвердження пароля"
            required
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Завантаження..." : "Зареєструватись"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Зареєструватись за допомогою Google
        </button>

        <div className="mt-4 text-sm text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Забули пароль?
          </a>
        </div>
        <div className="mt-2 text-sm text-center">
          Уже є акаунт?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Увійти
          </a>
        </div>
      </div>
    </div>
  );
}
