"use client";
import React, { useRef, useState, useEffect } from "react";
import ScrollButton from "./ScrollButton";
import CategoryButton from "./CategoryButton";

const CategoryList = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = "w-full",
}) => {
  const scrollRef = useRef();
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи пристрій сенсорний
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isCoarse);

    if (!scrollRef.current) return;

    const observer = new ResizeObserver(() => {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    });

    observer.observe(scrollRef.current);

    // Початкова перевірка
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
    <div
      className={`CategoryList w-full max-w-[1280px] flex justify-between items-center gap-2 mx-auto bg-[var(--foreground)]/10 ${className}`}
    >
      {!isTouchDevice && showScrollButtons && (
        <ScrollButton direction="left" onClick={scrollLeft} />
      )}
      <div
        ref={scrollRef}
        style={{ scrollbarWidth: "none" }}
        className="w-full overflow-scroll scroll-smooth"
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
      {!isTouchDevice && showScrollButtons && (
        <ScrollButton direction="right" onClick={scrollRight} />
      )}
    </div>
  );
};

export default CategoryList;
