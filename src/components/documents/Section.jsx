import React from "react";

export default function Section({ children, className = "" }) {
  return (
    <section className={`mt-[3vh] w-11/12 max-w-7xl ${className}`}>
      {children}
    </section>
  );
}
