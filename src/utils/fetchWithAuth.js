export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  console.log(`📤 Відправка запиту: ${url}`, options); // Лог запиту

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    console.error(
      `❌ Помилка запиту: ${response.status} ${response.statusText}`,
    );
  }
  console.log("📌 fetchWithAuth response:", response); // ДОДАЙ ЦЕ
  return response.json();
}
// Compare this snippet from src/app/api/auth/login.js:
