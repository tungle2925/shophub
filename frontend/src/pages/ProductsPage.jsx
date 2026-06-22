import { useState, useEffect } from "react";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("default");
  const [items, setItems] = useState(products);

  const categories = ["Tất cả", ...new Set(products.map(p => p.category))];

  useEffect(() => {
    let result = [...products];

    if (keyword) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (category !== "Tất cả") {
      result = result.filter(p => p.category === category);
    }

    if (sortBy === "asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "desc") result.sort((a, b) => b.price - a.price);

    setItems(result);
  }, [keyword, category, sortBy]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Tất cả sản phẩm</h2>

      {/* Thanh tìm kiếm */}
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="🔍 Tìm sản phẩm..."
        style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", marginBottom: "1rem", boxSizing: "border-box" }}
      />

      {/* Filter category */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{ padding: "0.4rem 1rem", borderRadius: "20px", border: "1.5px solid #1a1a2e", background: category === c ? "#1a1a2e" : "white", color: category === c ? "white" : "#1a1a2e", cursor: "pointer", fontWeight: category === c ? 700 : 400 }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sort giá */}
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "1.5rem", fontSize: "14px" }}
      >
        <option value="default">Mặc định</option>
        <option value="asc">Giá tăng dần</option>
        <option value="desc">Giá giảm dần</option>
      </select>

      {/* Kết quả */}
      <p style={{ color: "#666", marginBottom: "1rem" }}>{items.length} sản phẩm</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
        {items.map(p => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;