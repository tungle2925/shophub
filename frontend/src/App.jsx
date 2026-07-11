import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Banner from './components/Banner';
import FeatureSection from './components/FeatureSection';
import ProductList from './components/ProductList';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductCreatePage from './pages/ProductCreatePage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './routes/ProtectedRoute';
import Footer from './components/Footer';

const HomePage = () => (
  <>
    <Banner />
    <FeatureSection />
    <ProductList />
    <Footer />
  </>
);

const NotFound = () => (
  <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</div>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a2e' }}>Trang không tồn tại</h2>
    <p style={{ color: '#888' }}>Trang bạn tìm kiếm không tồn tại.</p>
  </div>
);

const App = () => (
  <>
    <Header title="ShopHub" />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<><ProductsPage /><Footer /></>} />
      <Route path="/products/:id" element={<><ProductDetailPage /><Footer /></>} />
      <Route path="/cart" element={<><CartPage /><Footer /></>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin only routes */}
      <Route path="/admin/products/new" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ProductCreatePage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<><NotFound /><Footer /></>} />
    </Routes>
  </>
);

export default App;