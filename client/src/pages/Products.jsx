import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShoppingCart } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const categories = ['All', 'Electronics', 'Groceries', 'Fashion', 'Biscuits & Snacks', 'Home & Kitchen', 'Books', 'Sports', 'Health'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await API.get('/products', { params });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getCategoryEmoji = (cat) => {
    const map = { 'Electronics': '📱', 'Groceries': '🛒', 'Fashion': '👗', 'Biscuits & Snacks': '🍪', 'Home & Kitchen': '🏠', 'Books': '📚', 'Sports': '⚽', 'Health': '💊' };
    return map[cat] || '📦';
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h2 className="section-title">Explore Products</h2>
          <p className="section-subtitle" style={{ margin: 0 }}>Browse products from all shops across cities</p>
        </div>

        <div className="products-header">
          <div className="products-filters">
            {categories.map(cat => (
              <button key={cat} className={`filter-chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
                {cat !== 'All' && getCategoryEmoji(cat)} {cat}
              </button>
            ))}
          </div>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="glass-card product-card">
                <div className="product-card-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    getCategoryEmoji(product.category)
                  )}
                  <span className="product-badge badge badge-primary">{product.category}</span>
                </div>
                <div className="product-card-body">
                  <div className="product-card-seller">
                    {product.seller?.shopName || product.seller?.name || 'Unknown Seller'}
                  </div>
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-price">₹{product.price?.toLocaleString()}</div>
                  <div className="product-card-footer">
                    <div className="product-card-city">
                      <FiMapPin size={12} /> {product.city}
                    </div>
                    <button className="product-card-btn" onClick={(e) => handleAddToCart(e, product)}>
                      <FiShoppingCart size={14} /> Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
