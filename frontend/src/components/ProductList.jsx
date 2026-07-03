import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { productsApi } from "../api/productsapi";

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
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