function Banner() {
  return (
    <section style={{ background: "#16213e", color: "white", padding: "4rem 2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Chào mừng đến ShopHub 🎉</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#a8b2d8" }}>
        Mua sắm thả ga — Giao hàng tận nơi
      </p>
      <button style={{ background: "#e94560", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" }}>
        Mua sắm ngay
      </button>
    </section>
  );
}

export default Banner;