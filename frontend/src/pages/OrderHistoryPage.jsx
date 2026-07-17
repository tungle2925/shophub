import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/ordersApi';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await ordersApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError('Không tải được lịch sử đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: '4rem 2rem', textAlign: 'center' }}>Đang tải...</p>;
  }

  if (error) {
    return <p style={{ padding: '4rem 2rem', textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>📦 Lịch sử đơn hàng</h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem' }}>
        {orders.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#888' }}>Bạn chưa có đơn hàng nào.</p>
            <Link to="/products" style={{ color: '#e94560', fontWeight: 700 }}>Mua sắm ngay</Link>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#1a1a2e' }}>Mã đơn</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Trạng thái</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Tổng tiền</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Ngày đặt</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>#{o.id}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{o.status}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#e94560', fontWeight: 700 }}>
                      {o.total_amount.toLocaleString('vi-VN')}₫
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {new Date(o.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Link to={`/orders/${o.id}`} style={{ color: '#e94560', fontWeight: 600 }}>Xem</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;