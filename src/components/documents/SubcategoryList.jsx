import SubcategoryButton from "./SubcategoryButton";

const SubcategoryList = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect,
  className = "",
}) => {
  if (subcategories.length === 0) return null;

  return (
    <div
      className={`flex flex-row justify-start items-center
        xl:flex-col xl:justify-start xl:items-start
        xl:h-full xl:w-auto ${className}`}
    >
      {subcategories.map((subcategory) => (
        <SubcategoryButton
          key={subcategory}
          subcategory={subcategory}
          isSelected={selectedSubcategory === subcategory}
          onClick={() => onSubcategorySelect(subcategory)}
          className="w-full flex flex-row justify-start items-start xl:flex-col xl:w-1/4"
        />
      ))}
    </div>
  );
};

export default SubcategoryList;
