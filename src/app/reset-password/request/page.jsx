"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Для навігації

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    // http://localhost:3000/api/auth/reset-password/request
    const res = await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    console.log("📌 Відповідь сервера:", data); // Додаємо логування

    if (res.ok && data.resetLink && typeof data.resetLink === "string") {
      console.log("🔗 Перехід за посиланням:", data.resetLink);
      router.push(data.resetLink); // 🔥 Перенаправлення на сторінку відновлення пароля
    } else {
      setError(data.error || "Помилка під час запиту.");
    }
  };
  console.log("email", email);
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRequestReset}
        className="p-6 bg-white/20 shadow-md rounded-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4">Відновлення паролю</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Введіть email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Відправити запит
        </button>
      </form>
    </div>
  );
}
