import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Banner from './components/Banner';
import FeatureSection from './components/FeatureSection';
import ProductList from './components/ProductList';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer';

const HomePage = () => (
  <>
    <Banner />
    <FeatureSection />
    <ProductList />
    <Footer />
  </>
);

const CartPage = () => (
  <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a2e' }}>Giỏ hàng trống</h2>
    <p style={{ color: '#888', marginBottom: '2rem' }}>Chức năng giỏ hàng sẽ được thêm vào buổi sau.</p>
  </div>
);

const LoginPage = () => (
  <div style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
    <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e', textAlign: 'center' }}>Đăng nhập</h2>
      <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontSize: '14px' }}>Chức năng xác thực sẽ được thêm vào buổi sau.</p>
      <input placeholder="Email" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', fontSize: '15px', boxSizing: 'border-box' }} />
      <input type="password" placeholder="Mật khẩu" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1.5rem', fontSize: '15px', boxSizing: 'border-box' }} />
      <button style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700 }}>
        Đăng nhập
      </button>
    </div>
  </div>
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
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<><ProductsPage /><Footer /></>} />
      <Route path="/products/:id" element={<><ProductDetailPage /><Footer /></>} />
      <Route path="/cart" element={<><CartPage /><Footer /></>} />
      <Route path="/login" element={<><LoginPage /><Footer /></>} />
      <Route path="*" element={<><NotFound /><Footer /></>} />
    </Routes>
  </>
);

export default App;