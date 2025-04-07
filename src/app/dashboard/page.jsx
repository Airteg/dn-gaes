"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  if (status === "loading") return <p>Завантаження...</p>;
  if (!session) return <p>Увійдіть, щоб побачити кабінет</p>;
  const handleAddPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    try {
      const res = await fetch("/api/auth/add-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Помилка");

      alert("✅ Пароль додано успішно");
      setShowAddPassword(false);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100/10 px-4">
      <div className="w-full max-w-md bg-white/30 p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Кабінет користувача
        </h1>
        <div className="space-y-2 text-sm text-[color:var(--text-color)]">
          <p>
            <span className="font-semibold">ID:</span> {session.user.id}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="font-semibold">Ім’я:</span> {session.user.name}
          </p>
          <p>
            <span className="font-semibold">Роль:</span> {session.user.role}
          </p>
          <p>
            <span className="font-semibold">Статус:</span> {session.user.status}
          </p>
          <p>
            <span className="font-semibold">Методи входу:</span>{" "}
            {session.user.methods?.join(", ") || "немає даних"}
          </p>
        </div>
        {showAddPassword && (
          <form
            onSubmit={handleAddPassword}
            className="mt-4 space-y-3 text-sm text-gray-800"
          >
            <input
              type="password"
              placeholder="Новий пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Підтвердіть пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Зберегти пароль
            </button>
          </form>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Вийти
        </button>
      </div>
    </div>
  );
}
