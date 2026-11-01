import { useEffect, useRef } from 'react';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useCart } from '../../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isOpen, closeCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isAuthenticated || !isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 z-50 shadow-2xl flex flex-col animate-slide-up" style={{animation: 'slideRight 0.3s ease-out'}}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Shopping Cart ({cart.totalItems})</h2>
          <button onClick={closeCart} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
            <FiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <FiShoppingBag size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">Add some products to get started</p>
              <button onClick={closeCart} className="btn-primary mt-6 text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                  {item.productImageUrl ? (
                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <FiShoppingBag size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                  <p className="text-primary-400 font-bold text-sm">₹{item.unitPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-all"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-all disabled:opacity-40"
                    >
                      <FiPlus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-xl font-bold text-white">₹{cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="text-xs text-slate-500 text-center">Free shipping on all orders</div>
            <button onClick={handleCheckout} className="btn-primary w-full">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
