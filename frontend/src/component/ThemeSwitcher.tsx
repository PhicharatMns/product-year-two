// src/components/ThemeSwitcher.tsx
import React from "react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("dark"); // ถ้าเป็น system ให้เริ่มจาก dark
  };
const buttonColor =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
      : theme === "light"
      ? "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"
      : "bg-gray-400 hover:bg-gray-500 active:bg-gray-600";

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-2 m-4 rounded-lg ${buttonColor} text-white font-semibold transition`}
    >
      {theme === "dark"
        ? "🌙 โหมดมืด"
        : theme === "light"
        ? "☀️ โหมดสว่าง"
        : "💻 System"}
    </button>
  );
}