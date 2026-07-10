import { Link } from 'react-router-dom';

export const ProductCard = ({ id, name, price, category, imageUrl, description, onDelete }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      width: '240px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
        <img
          src={imageUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: '#1a1a2e',
          color: 'white',
          fontSize: '11px',
          padding: '3px 10px',
          borderRadius: '20px',
          textTransform: 'capitalize',
        }}>
          {category}
        </span>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>
          {name.length > 40 ? `${name.slice(0, 40)}...` : name}
        </h3>
        <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, flex: 1 }}>
          {description && description.length > 60 ? `${description.slice(0, 60)}...` : description}
        </p>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e94560' }}>
          {price.toLocaleString('vi-VN')}₫
        </p>

        <Link
          to={`/products/${id}`}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            color: 'white',
            padding: '0.6rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          View Details →
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            style={{
              background: '#e94560',
              color: 'white',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🗑️ Xóa
          </button>
        )}
      </div>
    </div>
  );
};