import { getSession } from "next-auth/react";

export default async function fetchWithAuth(url, options = {}) {
  // Автоматично додає токен авторизації до заголовків запиту
  // Перевіряємо, чи сесія активна
  const session = await getSession();
  const token = session?.token || session?.user?.token;

  if (!token) {
    console.warn("⚠️ Токен не знайдено в сесії");
  }
  // Додає заголовок Authorization: Bearer <token> до запиту, якщо токен існує
  // Якщо токен не знайдено, запит буде без заголовка Authorization
  // Це потрібно для доступу до захищених API, де сервер очікує токен.
  // Додає Content-Type: application/json до заголовків запиту
  // Це потрібно для того, щоб сервер знав, що ми відправляємо JSON-дані
  // Може додавати інші заголовки, якщо вони є в options.headers
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  // response.json() повертає Promise, тому потрібно використовувати await
  // Якщо не використовувати await, то response.json() поверне Promise, а не JSON-дані
  const response = await fetch(url, {
    ...options,
    headers,
  });
  // Кидає помилку, якщо response.ok === false
  // Це означає, що запит не вдався (наприклад, 404, 500)
  // Це зупиняє виконання react-query, і помилка потрапляє в error у компоненті.
  // Якщо не використовувати await, то response.ok буде undefined і помилка не буде кинута
  // Це потрібно для того, щоб react-query міг обробити помилку і показати її в компоненті

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Помилка запиту:", {
      status: response.status,
      statusText: response.statusText,
      response: text,
    });
    throw new Error("Не вдалося завантажити дані");
  }
  // Повертає тіло відповіді як JSON
  return response.json();
}
