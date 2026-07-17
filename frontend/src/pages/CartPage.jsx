import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/ordersApi';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalQuantity, totalPrice, clearCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPlacingOrder(true);
    setError('');
    try {
      const order = await ordersApi.checkout(items);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError('Đặt hàng thất bại, vui lòng thử lại.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a2e' }}>Giỏ hàng trống</h2>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link to="/products" style={{ background: '#1a1a2e', color: 'white', padding: '0.8rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>🛒 Giỏ hàng</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>{totalQuantity} sản phẩm trong giỏ</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a1a2e' }}>Sản phẩm</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Đơn giá</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Số lượng</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Thành tiền</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#e94560', fontWeight: 600 }}>
                    {item.price.toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                      >-</button>
                      <span style={{ fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                      >+</button>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#1a1a2e' }}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: '#e94560', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

        {/* Tổng tiền */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem 2rem', marginTop: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#888', margin: 0 }}>Tổng cộng ({totalQuantity} sản phẩm)</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e94560', margin: 0 }}>
              {totalPrice.toLocaleString('vi-VN')}₫
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={clearCart}
              style={{ padding: '0.8rem 1.5rem', background: 'white', color: '#888', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
            >
              Xóa tất cả
            </button>
            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #e94560, #c0392b)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}
            >
              {placingOrder ? 'Đang đặt hàng...' : 'Thanh toán'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;