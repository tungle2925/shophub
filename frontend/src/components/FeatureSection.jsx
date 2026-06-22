function FeatureSection() {
  const features = [
    { icon: "🚚", title: "Giao hàng nhanh", desc: "Giao hàng trong 2 giờ nội thành, miễn phí đơn trên 500k" },
    { icon: "💳", title: "Thanh toán dễ", desc: "Hỗ trợ thẻ, ví điện tử, COD và nhiều hình thức khác" },
    { icon: "🔒", title: "Bảo mật cao", desc: "Thông tin và giao dịch của bạn được mã hóa an toàn" },
    { icon: "🎁", title: "Ưu đãi hấp dẫn", desc: "Voucher và khuyến mãi độc quyền mỗi ngày cho thành viên" },
  ];

  return (
    <section style={{ padding: '4rem 2rem', background: 'white' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Tại sao chọn ShopHub?
      </h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '3rem' }}>
        Chúng tôi cam kết mang lại trải nghiệm mua sắm tốt nhất
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: '#f8f9fa',
            borderRadius: '16px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            border: '1px solid #eee',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e' }}>{f.title}</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;