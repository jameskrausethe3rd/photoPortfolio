import Header from "./components/Header";
import ImageGrid from "./components/ImageGrid";
import './App.css';
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 w-full h-full m-auto p-0">
      <div className="max-w-7xl m-auto">
        <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-xl/40">
          <Header />
          <main className="relative">
            <ImageGrid />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;