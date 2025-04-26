const ScrollButton = ({ direction, onClick, className = "" }) => {
  const isLeft = direction === "left";
  const positionClass = isLeft ? "left-0" : "right-0";
  const svgPath = isLeft ? "M 2 8 L 0 4 L 2 0" : "M 0 8 L 2 4 L 0 0";
  const ariaLabel = isLeft
    ? "Прокрутити категорії вліво"
    : "Прокрутити категорії вправо";

  return (
    <button
      onClick={onClick}
      className={`hidden lg:block absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 transition-all duration-300 px-1 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 ${className}`}
      aria-label={ariaLabel}
    >
      <svg
        width="10.5"
        height="40"
        viewBox="0 0 2 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        className="text-[var(--t-color)]"
      >
        <path d={svgPath} />
      </svg>
    </button>
  );
};

export default ScrollButton;
