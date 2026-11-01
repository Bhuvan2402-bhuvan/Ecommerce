import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-24">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-lg font-bold text-gradient">ShopSphere</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for premium products. Quality, convenience, and trust — all in one place.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors"><FiGithub size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors"><FiInstagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-slate-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?featured=true" className="text-slate-400 hover:text-white transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 ShopSphere. Built with Spring Boot & React.</p>
          <p className="text-slate-600 text-xs">College Project Demo</p>
        </div>
      </div>
    </footer>
  );
}
