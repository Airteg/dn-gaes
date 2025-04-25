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
    <div className="flex items-start justify-around">
      <div className="hidden xl:flex basis-1/8"></div>
      <div className="grow-1  max-[1279px]:ml-4">
        <h1 className="text-2xl font-bold text-left mb-6">Документи</h1>
        <h6 className="text-sm text-left mb-4">
          Отримайте доступ до нашої повної колекції документів
        </h6>

        {/* Лінійка категорій */}
        <div className="flex overflow-x-auto overflow-y-visible bg-[var(--foreground)]/5 space-x-2  px-2 py-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`whitespace-nowrap px-4 py-2 rounded-md transition ${
                selectedCategory === category
                  ? "button-gradient shadow-sm text-[var(--link-color-active)] scale-[1.1]"
                  : "bg-transparent text-[var(--link-color)] hover:text-[var(--link-hover)] hover:underline"
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

        {/* Лінійка/стовпчик субкатегорій */}
        <div>
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
        </div>

        {/* Список документів */}
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
      <div className="hidden xl:flex basis-1/8"></div>
    </div>
  );
}
