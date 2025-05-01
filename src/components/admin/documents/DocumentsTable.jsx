"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function DocumentsTable({ documents = [] }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleSave = async (id) => {
    try {
      console.log("🔄 Надсилаємо:", editData);
      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditingId(null);
        await queryClient.invalidateQueries({ queryKey: ["documents"] });
      } else {
        console.error("❌ Помилка збереження документа", await res.text());
      }
    } catch (e) {
      console.error("🔥 Критична помилка:", e);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100/10">
          <tr>
            <th className="border px-3 py-2 text-left">Назва</th>
            <th className="border px-3 py-2 text-left">Опис</th>
            <th className="border px-3 py-2 text-left">Категорія</th>
            <th className="border px-3 py-2 text-left">Підкатегорія</th>
            <th className="border px-3 py-2 text-left">Посилання</th>
            <th className="border px-3 py-2 text-center">Дії</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            console.log("doc", doc);
            return (
              <tr key={doc._id} className="border-t">
                <td className="border px-3 py-2">
                  {editingId === doc._id ? (
                    <input
                      value={editData.title ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    doc.title
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editingId === doc._id ? (
                    <textarea
                      value={editData.description ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    doc.description
                  )}
                </td>

                <td className="border px-3 py-2">
                  {editingId === doc._id ? (
                    <textarea
                      value={editData.category ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value,
                        })
                      }
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    doc.category
                  )}
                </td>

                <td className="border px-3 py-2">
                  {editingId === doc._id ? (
                    <textarea
                      value={editData.subcategory ?? ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          subcategory: e.target.value,
                        })
                      }
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    doc.subcategory
                  )}
                </td>

                <td className="border px-3 py-2">
                  {editingId === doc._id ? (
                    <input
                      value={editData.filePath ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, filePath: e.target.value })
                      }
                      className="w-full border p-1 rounded"
                    />
                  ) : (
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Відкрити
                    </a>
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  {editingId === doc._id ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSave(doc._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Зберегти"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Скасувати"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(doc._id);
                        setEditData({
                          title: doc.title,
                          description: doc.description,
                          category: doc.category,
                          subcategory: doc.subcategory,
                          filePath: doc.filePath,
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Редагувати"
                    >
                      ✏️
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
