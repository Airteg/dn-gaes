export default async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // console.log("🔍 fetchWithAuth-> Відправлення запиту:", url, options);
  // console.log("📦 Дані, що надсилаються:", JSON.parse(options.body));
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
