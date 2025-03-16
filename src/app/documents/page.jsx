"use client";

import { useState, useEffect } from "react";
import fetchWithAuth from "@/utils/fetchWithAuth";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    fetchWithAuth("/api/documents")
      .then((data) => {
        setDocuments(data);
        const uniqueCategories = [...new Set(data.map((doc) => doc.category))];
        setCategories(uniqueCategories);
      })
      .catch((err) =>
        console.error("❌ Помилка завантаження документів:", err),
      );
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    const subcats = [
      ...new Set(
        documents
          .filter((doc) => doc.category === category && doc.subcategory)
          .map((doc) => doc.subcategory),
      ),
    ];
    setSubcategories(subcats);
    setFilteredDocuments(
      documents.filter((doc) => doc.category === category && !doc.subcategory),
    );
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFilteredDocuments(
      documents.filter(
        (doc) =>
          doc.category === selectedCategory && doc.subcategory === subcategory,
      ),
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Документи</h1>

      {/* Вкладки категорій */}
      <div className="flex overflow-x-auto space-x-2 border-b pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md transition ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200/30"
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Вкладки підкатегорій */}
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
              onClick={() => handleSubcategorySelect(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

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
  );
}
