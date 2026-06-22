function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'rgba(255,255,255,0.7)',
      padding: '3rem 2rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1100px', margin: '0 auto 2rem', }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem' }}>🛍️ ShopHub</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.7 }}>Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Mua sắm thả ga, giao hàng tận nơi.</p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '0.8rem' }}>Liên kết</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '14px' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Trang chủ</a>
            <a href="/products" style={{ color: 'rgba(255,255,255,0.6)' }}>Sản phẩm</a>
            <a href="/cart" style={{ color: 'rgba(255,255,255,0.6)' }}>Giỏ hàng</a>
            <a href="/login" style={{ color: 'rgba(255,255,255,0.6)' }}>Đăng nhập</a>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '0.8rem' }}>Liên hệ</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '14px' }}>
            <span>📧 shophub@email.com</span>
            <span>📞 1800 1234</span>
            <span>📍 TP. Hồ Chí Minh</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '13px' }}>
        © 2026 ShopHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;