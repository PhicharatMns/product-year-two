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

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 m-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
    >
      {theme === "dark" ? "🌙 Dark" : theme === "light" ? "☀️ Light" : "💻 System"}
    </button>
  );
}
