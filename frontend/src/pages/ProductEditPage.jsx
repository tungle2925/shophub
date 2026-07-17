import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { getToken } from "../auth/token";

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        setForm({
          name: res.data.name,
          price: res.data.price,
          category: res.data.category,
          description: res.data.description,
          imageUrl: res.data.imageUrl,
        });
      } catch (err) {
        setError("Không tải được sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      await axiosClient.put(
        `/products/${id}`,
        {
          name: form.name,
          price: Number(form.price),
          category: form.category,
          description: form.description,
          imageUrl: form.imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/products");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Bạn không có quyền sửa sản phẩm!");
      } else {
        setError("Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "24px" }}>⏳ Đang tải sản phẩm...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 800 }}>
          ✏️ Sửa sản phẩm
        </h1>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {error && (
            <p style={{ color: "#e94560", fontSize: "14px" }}>{error}</p>
          )}

          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>
            Tên sản phẩm
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
              style={inputStyle}
            />
          </label>

          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>
            Giá (₫)
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min={1}
              style={inputStyle}
            />
          </label>

          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>
            Danh mục
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={50}
              style={inputStyle}
            />
          </label>

          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>
            Mô tả
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>
            URL hình ảnh
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #e94560, #c0392b)",
                color: "white",
                border: "none",
                padding: "0.8rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              style={{
                flex: 1,
                background: "white",
                color: "#1a1a2e",
                border: "1px solid #ddd",
                padding: "0.8rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "0.4rem",
  padding: "0.7rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default ProductEditPage;