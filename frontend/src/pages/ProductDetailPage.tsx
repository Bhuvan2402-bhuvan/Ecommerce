import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { FiShoppingCart, FiArrowLeft, FiPackage, FiCheck, FiTag } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.getById(Number(id))
      .then(r => { if (r.success) setProduct(r.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    setAdding(true);
    const ok = await addToCart(product.id, quantity);
    setAdding(false);
    if (ok) { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 page-container">
        <div className="grid md:grid-cols-2 gap-10 py-8">
          <div className="h-96 bg-slate-800 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <FiPackage size={64} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white">Products</Link>
          {product.categoryName && <><span>/</span><Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-white">{product.categoryName}</Link></>}
          <span>/</span>
          <span className="text-white truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage size={80} className="text-slate-600" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.categoryName && (
              <Link to={`/products?categoryId=${product.categoryId}`}
                className="inline-flex items-center gap-1 text-primary-400 text-sm font-medium hover:text-primary-300">
                <FiTag size={14} />
                {product.categoryName}
              </Link>
            )}

            <h1 className="text-3xl font-bold text-white leading-tight">{product.name}</h1>

            {product.brand && <p className="text-slate-400">by <span className="text-white font-medium">{product.brand}</span></p>}

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</span>
              {product.featured && (
                <span className="badge-warning">Featured</span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 text-sm font-medium ${product.inStock ? 'text-emerald-400' : 'text-red-400'}`}>
              {product.inStock ? (
                <>
                  <FiCheck size={16} />
                  {product.stockQuantity <= 5 ? `Only ${product.stockQuantity} left in stock!` : `In Stock (${product.stockQuantity} available)`}
                </>
              ) : (
                'Out of Stock'
              )}
            </div>

            {product.description && (
              <p className="text-slate-400 leading-relaxed border-t border-slate-800 pt-4">{product.description}</p>
            )}

            {product.sku && <p className="text-slate-500 text-sm">SKU: {product.sku}</p>}

            {/* Add to Cart */}
            {product.inStock && (
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3">
                  <label className="label">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                    >-</button>
                    <span className="w-10 text-center font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
                    >+</button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={adding || added}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  {added ? (
                    <><FiCheck size={18} /> Added to Cart!</>
                  ) : (
                    <><FiShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}</>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
              {[
                { label: 'Free Shipping', sub: 'On all orders' },
                { label: 'Secure Payment', sub: 'SSL protected' },
                { label: '30-day Returns', sub: 'Hassle-free' },
                { label: '24/7 Support', sub: 'Always available' },
              ].map(({ label, sub }) => (
                <div key={label} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/products" className="btn-ghost flex items-center gap-2 w-fit">
            <FiArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
