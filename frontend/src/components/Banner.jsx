import { Link } from 'react-router-dom';

function Banner() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      padding: '5rem 2rem',
      textAlign: 'center',
    }}>
      <p style={{ color: '#e94560', fontWeight: 600, fontSize: '14px', letterSpacing: '3px', marginBottom: '1rem', textTransform: 'uppercase' }}>
        🎉 Chào mừng đến với
      </p>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
        Shop<span style={{ color: '#e94560' }}>Hub</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
        Mua sắm thả ga — Giao hàng tận nơi — Ưu đãi mỗi ngày
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/products" style={{
          background: '#e94560',
          color: 'white',
          padding: '0.9rem 2.5rem',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
        }}>
          Mua sắm ngay →
        </Link>
        <Link to="/products" style={{
          background: 'transparent',
          color: 'white',
          padding: '0.9rem 2.5rem',
          borderRadius: '30px',
          fontWeight: 600,
          fontSize: '1rem',
          border: '2px solid rgba(255,255,255,0.4)',
        }}>
          Xem sản phẩm
        </Link>
      </div>
    </section>
  );
}

export default Banner;