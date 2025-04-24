import Header from "./components/Header";
import ImageGrid from "./components/ImageGrid";
import DarkModeToggle from "./components/DarkModeToggle"; // Import the updated component
import './App.css';

function App() {
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