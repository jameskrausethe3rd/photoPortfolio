import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="w-full h-full flex items-center justify-center rounded border bg-gray-700 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-500 dark:hover:bg-gray-500 shadow relative"
    >
      <Sun
        size={20}
        className={`absolute transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}
      />
      <Moon
        size={20}
        className={`absolute transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
};

export default DarkModeToggle;
