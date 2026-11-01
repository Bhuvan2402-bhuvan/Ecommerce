import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api';
import type { CheckoutForm } from '../types';
import { FiShoppingCart, FiLock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const defaultForm: CheckoutForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '', zipCode: '', country: 'India', notes: ''
};

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutForm>({ ...defaultForm, firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/products');
      toast.error('Your cart is empty');
    }
  }, []);

  const validate = () => {
    const e: Partial<CheckoutForm> = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.zipCode) e.zipCode = 'Required';
    if (!form.country) e.country = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await ordersApi.checkout(form);
      if (res.success) {
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${res.data.id}`, { state: { order: res.data, success: true } });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const FormField = ({ label, k, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="label">{label}</label>
      <input type={type} value={form[k as keyof CheckoutForm] || ''} onChange={set(k)}
        placeholder={placeholder}
        className={`input ${(errors as any)[k] ? 'border-red-500' : ''}`} />
      {(errors as any)[k] && <p className="text-red-400 text-xs mt-1">{(errors as any)[k]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <FiLock className="text-primary-400" size={28} /> Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-6">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name *" k="firstName" placeholder="John" />
                  <FormField label="Last Name *" k="lastName" placeholder="Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField label="Email *" k="email" type="email" placeholder="john@example.com" />
                  <FormField label="Phone" k="phone" placeholder="+91 9876543210" />
                </div>
                <div className="mt-4">
                  <FormField label="Street Address *" k="address" placeholder="123 Main Street, Apt 4B" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField label="City *" k="city" placeholder="Mumbai" />
                  <FormField label="State *" k="state" placeholder="Maharashtra" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField label="ZIP Code *" k="zipCode" placeholder="400001" />
                  <div>
                    <label className="label">Country *</label>
                    <select value={form.country} onChange={set('country')} className="input">
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label">Order Notes (optional)</label>
                  <textarea value={form.notes || ''} onChange={set('notes')} rows={3}
                    className="input resize-none" placeholder="Any special instructions..." />
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-slate-800/60 border border-primary-500/30 rounded-xl">
                  <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Cash on Delivery</p>
                    <p className="text-slate-400 text-sm">Pay when your order arrives</p>
                  </div>
                  <FiCheck className="ml-auto text-primary-400" size={18} />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FiShoppingCart size={18} /> Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {item.productImageUrl && <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.productName}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-white">₹{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span>₹{cart.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-lg">
                    <span>Total</span>
                    <span>₹{cart.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2">
                  <FiLock size={16} />
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-center text-slate-500 text-xs mt-3">
                  🔒 Your data is protected with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
