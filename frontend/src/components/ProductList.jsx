import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../api";

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getProducts({ size: 6 })
      .then(res => setItems(res.data.items))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", background: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem", fontWeight: 700 }}>
        Sản phẩm nổi bật
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
        {items.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            category={p.category}
            imageUrl={p.imageUrl}
            description={p.description}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;