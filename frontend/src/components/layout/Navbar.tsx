import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiSettings } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useCart } from '../../hooks/useCart';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
    setMenuOpen(false);
  };

  const cartCount = cart.totalItems || 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-slate-800' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gradient">ShopSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className={`text-sm font-medium transition-colors hover:text-primary-400 ${
              location.pathname === '/products' ? 'text-primary-400' : 'text-slate-300'
            }`}>Products</Link>
            <Link to="/products?featured=true" className="text-sm font-medium text-slate-300 hover:text-primary-400 transition-colors">
              Featured
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                <FiSettings size={14} /> Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/products" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <FiSearch size={20} />
            </Link>

            {isAuthenticated && (
              <button
                onClick={toggleCart}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                  <FiUser size={16} />
                  <span>{user?.firstName}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all">
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 p-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-white py-2">Products</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-amber-400">Admin Dashboard</Link>}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-white py-2">My Account</Link>
                  <button onClick={handleLogout} className="text-left text-red-400 py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
