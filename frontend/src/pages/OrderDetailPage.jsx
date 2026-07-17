import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../api/ordersApi';
import { productsApi } from '../api/productsapi';
import { useAuth } from '../auth/useAuth';

const ALLOWED_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELED'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ordersApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError('Bạn không có quyền xem đơn hàng này.');
      } else if (status === 404) {
        setError('Không tìm thấy đơn hàng này.');
      } else {
        setError('Không tải được chi tiết đơn hàng.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!isAdmin) {
      productsApi.getAll().then(setProducts).catch(() => {});
    }
  }, [isAdmin]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const updated = await ordersApi.adminUpdateStatus(order.id, newStatus);
      setOrder(updated);
    } catch (err) {
      alert('Cập nhật trạng thái thất bại.');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty <= 0) return;
    setUpdating(true);
    try {
      const updated = await ordersApi.adminUpdateItemQuantity(order.id, itemId, newQty);
      setOrder(updated);
    } catch (err) {
      alert('Cập nhật số lượng thất bại.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddProduct = async () => {
    setAddError('');
    if (!selectedProductId) {
      setAddError('Vui lòng chọn sản phẩm.');
      return;
    }
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    setAdding(true);
    try {
      const updated = await ordersApi.addItemsToOrder(order.id, [
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: addQuantity,
        },
      ]);
      setOrder(updated);
      setSelectedProductId('');
      setAddQuantity(1);
    } catch (err) {
      setAddError(err.response?.data?.detail || 'Thêm sản phẩm thất bại.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '4rem 2rem', textAlign: 'center' }}>Đang tải...</p>;
  }

  if (error) {
    return <p style={{ padding: '4rem 2rem', textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  if (!order) {
    return <p style={{ padding: '4rem 2rem', textAlign: 'center' }}>Không tìm thấy đơn hàng.</p>;
  }

  const canAddProduct = !isAdmin && order.status === 'PLACED';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>Đơn hàng #{order.id}</h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem' }}>
        <Link to={isAdmin ? '/admin/orders' : '/orders'} style={{ color: '#e94560', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Quay lại {isAdmin ? 'quản lý đơn hàng' : 'lịch sử đơn hàng'}
        </Link>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <strong>Trạng thái:</strong>{' '}
            {isAdmin ? (
              <select
                value={order.status}
                onChange={handleStatusChange}
                disabled={updating}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
              >
                {ALLOWED_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            ) : (
              order.status
            )}
          </p>
          <p style={{ margin: '0.3rem 0' }}><strong>Tổng tiền:</strong> <span style={{ color: '#e94560', fontWeight: 700 }}>{order.total_amount.toLocaleString('vi-VN')}₫</span></p>
          <p style={{ margin: '0.3rem 0' }}><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a1a2e' }}>Sản phẩm</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Đơn giá</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Số lượng</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#1a1a2e' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{item.product_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{item.product_price.toLocaleString('vi-VN')}₫</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {isAdmin ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updating}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                        >-</button>
                        <span style={{ fontWeight: 600, minWidth: '24px' }}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updating}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                        >+</button>
                      </div>
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#e94560' }}>
                    {item.line_total.toLocaleString('vi-VN')}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canAddProduct && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem 2rem', marginTop: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1a1a2e' }}>➕ Thêm sản phẩm vào đơn hàng</h3>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '220px' }}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.price.toLocaleString('vi-VN')}₫
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={addQuantity}
                onChange={(e) => setAddQuantity(Number(e.target.value))}
                style={{ width: '80px', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
              />
              <button
                onClick={handleAddProduct}
                disabled={adding}
                style={{ padding: '0.6rem 1.4rem', background: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
              >
                {adding ? 'Đang thêm...' : 'Thêm vào đơn'}
              </button>
            </div>
            {addError && <p style={{ color: 'red', marginTop: '0.8rem' }}>{addError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;