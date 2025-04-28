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
      className={`w-full flex flex-col xl:flex-row items-start ${className}`}
    >
      <SubcategoryList
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={onSubcategorySelect}
      />
      <DocumentGrid documents={documents} />
    </div>
  );
};

export default ContentWrapper;
