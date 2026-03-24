import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer', city: '', phone: '', shopName: '', shopCategory: '', vehicleType: '', vehicleCapacity: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card" style={{ maxWidth: '540px' }}>
        <h2 className="auth-title">Join ShipConnect</h2>
        <p className="auth-subtitle">Create your account and start today</p>

        <form onSubmit={handleSubmit}>
          <label className="form-label">I am a...</label>
          <div className="role-selector">
            <div className={`role-option ${form.role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>
              <div className="role-icon">🛒</div>
              Customer
            </div>
            <div className={`role-option ${form.role === 'seller' ? 'active' : ''}`} onClick={() => setRole('seller')}>
              <div className="role-icon">🏪</div>
              Seller
            </div>
            <div className={`role-option ${form.role === 'transporter' ? 'active' : ''}`} onClick={() => setRole('transporter')}>
              <div className="role-icon">🚛</div>
              Transporter
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" placeholder="Mumbai" value={form.city} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength="6" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          {form.role === 'seller' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input type="text" name="shopName" className="form-input" placeholder="My Awesome Shop" value={form.shopName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Category</label>
                <select name="shopCategory" className="form-select" value={form.shopCategory} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Biscuits & Snacks">Biscuits & Snacks</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {form.role === 'transporter' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select name="vehicleType" className="form-select" value={form.vehicleType} onChange={handleChange}>
                  <option value="">Select vehicle</option>
                  <option value="Bike">Bike</option>
                  <option value="Auto">Auto</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Truck">Truck</option>
                  <option value="Tempo">Tempo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Capacity</label>
                <input type="text" name="vehicleCapacity" className="form-input" placeholder="e.g. 500 kg" value={form.vehicleCapacity} onChange={handleChange} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
