import SubcategoryButton from "./SubcategoryButton";

const SubcategoryList = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  className = "",
}) => {
  if (subcategories.length === 0) return null;

  return (
    <div className={`SubcategoryList relative w-full mx-auto ${className}`}>
      <div className="flex lg:flex-col lg:justify-start overflow-x-auto p-2 mt-4">
        {subcategories.map((subcategory) => (
          <SubcategoryButton
            key={subcategory}
            subcategory={subcategory}
            isSelected={selectedSubcategory === subcategory}
            onClick={() => onSubcategorySelect(subcategory)}
            className=""
          />
        ))}
      </div>
    </div>
  );
};

export default SubcategoryList;
