import Header from "./components/Header";
import ImageGrid from "./components/ImageGrid";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main>
        <ImageGrid />
      </main>
    </div>
  );
}

export default App
