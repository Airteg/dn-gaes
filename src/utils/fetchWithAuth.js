export default async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    console.error(
      `❌ Помилка запиту: ${response.status} ${response.statusText}`,
    );
    return null;
  }

  return response.json();
}

// export async function fetchWithAuth(url, options = {}) {
//   const token = localStorage.getItem("token");

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   console.log(`📤 Відправка запиту: ${url}`, options); // Лог запиту
//   console.log("🔑 Токен:", token);
//   const response = await fetch(url, {
//     ...options,
//     headers,
//     credentials: "include",
//   });

//   if (!response.ok) {
//     console.error(
//       `❌ Помилка запиту: ${response.status} ${response.statusText}`,
//     );
//   }
//   console.log("📌 fetchWithAuth response:", response); // ДОДАЙ ЦЕ
//   return response.json();
// }
