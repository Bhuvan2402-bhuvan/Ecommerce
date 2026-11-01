import { useState, useEffect } from 'react';
import { ordersApi, userApi } from '../api';
import type { Order, User } from '../types';
import { Link } from 'react-router-dom';
import { FiPackage, FiUser, FiShoppingBag, FiEdit, FiCheck, FiClock, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const statusBadge: Record<string, string> = {
  PENDING: 'badge-warning',
  CONFIRMED: 'badge-info',
  PROCESSING: 'badge-info',
  SHIPPED: 'badge-purple',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
  REFUNDED: 'badge-danger',
};

const statusIcon: Record<string, any> = {
  PENDING: FiClock,
  CONFIRMED: FiCheck,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  DELIVERED: FiCheck,
  CANCELLED: FiPackage,
};

export default function DashboardPage() {
  const [tab, setTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      ordersApi.getMyOrders(),
      userApi.getMe(),
    ]).then(([ordRes, userRes]) => {
      if (ordRes.success) setOrders(ordRes.data);
      if (userRes.success) {
        setProfile(userRes.data);
        setProfileForm(userRes.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await userApi.updateMe(profileForm);
      if (res.success) {
        setProfile(res.data);
        setEditingProfile(false);
        toast.success('Profile updated!');
      }
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-slate-400 mt-1">Manage your orders and profile</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <FiUser size={22} className="text-white" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800">
          {[
            { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
            { id: 'profile', label: 'Profile', icon: FiUser },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={16} /> {label}
              {id === 'orders' && orders.length > 0 && (
                <span className="badge-info py-0 px-1.5 text-xs">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : tab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <FiShoppingBag size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No orders yet</p>
                <Link to="/products" className="btn-primary mt-4">Start Shopping</Link>
              </div>
            ) : (
              orders.map(order => {
                const StatusIcon = statusIcon[order.status] || FiPackage;
                return (
                  <Link key={order.id} to={`/orders/${order.id}`}
                    className="card block hover:border-primary-500/30 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                          <StatusIcon size={18} className="text-primary-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{order.orderNumber}</p>
                          <p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={statusBadge[order.status] || 'badge-info'}>{order.status}</span>
                        <span className="text-white font-bold">₹{order.totalAmount.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm">{order.items.length} item(s)</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        ) : (
          /* Profile Tab */
          <div className="card max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Profile Information</h2>
              <button
                onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                disabled={saving}
                className={editingProfile ? 'btn-primary text-sm py-2' : 'btn-secondary text-sm py-2 flex items-center gap-2'}
              >
                {editingProfile ? (saving ? 'Saving...' : 'Save Changes') : <><FiEdit size={14} /> Edit</>}
              </button>
            </div>

            {profile && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'First Name', key: 'firstName' },
                  { label: 'Last Name', key: 'lastName' },
                  { label: 'Email', key: 'email', disabled: true },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Address', key: 'address' },
                  { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' },
                  { label: 'ZIP Code', key: 'zipCode' },
                  { label: 'Country', key: 'country' },
                ].map(({ label, key, disabled }) => (
                  <div key={key} className={key === 'address' ? 'col-span-2' : ''}>
                    <label className="label">{label}</label>
                    {editingProfile && !disabled ? (
                      <input
                        value={(profileForm as any)[key] || ''}
                        onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
                        className="input"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/50">
                        {(profile as any)[key] || <span className="text-slate-500 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
