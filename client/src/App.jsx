import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Cart from './pages/Cart';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1A1A2E',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                },
              }}
            />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shipments" element={<Shipments />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
