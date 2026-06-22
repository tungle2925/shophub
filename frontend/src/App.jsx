import Header from "./components/Header";
import Banner from "./components/Banner";
import FeatureSection from "./components/FeatureSection";
import ProductList from "./components/ProductList";
import ProductsPage from "./pages/ProductsPage";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Banner />
      <FeatureSection />
      <ProductList />
      <ProductsPage />
      <Footer />
    </>
  );
}

export default App;