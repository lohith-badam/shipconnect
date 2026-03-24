import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-brand">
              <div className="logo-icon">🚀</div>
              <span>ShipConnect</span>
            </Link>
            <p>The multi-vendor marketplace that connects shops with transporters. Buy, sell, and ship — all in one place.</p>
          </div>
          <div className="footer-col">
            <h4>Marketplace</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Groceries">Groceries</Link></li>
              <li><Link to="/products?category=Fashion">Fashion</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Transport</h4>
            <ul>
              <li><Link to="/shipments">Shipment Board</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/register">Become a Transporter</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ShipConnect. All rights reserved. Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
