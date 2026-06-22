import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=6")
      .then(res => res.json())
      .then(data => setItems(data.products));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sản phẩm nổi bật</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
        {items.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.title}
            price={p.price}
            category={p.category}
            imageUrl={p.thumbnail}
            description={p.description}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;