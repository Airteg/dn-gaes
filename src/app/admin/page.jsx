"use client";

import { useState, useEffect } from "react";
import UploadDocument from "@/components/admin/UploadDocument";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({ category: "", isArchived: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isArchived: false,
    onlyForShareholders: false,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const data = await fetchWithAuth("/api/documents");
    setDocuments(data);
  };

  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    const sortedDocs = [...documents].sort((a, b) => {
      if (a[field] < b[field]) return newOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
    setDocuments(sortedDocs);
  };

  const handleUpdate = async (id, field, value) => {
    console.log(`🔄 Оновлення документа ${id}: ${field} ->`, value);

    const response = await fetchWithAuth(`/api/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ [field]: value }),
    });

    console.log("📌 response:", response); // Переконуємось, що response вже JSON

    if (response.error) {
      // Якщо сервер повернув { error: "Помилка" }
      console.error("❌ Помилка оновлення документа:", response.error);
      return;
    }

    console.log("✅ Документ успішно оновлено!");
    fetchDocuments();
  };

  const handleAddDocument = async () => {
    console.log("📤 Відправка нового документа:", newDocument);
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDocument),
    });
    if (!response.ok) {
      console.error(
        "❌ Помилка при додаванні документа:",
        await response.text(),
      );
      return;
    }
    fetchDocuments();
    setIsAdding(false);
    setNewDocument({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      isArchived: false,
      onlyForShareholders: false,
    });
  };

  const filteredDocs = documents.filter(
    (doc) =>
      (!filters.category || doc.category === filters.category) &&
      (filters.isArchived === null || doc.isArchived === filters.isArchived) &&
      ((doc.title &&
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()))),
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Адміністрування документів
      </h1>

      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Додати документ
      </button>

      {isAdding && (
        <div className="p-4 border border-gray-300 mb-4">
          <h2 className="text-lg font-bold mb-2">Новий документ</h2>
          <input
            type="text"
            placeholder="Назва"
            value={newDocument.title}
            onChange={(e) =>
              setNewDocument({ ...newDocument, title: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Опис"
            value={newDocument.description}
            onChange={(e) =>
              setNewDocument({ ...newDocument, description: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Категорія"
            value={newDocument.category}
            onChange={(e) =>
              setNewDocument({ ...newDocument, category: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Підкатегорія"
            value={newDocument.subcategory}
            onChange={(e) =>
              setNewDocument({ ...newDocument, subcategory: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <UploadDocument
            onUpload={(filePath) => setDocuments([...documents, { filePath }])}
          />
          <button
            onClick={handleAddDocument}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Зберегти
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Скасувати
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100/30">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Назва
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Категорія
              </th>
              <th className="p-2 border">Опис</th>
              <th className="p-2 border">Архів</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc._id} className="border">
                <EditableCell doc={doc} field="title" onUpdate={handleUpdate} />
                <EditableCell
                  doc={doc}
                  field="category"
                  onUpdate={handleUpdate}
                />
                <EditableCell
                  doc={doc}
                  field="description"
                  onUpdate={handleUpdate}
                />
                <ToggleCell
                  doc={doc}
                  field="isArchived"
                  onUpdate={handleUpdate}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const EditableCell = ({ doc, field, onUpdate }) => {
  const [value, setValue] = useState(doc[field]);

  return (
    <td className="p-2 border">
      <input
        className="w-full p-1 border border-gray-300 rounded"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onUpdate(doc._id, field, value)}
      />
    </td>
  );
};

const ToggleCell = ({ doc, field, onUpdate }) => (
  <td className="p-2 border text-center">
    <button
      className={`px-2 py-1 rounded ${
        doc[field] ? "bg-green-500 text-white" : "bg-gray-300"
      }`}
      onClick={() => onUpdate(doc._id, field, !doc[field])}
    >
      {doc[field] ? "✓" : "✗"}
    </button>
  </td>
);
