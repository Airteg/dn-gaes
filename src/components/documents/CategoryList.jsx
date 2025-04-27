"use client";
import React, { useRef, useState, useEffect } from "react";
import ScrollButton from "./ScrollButton";
import CategoryButton from "./CategoryButton";

const CategoryList = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = "",
}) => {
  const scrollRef = useRef();
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new ResizeObserver(() => {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    });

    observer.observe(scrollRef.current);

    // Після монтування треба одразу викликати перевірку:
    const { scrollWidth, clientWidth } = scrollRef.current;
    setShowScrollButtons(scrollWidth > clientWidth);

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className={`relative w-[90vw] max-w-[1280px] mx-auto ${className}`}>
      {showScrollButtons && (
        <ScrollButton direction="left" onClick={scrollLeft} />
      )}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hidden bg-[var(--foreground)]/5 space-x-2 px-6 py-1"
      >
        <div className="inline-flex gap-2 px-1">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </div>
      </div>
      {showScrollButtons && (
        <ScrollButton direction="right" onClick={scrollRight} />
      )}
    </div>
  );
};

export default CategoryList;
