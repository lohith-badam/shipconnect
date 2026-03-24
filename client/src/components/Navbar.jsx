import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiShoppingCart, FiMenu, FiX, FiLogOut, FiUser, FiPackage, FiTruck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { unreadCount } = useSocket();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setShowNotifs(false); setShowUserMenu(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const roleIcon = user?.role === 'seller' ? '🏪' : user?.role === 'transporter' ? '🚛' : '👤';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="nav-brand">
          <div className="logo-icon">🚀</div>
          <span>ShipConnect</span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link></li>
          <li><Link to="/shipments" className={location.pathname === '/shipments' ? 'active' : ''}>Shipments</Link></li>
          {user && <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>}
        </ul>

        <div className="nav-actions">
          {user && (
            <>
              <div className="nav-notification" onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}>
                <FiBell />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </div>
              <Link to="/cart" className="nav-notification nav-cart">
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <div className="nav-user" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}>
                <div className="nav-user-avatar">{roleIcon}</div>
                <span style={{ fontSize: '0.85rem' }}>{user.name?.split(' ')[0]}</span>
              </div>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {showUserMenu && user && (
        <div className="notification-panel" style={{ width: '220px' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role} • {user.city}</div>
          </div>
          <Link to="/dashboard" className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUser /> Dashboard
          </Link>
          {user.role === 'seller' && (
            <Link to="/dashboard" className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiPackage /> My Products
            </Link>
          )}
          {user.role === 'transporter' && (
            <Link to="/shipments" className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiTruck /> Shipment Board
            </Link>
          )}
          <div className="notification-item" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)' }}>
            <FiLogOut /> Logout
          </div>
        </div>
      )}
    </nav>
  );
}
