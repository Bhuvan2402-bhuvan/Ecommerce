import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ordersApi } from '../api';
import type { Order } from '../types';
import { FiPackage, FiCheck, FiTruck, FiClock, FiArrowLeft } from 'react-icons/fi';

const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      ordersApi.getMyOrder(Number(id))
        .then(r => { if (r.success) setOrder(r.data); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!order) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-slate-400">Order not found</p></div>;
  }

  const stepIdx = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        {/* Success Banner */}
        {location.state?.success && (
          <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <FiCheck size={22} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-400">Order Placed Successfully! 🎉</h2>
              <p className="text-slate-400 text-sm">Thank you for your purchase. You'll receive a confirmation soon.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="btn-ghost flex items-center gap-2">
            <FiArrowLeft size={16} /> Back to Orders
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={`badge text-sm px-4 py-2 ${
                  order.status === 'DELIVERED' ? 'badge-success' :
                  order.status === 'CANCELLED' ? 'badge-danger' :
                  order.status === 'SHIPPED' ? 'badge-purple' : 'badge-warning'
                }`}>{order.status}</span>
              </div>

              {/* Progress Tracker */}
              {!isCancelled && (
                <div className="mt-6">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-800" />
                    <div
                      className="absolute left-0 top-4 h-0.5 bg-primary-500 transition-all duration-500"
                      style={{ width: stepIdx >= 0 ? `${(stepIdx / (statusSteps.length - 1)) * 100}%` : '0%' }}
                    />
                    {statusSteps.map((step, i) => {
                      const done = i <= stepIdx;
                      const current = i === stepIdx;
                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            done ? 'bg-primary-600 border-primary-500' : 'bg-slate-900 border-slate-700'
                          } ${current ? 'ring-4 ring-primary-500/20' : ''}`}>
                            {done ? <FiCheck size={14} className="text-white" /> : <span className="w-2 h-2 rounded-full bg-slate-600" />}
                          </div>
                          <p className={`text-xs mt-2 font-medium ${done ? 'text-primary-400' : 'text-slate-600'}`}>
                            {step.charAt(0) + step.slice(1).toLowerCase()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="card">
              <h2 className="font-bold text-white mb-4">Items Ordered</h2>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-700">
                      {item.productImageUrl && <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-slate-400 text-sm">₹{item.unitPrice.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <span className="text-white font-bold">₹{item.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2"><FiTruck size={18} /> Shipping Address</h2>
              <div className="text-slate-300 space-y-1">
                <p className="font-medium">{order.shippingFirstName} {order.shippingLastName}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingState} - {order.shippingZipCode}</p>
                <p>{order.shippingCountry}</p>
                {order.shippingPhone && <p>{order.shippingPhone}</p>}
                <p className="text-slate-400">{order.shippingEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card h-fit sticky top-24">
            <h2 className="font-bold text-white mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span><span className="text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-3 text-base">
                <span>Total</span><span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800/60 rounded-xl">
              <p className="text-slate-400 text-sm">Payment Method</p>
              <p className="text-white font-medium">{order.paymentMethod.replace('_', ' ')}</p>
              <p className={`text-sm mt-1 ${order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {order.paymentStatus}
              </p>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-slate-800/60 rounded-xl">
                <p className="text-slate-400 text-xs">Notes</p>
                <p className="text-white text-sm mt-1">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
