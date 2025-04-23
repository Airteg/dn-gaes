"use client";

export default function Button({
  children = "Кнопка",
  onClick = () => {},
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center justify-center
        px-6 py-3
        bg-gradient-to-r from-blue-500 to-teal-400
        text-white text-base font-medium leading-6
        rounded-md shadow-sm
        transition duration-300 ease-in-out
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
