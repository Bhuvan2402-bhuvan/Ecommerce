import type { Product } from '../../types';
import { FiShoppingCart, FiStar, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product.id);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 bg-slate-800 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage size={40} className="text-slate-600" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.featured && (
              <span className="badge-warning flex items-center gap-1">
                <FiStar size={10} /> Featured
              </span>
            )}
            {!product.inStock && (
              <span className="badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Quick Add Overlay */}
          {product.inStock && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <FiShoppingCart size={14} />
                {adding ? 'Adding...' : 'Quick Add'}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {product.categoryName && (
            <p className="text-xs text-primary-400 font-medium mb-1">{product.categoryName}</p>
          )}
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-slate-500 text-xs mb-2">{product.brand}</p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</span>
            {product.inStock ? (
              <button
                onClick={handleAdd}
                disabled={adding}
                className="p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-70"
              >
                <FiShoppingCart size={16} />
              </button>
            ) : (
              <span className="text-sm text-slate-500">Unavailable</span>
            )}
          </div>

          {product.inStock && product.stockQuantity <= 5 && (
            <p className="text-amber-400 text-xs mt-2">Only {product.stockQuantity} left!</p>
          )}
        </div>
      </div>
    </Link>
  );
}
