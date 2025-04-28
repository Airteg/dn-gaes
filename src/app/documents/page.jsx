"use client";

import { useEffect, useState, useMemo } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import PageHeader from "@/components/documents/PageHeader";
import CategoryList from "@/components/documents/CategoryList";
import ContentWrapper from "@/components/documents/ContentWrapper";
import Section from "@/components/documents/Section";
import DocumentsWrapper from "@/components/documents/DocumentsWrapper";

export default function DocumentsPage() {
  const { data: documents = [], isLoading, error } = useDocuments();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = useMemo(
    () => [...new Set(documents.map((doc) => doc.category))],
    [documents],
  );

  const subcategories = useMemo(() => {
    const subs = [
      ...new Set(
        documents
          .filter((doc) => doc.category === selectedCategory && doc.subcategory)
          .map((doc) => doc.subcategory),
      ),
    ];
    return ["Всі документи", ...subs];
  }, [selectedCategory, documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (doc.category !== selectedCategory) return false;
      if (selectedSubcategory === "Всі документи") return true;
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
          className=""
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
        />
      </DocumentsWrapper>
    </Section>
  );
}
