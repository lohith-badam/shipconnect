import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiShoppingBag, FiPlus, FiArrowRight, FiMapPin, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: 'Electronics', stock: '', image: '' });
  const [shipmentForm, setShipmentForm] = useState({ destinationCity: '', weight: '', productDescription: '' });

  useEffect(() => {
    if (!user) return;
    if (user.role === 'customer') {
      API.get('/orders').then(r => setOrders(r.data)).catch(() => {});
    }
    if (user.role === 'seller') {
      API.get('/products/seller/my').then(r => setProducts(r.data)).catch(() => {});
      API.get('/orders/seller').then(r => setOrders(r.data)).catch(() => {});
      API.get('/shipments/my').then(r => setShipments(r.data)).catch(() => {});
    }
    if (user.role === 'transporter') {
      API.get('/shipments/my').then(r => setShipments(r.data)).catch(() => {});
    }
  }, [user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/products', { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) });
      setProducts([res.data, ...products]);
      setShowAddProduct(false);
      setProductForm({ name: '', description: '', price: '', category: 'Electronics', stock: '', image: '' });
      toast.success('Product added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/shipments', shipmentForm);
      setShipments([res.data, ...shipments]);
      setShowCreateShipment(false);
      setShipmentForm({ destinationCity: '', weight: '', productDescription: '' });
      toast.success('Shipment request posted! Transporters in your city will be notified.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shipment');
    }
  };

  if (!user) return <div className="dashboard"><div className="container"><p>Please log in</p></div></div>;

  const statusColor = (s) => {
    const map = { pending: 'warning', confirmed: 'info', matched: 'success', in_transit: 'info', delivered: 'success', cancelled: 'danger' };
    return map[s] || 'primary';
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">
            Welcome, {user.name}! {user.role === 'seller' ? '🏪' : user.role === 'transporter' ? '🚛' : '👋'}
          </h1>
          <p className="dashboard-role">
            {user.role === 'seller' ? `${user.shopName || 'Seller'} • ${user.city}` :
             user.role === 'transporter' ? `Transporter • ${user.city} • ${user.vehicleType || ''}` :
             `Customer • ${user.city}`}
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {user.role === 'seller' && (
            <>
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(108, 60, 225, 0.15)', color: 'var(--primary-light)' }}><FiShoppingBag /></div>
                <div><div className="stat-value">{products.length}</div><div className="stat-label">Products</div></div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--accent)' }}><FiPackage /></div>
                <div><div className="stat-value">{orders.length}</div><div className="stat-label">Orders</div></div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}><FiTruck /></div>
                <div><div className="stat-value">{shipments.length}</div><div className="stat-label">Shipments</div></div>
              </div>
            </>
          )}
          {user.role === 'transporter' && (
            <>
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(108, 60, 225, 0.15)', color: 'var(--primary-light)' }}><FiTruck /></div>
                <div><div className="stat-value">{shipments.length}</div><div className="stat-label">Accepted Jobs</div></div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}><FiPackage /></div>
                <div><div className="stat-value">{shipments.filter(s => s.status === 'delivered').length}</div><div className="stat-label">Delivered</div></div>
              </div>
            </>
          )}
          {user.role === 'customer' && (
            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(108, 60, 225, 0.15)', color: 'var(--primary-light)' }}><FiPackage /></div>
              <div><div className="stat-value">{orders.length}</div><div className="stat-label">My Orders</div></div>
            </div>
          )}
        </div>

        <div className="dashboard-grid">
          <div>
            {/* Seller: Products */}
            {user.role === 'seller' && (
              <div className="glass-card dash-section">
                <div className="dash-section-title">
                  <span>My Products</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddProduct(!showAddProduct)}>
                    <FiPlus /> Add Product
                  </button>
                </div>

                {showAddProduct && (
                  <form onSubmit={handleAddProduct} style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input className="form-input" placeholder="Product name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                          <option>Electronics</option><option>Groceries</option><option>Fashion</option>
                          <option>Biscuits & Snacks</option><option>Home & Kitchen</option><option>Books</option>
                          <option>Sports</option><option>Health</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows="2" placeholder="Product description..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input type="number" className="form-input" placeholder="999" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-input" placeholder="50" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL (optional)</label>
                      <input className="form-input" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Product</button>
                  </form>
                )}

                {products.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">📦</div><h3>No products yet</h3><p>Add your first product to start selling</p></div>
                ) : (
                  products.map(p => (
                    <div key={p._id} className="glass-card shipment-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category} • Stock: {p.stock}</div>
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{p.price}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Orders */}
            <div className="glass-card dash-section">
              <div className="dash-section-title"><span>{user.role === 'seller' ? 'Orders Received' : 'My Orders'}</span></div>
              {orders.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📋</div><h3>No orders yet</h3></div>
              ) : (
                orders.map(o => (
                  <div key={o._id} className="glass-card shipment-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{o.items?.length} item(s)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`badge badge-${statusColor(o.status)}`}>{o.status}</span>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--accent)' }}>₹{o.totalAmount}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Seller: Create Shipment */}
            {user.role === 'seller' && (
              <div className="glass-card dash-section">
                <div className="dash-section-title"><span>🚚 Ship a Product</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Post a shipment request and transporters in {user.city} will be notified.
                </p>
                {!showCreateShipment ? (
                  <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => setShowCreateShipment(true)}>
                    <FiTruck /> Create Shipment Request
                  </button>
                ) : (
                  <form onSubmit={handleCreateShipment}>
                    <div className="form-group">
                      <label className="form-label">From</label>
                      <input className="form-input" value={user.city} disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Destination City</label>
                      <input className="form-input" placeholder="e.g. Delhi" value={shipmentForm.destinationCity} onChange={e => setShipmentForm({...shipmentForm, destinationCity: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Weight (approx)</label>
                      <input className="form-input" placeholder="e.g. 50 kg" value={shipmentForm.weight} onChange={e => setShipmentForm({...shipmentForm, weight: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Product Description</label>
                      <textarea className="form-input" rows="2" placeholder="What are you shipping?" value={shipmentForm.productDescription} onChange={e => setShipmentForm({...shipmentForm, productDescription: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>Post Shipment</button>
                  </form>
                )}
              </div>
            )}

            {/* Shipments sidebar */}
            <div className="glass-card dash-section">
              <div className="dash-section-title">
                <span>My Shipments</span>
                <Link to="/shipments" style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>View All <FiArrowRight /></Link>
              </div>
              {shipments.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}><div className="empty-icon">🚛</div><p>No shipments yet</p></div>
              ) : (
                shipments.slice(0, 5).map(s => (
                  <div key={s._id} className="glass-card shipment-card">
                    <div className="shipment-route">
                      <span className="shipment-city"><FiMapPin size={12} /> {s.sourceCity}</span>
                      <span className="shipment-arrow">→</span>
                      <span className="shipment-city">{s.destinationCity}</span>
                    </div>
                    <span className={`badge badge-${statusColor(s.status)}`}>{s.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Transporter: Find Loads */}
            {user.role === 'transporter' && (
              <div className="glass-card dash-section">
                <div className="dash-section-title"><span>🔍 Find Loads</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Browse shipment requests from sellers in {user.city}.
                </p>
                <Link to="/shipments" className="btn btn-primary" style={{ width: '100%' }}>
                  <FiTruck /> Browse Shipment Board
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
