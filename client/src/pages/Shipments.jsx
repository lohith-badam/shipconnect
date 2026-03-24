import { useState, useEffect } from 'react';
import { FiMapPin, FiPackage, FiClock, FiMessageCircle, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Chat from './Chat';

export default function Shipments() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('board');
  const [chatShipment, setChatShipment] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      if (user.role === 'transporter') {
        const [boardRes, myRes] = await Promise.all([
          API.get(`/shipments/city/${user.city}`),
          API.get('/shipments/my')
        ]);
        setShipments(boardRes.data);
        setMyShipments(myRes.data);
      } else {
        const [pendingRes, myRes] = await Promise.all([
          API.get('/shipments/pending'),
          API.get('/shipments/my')
        ]);
        setShipments(pendingRes.data);
        setMyShipments(myRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (shipmentId) => {
    try {
      await API.put(`/shipments/${shipmentId}/match`);
      toast.success('Shipment accepted! The seller has been notified.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const statusColor = (s) => {
    const map = { pending: 'warning', matched: 'success', in_transit: 'info', delivered: 'success' };
    return map[s] || 'primary';
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (chatShipment) {
    return <Chat shipment={chatShipment} onBack={() => setChatShipment(null)} />;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h2 className="section-title">🚛 Shipment Board</h2>
          <p className="section-subtitle" style={{ margin: 0 }}>
            {user?.role === 'transporter' ? 'Find shipments in your city and accept jobs' : 'View and manage shipment requests'}
          </p>
        </div>

        <div className="products-filters" style={{ marginBottom: '24px' }}>
          <button className={`filter-chip ${tab === 'board' ? 'active' : ''}`} onClick={() => setTab('board')}>
            📋 {user?.role === 'transporter' ? 'Available in ' + user?.city : 'All Shipments'}
          </button>
          <button className={`filter-chip ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>
            📦 My Shipments ({myShipments.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : tab === 'board' ? (
          shipments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚛</div>
              <h3>No pending shipments</h3>
              <p>{user?.role === 'transporter' ? 'No shipments available in your city right now' : 'No pending shipment requests'}</p>
            </div>
          ) : (
            <div className="grid-2">
              {shipments.map(s => (
                <div key={s._id} className="glass-card shipment-card">
                  <div className="shipment-route">
                    <span className="shipment-city"><FiMapPin size={14} /> {s.sourceCity}</span>
                    <span className="shipment-arrow">→</span>
                    <span className="shipment-city">{s.destinationCity}</span>
                  </div>
                  <div style={{ marginBottom: '8px', fontWeight: 500 }}>{s.productDescription}</div>
                  <div className="shipment-details">
                    {s.weight && <span><FiPackage size={12} /> {s.weight}</span>}
                    <span><FiClock size={12} /> {timeAgo(s.createdAt)}</span>
                    <span>🏪 {s.seller?.shopName || s.seller?.name}</span>
                  </div>
                  <div className="shipment-actions">
                    <span className={`badge badge-${statusColor(s.status)}`}>{s.status}</span>
                    {user?.role === 'transporter' && s.status === 'pending' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(s._id)}>
                        <FiCheck /> Accept Shipment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          myShipments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No shipments yet</h3>
            </div>
          ) : (
            <div className="grid-2">
              {myShipments.map(s => (
                <div key={s._id} className="glass-card shipment-card">
                  <div className="shipment-route">
                    <span className="shipment-city"><FiMapPin size={14} /> {s.sourceCity}</span>
                    <span className="shipment-arrow">→</span>
                    <span className="shipment-city">{s.destinationCity}</span>
                  </div>
                  <div style={{ marginBottom: '8px', fontWeight: 500 }}>{s.productDescription}</div>
                  <div className="shipment-details">
                    {s.weight && <span><FiPackage size={12} /> {s.weight}</span>}
                    <span><FiClock size={12} /> {timeAgo(s.createdAt)}</span>
                  </div>
                  <div className="shipment-actions">
                    <span className={`badge badge-${statusColor(s.status)}`}>{s.status}</span>
                    {s.status === 'matched' && (
                      <button className="btn btn-outline btn-sm" onClick={() => setChatShipment(s)}>
                        <FiMessageCircle /> Chat
                      </button>
                    )}
                  </div>
                  {s.matchedTransporter && (
                    <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      🚛 Transporter: <strong>{s.matchedTransporter.name}</strong> • {s.matchedTransporter.phone || 'No phone'} • {s.matchedTransporter.vehicleType || ''}
                    </div>
                  )}
                  {s.seller && user?.role === 'transporter' && (
                    <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      🏪 Seller: <strong>{s.seller.shopName || s.seller.name}</strong> • {s.seller.phone || 'No phone'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
