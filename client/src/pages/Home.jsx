import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShoppingBag, FiUsers, FiMapPin, FiPackage, FiZap, FiShield, FiGlobe } from 'react-icons/fi';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-tag">🚀 India's Smartest Marketplace</div>
              <h1 className="hero-title">
                Buy, Sell &<br />
                <span className="highlight">Ship Anything</span><br />
                <span className="accent-highlight">Anywhere.</span>
              </h1>
              <p className="hero-description">
                The multi-vendor marketplace connecting every shop in your city with smart transport matching.
                Post products, find transporters, and ship seamlessly — all in one platform.
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Explore Products <FiArrowRight />
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Start Selling
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">10K+</div>
                  <div className="hero-stat-label">Active Shops</div>
                </div>
                <div>
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Products</div>
                </div>
                <div>
                  <div className="hero-stat-value">5K+</div>
                  <div className="hero-stat-label">Transporters</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card-stack">
                <div className="hero-float-card">
                  <div className="card-header">
                    <div className="card-icon" style={{ background: 'rgba(108, 60, 225, 0.15)', color: 'var(--primary-light)' }}>
                      <FiShoppingBag />
                    </div>
                    <div>
                      <div className="card-title">New Order Received!</div>
                      <div className="card-subtitle">Rajesh Electronics • Mumbai</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    5x Wireless Headphones — ₹12,500
                  </div>
                </div>

                <div className="hero-float-card">
                  <div className="card-header">
                    <div className="card-icon" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--accent)' }}>
                      <FiTruck />
                    </div>
                    <div>
                      <div className="card-title">Transport Match Found!</div>
                      <div className="card-subtitle">Mumbai → Delhi</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                    ✅ Transporter Vikram accepted your shipment
                  </div>
                </div>

                <div className="hero-float-card">
                  <div className="card-header">
                    <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                      <FiPackage />
                    </div>
                    <div>
                      <div className="card-title">Package Delivered! 🎉</div>
                      <div className="card-subtitle">Chennai → Bangalore</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Delivered in 18 hours — 4.8★ rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✨ Why ShipConnect</div>
            <h2 className="section-title">Everything You Need in One Place</h2>
            <p className="section-subtitle">From product listing to delivery — we've reimagined how local commerce works.</p>
          </div>
          <div className="grid-4">
            <div className="glass-card feature-card">
              <div className="feature-icon purple"><FiGlobe /></div>
              <h3>Multi-Vendor Market</h3>
              <p>Any shop in any city can list products. Electronics, groceries, clothing, biscuits — everything in one marketplace.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon orange"><FiTruck /></div>
              <h3>Smart Transport Match</h3>
              <p>Post a shipment and instantly connect with transporters heading the same route. No more searching for logistics.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon green"><FiZap /></div>
              <h3>Real-Time Notifications</h3>
              <p>Get instant alerts when a transporter matches your route or when you receive new orders.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon blue"><FiShield /></div>
              <h3>Direct Communication</h3>
              <p>Chat directly with transporters to finalize details, negotiate pricing, and track shipments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🔄 How It Works</div>
            <h2 className="section-title">Ship in 4 Simple Steps</h2>
            <p className="section-subtitle">Our transport matching makes shipping effortless for everyone.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>List Your Products</h3>
              <p>Register as a seller, add your shop details, and list products with photos and prices.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Post Shipment</h3>
              <p>When an order is ready, post a shipment request with source and destination city.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Matched</h3>
              <p>Transporters in your city see your request. They accept and you get notified instantly.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Ship & Deliver</h3>
              <p>Chat with the transporter, finalize details, and your product gets delivered!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Ready to Get Started?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.05rem' }}>
              Join thousands of shops and transporters already on ShipConnect.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Account <FiArrowRight /></Link>
              <Link to="/products" className="btn btn-outline btn-lg">Browse Products</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
