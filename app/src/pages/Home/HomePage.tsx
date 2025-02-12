import FeaturedPosts from "src/components/landing/FeaturedPosts";
import FeaturedSection from "src/components/landing/FeaturedSection";
import SearchBar from "src/components/landing/SearchBar";
import Page from "src/components/Page";


const App: React.FC = () => {
  return (

    <Page className="min-h-scree p-4">
      <div className="h-4" />
      <SearchBar />
      <div className="container">


        <div className=" overflow-y-auto  flex flex-col ">
          <FeaturedSection />
          <FeaturedPosts />
        </div>
      </div>

    </Page>

  );
};

export default App;

