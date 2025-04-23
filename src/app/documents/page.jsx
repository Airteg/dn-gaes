"use client";

import { useState, useMemo } from "react";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsPage() {
  const { data: documents = [], isLoading, error } = useDocuments();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = useMemo(
    () => [...new Set(documents.map((doc) => doc.category))],
    [documents],
  );

  const subcategories = useMemo(() => {
    return [
      ...new Set(
        documents
          .filter((doc) => doc.category === selectedCategory && doc.subcategory)
          .map((doc) => doc.subcategory),
      ),
    ];
  }, [selectedCategory, documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (doc.category !== selectedCategory) return false;
      if (!selectedSubcategory && doc.subcategory) return false;
      if (selectedSubcategory && doc.subcategory !== selectedSubcategory)
        return false;
      return true;
    });
  }, [documents, selectedCategory, selectedSubcategory]);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>❌ Помилка: {error.message}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Документи</h1>

      <div className="flex overflow-x-auto space-x-2 border-b pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md transition ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200/30"
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedSubcategory(null);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {subcategories.length > 0 && (
        <div className="flex overflow-x-auto space-x-2 border-b py-2 mt-4">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`px-3 py-1 rounded-md transition ${
                selectedSubcategory === subcategory
                  ? "bg-green-500 text-white"
                  : "bg-gray-200/30"
              }`}
              onClick={() => setSelectedSubcategory(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div key={doc._id} className="p-4 bg-white/10 shadow-md rounded-md">
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-gray-300 text-sm mb-2">{doc.description}</p>
            <a
              href={doc.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Відкрити документ
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
