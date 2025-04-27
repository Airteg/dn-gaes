const CategoryButton = ({ category, isSelected, onClick, className = "" }) => {
  return (
    <button
      className={`whitespace-nowrap px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ${
        isSelected
          ? "button-gradient shadow-md text-[var(--link-color-active)] scale-[1.2]"
          : "bg-transparent text-[var(--link-color)] hover:text-[var(--link-hover)] hover:underline"
      } ${className}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span>{category}</span>
    </button>
  );
};

export default CategoryButton;
