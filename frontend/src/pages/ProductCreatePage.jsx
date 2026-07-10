import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../auth/token';
import axiosClient from '../api/axiosClient';

const ProductCreatePage = () => {
  const [form, setForm] = useState({
    name: '', price: '', category: '', description: '', imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      await axiosClient.post('/products', {
        ...form,
        price: parseFloat(form.price),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/products');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Bạn không có quyền tạo sản phẩm.');
      } else {
        setError('Tạo sản phẩm thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#1a1a2e' }}>
          ➕ Thêm sản phẩm mới
        </h2>

        {['name', 'category', 'imageUrl'].map(field => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px', textTransform: 'capitalize' }}>
              {field === 'imageUrl' ? 'Image URL' : field}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Giá (VND)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
        </button>

        {error && <p style={{ color: '#e94560', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ProductCreatePage;