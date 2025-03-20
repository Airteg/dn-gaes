"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      setError(res.error || "Невідома помилка");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    console.log("📌 Вхід через Google ініційовано...");
    setLoading(true);
    await signIn("google");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white/20 shadow-md rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4">Вхід</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Вхід..." : "Увійти"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Увійти через Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/reset-password/request"
            className="text-blue-500 hover:underline"
          >
            Забули пароль?
          </a>
        </div>
        <div className="mt-2 text-center">
          <a href="/register" className="text-blue-500 hover:underline">
            Новий користувач? Зареєструватися
          </a>
        </div>
      </form>
    </div>
  );
}
