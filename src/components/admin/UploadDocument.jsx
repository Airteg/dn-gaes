"use client";

import { useState } from "react";

export default function UploadDocument({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка завантаження");

      onUpload(data.filePath); // Оновлюємо список документів
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input type="file" onChange={handleFileChange} className="border p-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        disabled={!file || uploading}
      >
        {uploading ? "Завантаження..." : "Завантажити"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
