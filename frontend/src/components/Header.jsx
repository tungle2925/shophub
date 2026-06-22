function Header() {
  return (
    <header style={{ background: "#1a1a2e", color: "white", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: 0 }}>🛍️ ShopHub</h1>
      <nav>
        <a href="/" style={{ color: "white", marginRight: "1rem", textDecoration: "none" }}>Trang chủ</a>
        <a href="/products" style={{ color: "white", marginRight: "1rem", textDecoration: "none" }}>Sản phẩm</a>
        <a href="/cart" style={{ color: "white", textDecoration: "none" }}>Giỏ hàng 🛒</a>
      </nav>
    </header>
  );
}

export default Header;