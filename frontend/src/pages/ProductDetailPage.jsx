import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        const item = res.data;
        setProduct({
          id: item.id,
          name: item.title,
          price: item.price,
          category: item.category,
          imageUrl: item.thumbnail,
          description: item.description,
          rating: item.rating,
          stock: item.stock,
          brand: item.brand,
        });
      } catch (err) {
        setError('Không tìm thấy sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>⏳ Đang tải sản phẩm...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p style={{ color: '#e94560', fontSize: '1.2rem' }}>{error}</p>
      <Link to="/products" style={{ color: '#1976d2', marginTop: '1rem', display: 'inline-block' }}>← Quay lại</Link>
    </div>
  );

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

          {product.brand && (
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1rem' }}>
              Thương hiệu: <strong>{product.brand}</strong>
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#e94560' }}>
              ${product.price}
            </span>
            <span style={{ background: '#fff3f5', color: '#e94560', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
              ⭐ {product.rating}
            </span>
          </div>

          <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '15px' }}>
            {product.description}
          </p>

          <p style={{ color: product.stock > 0 ? '#27ae60' : '#e94560', fontWeight: 600, marginBottom: '1.5rem' }}>
            {product.stock > 0 ? `✅ Còn hàng (${product.stock} sản phẩm)` : '❌ Hết hàng'}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: 'linear-gradient(135deg, #e94560, #c0392b)',
              color: 'white',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
            }}>
              🛒 Thêm vào giỏ
            </button>
            <button style={{
              background: 'white',
              color: '#1a1a2e',
              border: '2px solid #1a1a2e',
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
            }}>
              ❤️ Yêu thích
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;