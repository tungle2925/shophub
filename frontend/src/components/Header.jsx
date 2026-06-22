import { NavLink } from 'react-router-dom';

export const Header = ({ title }) => {
  const navItems = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Sản phẩm', to: '/products' },
    { label: 'Giỏ hàng', to: '/cart' },
    { label: 'Đăng nhập', to: '/login' },
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.8rem' }}>🛍️</span>
        <span style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '1px' }}>
          {title}
        </span>
      </div>
      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.8)',
              background: isActive ? 'white' : 'transparent',
              fontWeight: isActive ? 700 : 400,
              fontSize: '14px',
              transition: 'all 0.2s',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};