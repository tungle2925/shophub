function ProductCard({ name, price, image, category, description }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <img src={image} alt={name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      <div style={{ padding: "1rem" }}>
        <span style={{ fontSize: "12px", color: "#888", background: "#f0f0f0", padding: "2px 8px", borderRadius: "12px" }}>{category}</span>
        <h3 style={{ margin: "8px 0 4px" }}>{name}</h3>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 8px" }}>{description}</p>
        <p style={{ color: "#e94560", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 12px" }}>
          {price.toLocaleString("vi-VN")}₫
        </p>
        <button style={{ width: "100%", background: "#1a1a2e", color: "white", border: "none", padding: "0.6rem", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
          Thêm vào giỏ 🛒
        </button>
      </div>
    </div>
  );
}

export default ProductCard;