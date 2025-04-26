"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsPage() {
  const { data: documents = [], isLoading, error } = useDocuments();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollRef = useRef();
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return; // Перевірка, чи існує scrollRef.current
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

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
    <div className="flex items-start justify-around border border-lime-600">
      <div className="basis-[1280px] shrink max-[1279px]:mx-4 border border-amber-600">
        <h1 className="text-2xl font-bold text-left mb-6">Документи</h1>
        <h6 className="text-sm text-left mb-4">
          <span>Отримайте доступ до нашої повної колекції документів</span>
        </h6>

        {/* Контейнер для категорій із кнопками */}
        <div className="vvv relative w-[80vw] max-w-[1280px] mx-auto border border-orange-600">
          {/* Кнопка зліва */}
          {showScrollButtons && (
            <button
              onClick={scrollLeft}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 px-1 transition-all duration-300 bg-[rgba(var(--frground),0.1)] hover:bg-[rgba(var(--frground),0.2)]"
              aria-label="Прокрутити категорії вліво"
            >
              <svg
                width="10.5"
                height="40"
                viewBox="0 0 2 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-[var(--t-color)]"
              >
                <path d="M 2 8 L 0 4 L 2 0" />
              </svg>
            </button>
          )}
          {/* Контейнер із категоріями */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto whitespace-nowrap scrollbar-hidden bg-[var(--foreground)]/5 space-x-2 px-6 py-1"
          >
            <div className="inline-flex gap-2 px-1">
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
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Кнопка справа */}
          {showScrollButtons && (
            <button
              onClick={scrollRight}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 px-1 bg-[rgba(var(--frground),0.1)] hover:bg-[rgba(var(--frground),0.2)]"
              aria-label="Прокрутити категорії вправо"
            >
              <svg
                width="10.5"
                height="40"
                viewBox="0 0 2 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-[var(--t-color)]"
              >
                <path d="M 0 8 L 2 4 L 0 0" />
              </svg>
            </button>
          )}
        </div>

        {/* Решта коду без змін */}
        <div>
          {subcategories.length > 0 && (
            <div className="flex overflow-x-auto space-x-2 border-b p-2 mt-4">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  className={`whitespace-nowrap px-4 py-2 rounded-md transition ${
                    selectedSubcategory === subcategory
                      ? "button-gradient shadow-sm text-[var(--link-color-active)] scale-[1.1]"
                      : "bg-transparent text-[var(--link-color)] hover:text-[var(--link-hover)] hover:underline"
                  }`}
                  onClick={() => setSelectedSubcategory(subcategory)}
                >
                  <span>{subcategory}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
    </div>
  );
}
