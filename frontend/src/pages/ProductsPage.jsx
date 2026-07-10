import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { productsApi } from "../api/productsapi";
import { useAuth } from "../auth/useAuth";
import { getToken } from "../auth/token";
import axiosClient from "../api/axiosClient";

function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productsApi.getAll();
      setAllProducts(data);
      setItems(data);
    } catch (err) {
      setError("Could not load products from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const token = getToken();
      await axiosClient.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllProducts(prev => prev.filter(p => p.id !== id));
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Bạn không có quyền xóa sản phẩm!');
      } else {
        alert('Xóa thất bại!');
      }
    }
  };

  const categories = ["All", ...new Set(allProducts.map(p => p.category))];

  useEffect(() => {
    let result = [...allProducts];
    if (keyword) result = result.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
    if (category !== "All") result = result.filter(p => p.category === category);
    if (sortBy === "asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "desc") result.sort((a, b) => b.price - a.price);
    setItems(result);
  }, [keyword, category, sortBy, allProducts]);

  if (loading) return <p style={{ padding: '24px' }}>⏳ Đang tải sản phẩm...</p>;
  if (error) return <p style={{ padding: '24px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Tất cả sản phẩm
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
          Khám phá các sản phẩm chất lượng từ ShopHub
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Admin: nút thêm sản phẩm */}
        {isAdmin && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => navigate('/admin/products/new')}
              style={{ background: '#27ae60', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
            >
              ➕ Thêm sản phẩm mới
            </button>
          </div>
        )}

        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm sản phẩm..."
            style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{ padding: '0.4rem 1.2rem', borderRadius: '20px', border: '1.5px solid #1a1a2e', background: category === c ? '#1a1a2e' : 'white', color: category === c ? 'white' : '#1a1a2e', cursor: 'pointer', fontSize: '13px', fontWeight: category === c ? 700 : 400 }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white' }}
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>

          <button
            onClick={() => { setKeyword(""); setCategory("All"); setSortBy("default"); }}
            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontSize: '14px' }}
          >
            ✕ Xóa bộ lọc
          </button>

          <span style={{ color: '#888', fontSize: '14px', marginLeft: 'auto' }}>
            {items.length} sản phẩm
          </span>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            {items.map(p => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                category={p.category}
                imageUrl={p.imageUrl}
                description={p.description}
                onDelete={isAdmin ? handleDelete : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;