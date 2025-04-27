const SubcategoryButton = ({
  subcategory,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`text-left whitespace-nowrap px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${
        isSelected
          ? "font-bold text-[var(--link-color)] border-l-4"
          : "bg-transparent text-[var(--link-color)] hover:text-[var(--link-hover)] hover:bg-gray-500/10"
      } ${className}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span className="text-left">{subcategory}</span>
    </button>
  );
};

export default SubcategoryButton;
