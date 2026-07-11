import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/productsapi';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const p = await productsApi.getById(id);
        setProduct(p);
      } catch (err) {
        setError('Could not load product details from API.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <p style={{ padding: '24px' }}>⏳ Đang tải sản phẩm...</p>;
  if (error) return <p style={{ padding: '24px', color: 'red' }}>{error}</p>;
  if (!product) return <p style={{ padding: '24px' }}>Không tìm thấy sản phẩm.</p>;

  return (
    <section style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/products" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: '#1a1a2e',
        fontWeight: 600,
        marginBottom: '2rem',
        padding: '0.5rem 1rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        ← Quay lại sản phẩm
      </Link>

      <div style={{
        display: 'flex',
        gap: '3rem',
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        alignItems: 'flex-start',
      }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '360px', height: '360px', objectFit: 'cover', borderRadius: '16px', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <span style={{
            background: '#1a1a2e',
            color: 'white',
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'capitalize',
          }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '1rem 0 0.5rem', color: '#1a1a2e' }}>
            {product.name}
          </h1>

          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#e94560', marginBottom: '1rem' }}>
            {product.price.toLocaleString('vi-VN')}₫
          </p>

          <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '15px' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleAddToCart}
              style={{
                background: added ? '#27ae60' : 'linear-gradient(135deg, #e94560, #c0392b)',
                color: 'white',
                border: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {added ? '✅ Đã thêm vào giỏ!' : '🛒 Thêm vào giỏ'}
            </button>
            <Link
              to="/cart"
              style={{
                background: 'white',
                color: '#1a1a2e',
                border: '2px solid #1a1a2e',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;