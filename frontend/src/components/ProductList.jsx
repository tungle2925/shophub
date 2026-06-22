import { useState, useEffect } from "react";
import products from "../data/products.json";
import ProductCard from "./ProductCard";

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(products);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sản phẩm nổi bật</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
        {items.map(p => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
