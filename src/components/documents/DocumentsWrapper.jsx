import React from "react";

export default function DocumentsWrapper({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}
