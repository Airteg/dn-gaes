"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Завантаження...</p>;
  if (!session) return <p>Увійдіть, щоб побачити кабінет</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100/10 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Кабінет користувача
        </h1>
        <div className="space-y-2 text-sm text-gray-800">
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
        </div>
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
