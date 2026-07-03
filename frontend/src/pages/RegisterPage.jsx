import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', fullName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authApi.register({
        email: form.email,
        full_name: form.fullName,
        password: form.password,
      });
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e', textAlign: 'center' }}>Đăng ký</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontSize: '14px' }}>Tạo tài khoản ShopHub của bạn</p>

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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Họ tên</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Nguyễn Văn A"
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
            placeholder="Tối thiểu 6 ký tự"
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>

        {error && <p style={{ color: '#e94560', marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
        {success && <p style={{ color: '#27ae60', marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>{success}</p>}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#888' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#1a1a2e', fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;