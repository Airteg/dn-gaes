"use client";

import { useEffect, useState, useMemo } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import PageHeader from "@/components/documents/PageHeader";
import CategoryList from "@/components/documents/CategoryList";
import ContentWrapper from "@/components/documents/ContentWrapper";
import Section from "@/components/documents/Section.jsx";
import DocumentsWrapper from "@/components/documents/DocumentsWrapper.jsx";

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

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>❌ Помилка: {error.message}</p>;

  return (
    <Section>
      <DocumentsWrapper>
        <PageHeader
          title="Документи"
          subtitle="Отримайте доступ до нашої повної колекції документів"
        />
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={(category) => {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
          }}
        />

        <ContentWrapper
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={setSelectedSubcategory}
          documents={filteredDocuments}
          className="w-full flex flex-col lg:flex-row mx-auto p-2 gap-4 border-2 border-green-600"
        />
      </DocumentsWrapper>
    </Section>
  );
}
