import React from "react";

export default function DocumentsWrapper({ children, className = "" }) {
  return (
    <div
      className={`documents flex flex-col max-w-7xl shadow-2xl mt-6 max-xl:mt-0 overflow-auto ${className}`}
    >
      {children}
    </div>
  );
}
