import React from "react";

export default function Section({ children, className = "" }) {
  return (
    <section
      className={`flex flex-1 flex-col items-center justify-start overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}
