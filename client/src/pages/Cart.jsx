import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in first'); navigate('/login'); return; }
    setLoading(true);
    try {
      const items = cart.map(item => ({ product: item._id, quantity: item.quantity }));
      await API.post('/orders', { items, shippingAddress: address });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '60px' }}>
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse products and add items to your cart</p>
            <Link to="/products" className="btn btn-primary">Explore Products <FiArrowRight /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h2 className="section-title" style={{ marginBottom: '30px' }}>Shopping Cart</h2>

        <div className="cart-grid">
          <div>
            {cart.map(item => (
              <div key={item._id} className="glass-card cart-item">
                <div className="cart-item-image">
                  {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} /> : '📦'}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <FiMapPin size={10} /> {item.city}
                  </div>
                  <div className="cart-item-price">₹{item.price?.toLocaleString()}</div>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                  <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', color: 'var(--danger)', fontSize: '1.1rem' }}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="glass-card cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-summary-row">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Via ShipConnect</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            {!showCheckout ? (
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }} onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" placeholder="123 Main St" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" placeholder="Mumbai" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="Maharashtra" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" placeholder="400001" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
