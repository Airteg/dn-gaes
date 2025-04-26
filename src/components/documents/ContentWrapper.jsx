import DocumentGrid from "./DocumentGrid.jsx";
import SubcategoryList from "./SubcategoryList.jsx";

const ContentWrapper = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  documents,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row w-[80vw] max-w-[1280px] mx-auto gap-4 ${className}`}
    >
      <SubcategoryList
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={onSubcategorySelect}
        className="lg:w-1/3"
      />
      <DocumentGrid documents={documents} className="lg:w-2/3" />
    </div>
  );
};

export default ContentWrapper;
