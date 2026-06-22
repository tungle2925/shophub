function FeatureSection() {
  const features = [
    { icon: "🚚", title: "Giao hàng nhanh", desc: "Giao hàng trong 2 giờ nội thành" },
    { icon: "💳", title: "Thanh toán dễ", desc: "Hỗ trợ nhiều hình thức thanh toán" },
    { icon: "🔒", title: "Bảo mật cao", desc: "Thông tin khách hàng được bảo vệ" },
    { icon: "🎁", title: "Ưu đãi hấp dẫn", desc: "Nhiều voucher và khuyến mãi mỗi ngày" },
  ];

  return (
    <section style={{ padding: "3rem 2rem", background: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Tại sao chọn ShopHub?</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {features.map((f, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "2.5rem" }}>{f.icon}</div>
            <h3 style={{ margin: "0.5rem 0" }}>{f.title}</h3>
            <p style={{ color: "#666", margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;