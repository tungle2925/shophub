import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setToken, setUser } from '../auth/token';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const result = await authApi.login({
        email: form.email,
        password: form.password,
      });
      setToken(result.access_token);
      setUser(result.user);
      navigate('/products');
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e', textAlign: 'center' }}>Đăng nhập</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontSize: '14px' }}>Chào mừng trở lại ShopHub!</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #e94560, #c0392b)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {error && <p style={{ color: '#e94560', marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#888' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#1a1a2e', fontWeight: 600 }}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;