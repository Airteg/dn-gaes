"use client";
import { useEffect } from "react";
import DocumentGrid from "./DocumentGrid";
import SubcategoryList from "./SubcategoryList";

const ContentWrapper = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  documents,
  className = "",
}) => {
  const hasSubcategories = subcategories && subcategories.length > 0;

  useEffect(() => {
    if (hasSubcategories && !selectedSubcategory) {
      onSubcategorySelect(subcategories[0]);
    }
  }, [subcategories, selectedSubcategory, onSubcategorySelect]);

  return (
    <div
      className={`flex flex-col lg:flex-row w-[80vw] max-w-[1280px] mx-auto gap-4 pt-8 ${className}`}
    >
      {hasSubcategories && (
        <SubcategoryList
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={onSubcategorySelect}
          className="lg:w-1/4"
        />
      )}
      <DocumentGrid
        documents={documents}
        className={hasSubcategories ? "lg:w-3/4" : "lg:w-full"}
      />
    </div>
  );
};

export default ContentWrapper;
