import SubcategoryButton from "./SubcategoryButton";

const SubcategoryList = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  className = "",
}) => {
  if (subcategories.length === 0) return null;

  return (
    <div className={`relative w-[80vw] max-w-[1280px] mx-auto ${className}`}>
      <div className="flex overflow-x-auto space-x-2 border-b p-2 mt-4">
        {subcategories.map((subcategory) => (
          <SubcategoryButton
            key={subcategory}
            subcategory={subcategory}
            isSelected={selectedSubcategory === subcategory}
            onClick={() => onSubcategorySelect(subcategory)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubcategoryList;
