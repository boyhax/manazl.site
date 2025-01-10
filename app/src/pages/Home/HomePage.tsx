import FeaturedPosts from "src/components/landing/FeaturedPosts";
import FeaturedSection from "src/components/landing/FeaturedSection";
import SearchBar from "src/components/landing/SearchBar";


const App: React.FC = () => {
  return (

    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4 pt-2">
      <main className="w-full max-w-4xl">
        <SearchBar />
        <FeaturedSection />
        <FeaturedPosts/>
      </main>
    </div>

  );
};

export default App;

