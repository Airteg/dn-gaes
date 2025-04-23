import { getSession } from "next-auth/react";

export default async function fetchWithAuth(url, options = {}) {
  const session = await getSession();
  const token = session?.token || session?.user?.token;

  if (!token) {
    console.warn("⚠️ Токен не знайдено в сесії");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Помилка запиту:", {
      status: response.status,
      statusText: response.statusText,
      response: text,
    });
    throw new Error("Не вдалося завантажити дані");
  }

  return response.json();
}
