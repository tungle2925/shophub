import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, clearToken } from '../auth/token';
import { useCart } from '../context/CartContext';

export const Header = ({ title }) => {
  const navigate = useNavigate();
  const user = getUser();
  const { totalQuantity } = useCart();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const navItems = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Sản phẩm', to: '/products' },
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '0 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '2rem' }}>🛍️</span>
        <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '1px' }}>
          Shop<span style={{ color: '#e94560' }}>Hub</span>
        </span>
      </div>

      <nav style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.85)',
              background: isActive ? 'white' : 'transparent',
              fontWeight: isActive ? 700 : 400,
              fontSize: '15px',
              transition: 'all 0.2s',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
            })}
          >
            {item.label}
          </NavLink>
        ))}

        {/* Giỏ hàng với badge */}
        <NavLink
          to="/cart"
          style={({ isActive }) => ({
            padding: '0.5rem 1.2rem',
            borderRadius: '20px',
            color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.85)',
            background: isActive ? 'white' : 'transparent',
            fontWeight: isActive ? 700 : 400,
            fontSize: '15px',
            border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          })}
        >
          🛒 Giỏ hàng
          {totalQuantity > 0 && (
            <span style={{
              background: '#e94560',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {totalQuantity}
            </span>
          )}
        </NavLink>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>
              👋 {user.full_name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                color: '#1a1a2e',
                background: '#e94560',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            style={({ isActive }) => ({
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.85)',
              background: isActive ? 'white' : 'transparent',
              fontWeight: isActive ? 700 : 400,
              fontSize: '15px',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
            })}
          >
            Đăng nhập
          </NavLink>
        )}
      </nav>
    </header>
  );
};