import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';
import ProductCard from '../components/product/ProductCard';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getFeatured(),
      categoriesApi.getAll(),
    ]).then(([featRes, catRes]) => {
      if (featRes.success) setFeatured(featRes.data);
      if (catRes.success) setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              🛍️ Premium Shopping Experience
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Shop the <span className="text-gradient">Future</span>{' '}
              <br />of Retail
            </h1>

            <p className="text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
              Discover thousands of premium products across electronics, fashion, books, home & more.
              Fast delivery, secure payments, unbeatable prices.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <FiShoppingBag size={18} />
                Shop Now
                <FiArrowRight size={18} />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary text-base px-8 py-4">
                View Featured
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-slate-800">
              {[
                { val: '15+', label: 'Products' },
                { val: '6', label: 'Categories' },
                { val: '100%', label: 'Secure' },
                { val: '24/7', label: 'Support' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-gradient">{s.val}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-slate-900 border-y border-slate-800 py-6">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiTruck, label: 'Free Shipping', desc: 'On all orders' },
              { icon: FiShield, label: 'Secure Payment', desc: 'SSL encrypted' },
              { icon: FiRefreshCw, label: 'Easy Returns', desc: '30-day policy' },
              { icon: FiShoppingBag, label: 'Quality Products', desc: 'Curated selection' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-2">Browse by</p>
            <h2 className="section-title">Categories</h2>
          </div>
          <Link to="/products" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
            All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10"
              >
                <div className="h-28 relative">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-xs">{cat.name}</p>
                    <p className="text-slate-400 text-xs">{cat.productCount} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-16 page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-2">Handpicked for you</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No featured products yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            Explore All Products <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="page-container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900/50 to-indigo-900/50 border border-primary-500/20 p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start shopping?</h2>
          <p className="text-slate-400 mb-8 text-lg">Create an account and get access to exclusive deals and faster checkout.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-4">Create Account</Link>
            <Link to="/products" className="btn-secondary px-8 py-4">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
