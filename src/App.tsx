import { useEffect, useState } from "react";
import Header from "./components/Header";
import ImageGrid from "./components/ImageGrid";
import './App.css';

function App() {
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
    <div className="bg-white dark:bg-slate-900 w-full h-full m-auto p-0">
      <div className="max-w-7xl m-auto">
        <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-xl/40">
          <Header />
          <main className="relative">
            <button
              onClick={toggleDarkMode}
              className="fixed top-4 right-4 z-50 px-4 py-2 rounded border text-sm bg-gray-700 dark:bg-gray-100 text-white dark:text-black shadow"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            <ImageGrid />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
