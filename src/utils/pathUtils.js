export function getAbsolutePath(filePath) {
  if (!filePath) return "";

  const formattedPath = filePath.replace(/\\/g, "/"); // 🔥 Виправляємо слеші
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

  // 🔥 Просто додаємо `/storage/` без API
  const publicPath = formattedPath.replace(/^public\//, "");

  return `${baseUrl}/${publicPath}`;
}
