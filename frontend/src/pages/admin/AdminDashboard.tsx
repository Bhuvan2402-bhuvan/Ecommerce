import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api';
import type { AdminStats, Product, Category, Order, User } from '../../types';
import { FiPackage, FiTag, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

type Tab = 'stats' | 'products' | 'categories' | 'orders' | 'customers';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const fetchStats = useCallback(async () => {
    try { const r = await adminApi.getStats(); if (r.success) setStats(r.data); } catch {}
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try { const r = await adminApi.getAllProducts(); if (r.success) setProducts(r.data); } catch {}
    finally { setLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try { const r = await adminApi.getAllCategories(); if (r.success) setCategories(r.data); } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const r = await adminApi.getAllOrders(); if (r.success) setOrders(r.data.content); } catch {}
    finally { setLoading(false); }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try { const r = await adminApi.getAllCustomers(); if (r.success) setCustomers(r.data); } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCategories();
    if (tab === 'products') fetchProducts();
    else if (tab === 'orders') fetchOrders();
    else if (tab === 'customers') fetchCustomers();
  }, [tab]);

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch { toast.error('Failed'); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
  };

  const handleOrderStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  const tabs = [
    { id: 'stats', label: 'Overview', icon: FiTrendingUp },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'categories', label: 'Categories', icon: FiTag },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'customers', label: 'Customers', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-950">
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your ShopSphere store</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
              ⚡ Admin Mode
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                tab === id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: FiDollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
                { label: 'Customers', value: stats.totalCustomers, icon: FiUsers, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                { label: 'Products', value: stats.totalProducts, icon: FiPackage, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`card border ${bg}`}>
                  <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center mb-3`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-slate-400 text-sm">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-amber-400' },
                { label: 'Processing', value: stats.processingOrders, color: 'text-blue-400' },
                { label: 'Delivered', value: stats.deliveredOrders, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card flex items-center gap-4">
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Products ({products.length})</h2>
              <button onClick={() => { setEditProduct(null); setShowProductModal(true); }} className="btn-primary flex items-center gap-2 text-sm py-2">
                <FiPlus size={16} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    {['Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map(p => (
                    <tr key={p.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl && <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div>
                            <p className="text-white text-sm font-medium">{p.name}</p>
                            {p.brand && <p className="text-slate-500 text-xs">{p.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{p.categoryName}</td>
                      <td className="px-4 py-3 text-white font-medium text-sm">₹{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={p.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={p.active ? 'badge-success' : 'badge-danger'}>{p.active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditProduct(p); setShowProductModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-all">
                            <FiEdit size={14} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Categories ({categories.length})</h2>
              <button onClick={() => { setEditCategory(null); setShowCategoryModal(true); }} className="btn-primary flex items-center gap-2 text-sm py-2">
                <FiPlus size={16} /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="card flex items-center gap-4">
                  {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} className="w-16 h-16 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{cat.name}</p>
                    <p className="text-slate-400 text-sm">{cat.productCount} products</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditCategory(cat); setShowCategoryModal(true); }}
                      className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-slate-800 rounded-lg">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">All Orders ({orders.length})</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                      <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map(order => (
                    <tr key={order.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-primary-400 font-medium text-sm">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{order.shippingFirstName} {order.shippingLastName}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{order.items.length}</td>
                      <td className="px-4 py-3 text-white font-medium text-sm">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          order.status === 'DELIVERED' ? 'badge-success' :
                          order.status === 'CANCELLED' ? 'badge-danger' :
                          order.status === 'SHIPPED' ? 'badge-purple' : 'badge-warning'
                        }`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatus(order.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500"
                        >
                          {['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && !loading && <p className="text-center text-slate-500 py-8">No orders yet</p>}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {tab === 'customers' && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Customers ({customers.length})</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Status', 'Joined'].map(h => (
                      <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.map(c => (
                    <tr key={c.id} className="bg-slate-900/50 hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-white text-sm font-medium">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{c.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{c.phone || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={c.enabled ? 'badge-success' : 'badge-danger'}>{c.enabled ? 'Active' : 'Disabled'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && !loading && <p className="text-center text-slate-500 py-8">No customers yet</p>}
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <ProductModal
            product={editProduct}
            categories={categories}
            onClose={() => setShowProductModal(false)}
            onSave={() => { setShowProductModal(false); fetchProducts(); fetchStats(); }}
          />
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <CategoryModal
            category={editCategory}
            onClose={() => setShowCategoryModal(false)}
            onSave={() => { setShowCategoryModal(false); fetchCategories(); fetchStats(); }}
          />
        )}
      </div>
    </div>
  );
}

// Product Modal
function ProductModal({ product, categories, onClose, onSave }: {
  product: Product | null; categories: Category[];
  onClose: () => void; onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stockQuantity: product?.stockQuantity ?? '',
    categoryId: product?.categoryId || (categories[0]?.id || ''),
    imageUrl: product?.imageUrl || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity), categoryId: Number(form.categoryId) };
      if (product) await adminApi.updateProduct(product.id, data as any);
      else await adminApi.createProduct(data as any);
      toast.success(product ? 'Product updated!' : 'Product created!');
      onSave();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><FiX size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Product Name *', k: 'name', placeholder: 'Enter product name' },
            { label: 'Image URL', k: 'imageUrl', placeholder: 'https://...' },
            { label: 'Brand', k: 'brand', placeholder: 'Brand name' },
            { label: 'SKU', k: 'sku', placeholder: 'PROD-001' },
          ].map(({ label, k, placeholder }) => (
            <div key={k}>
              <label className="label">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="input" placeholder={placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Category *</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: Number(e.target.value) }))} className="input">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input resize-none" rows={3} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="w-4 h-4 rounded" />
              <span className="text-slate-300 text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded" />
              <span className="text-slate-300 text-sm">Featured</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-800">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : (product ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Category Modal
function CategoryModal({ category, onClose, onSave }: {
  category: Category | null; onClose: () => void; onSave: () => void;
}) {
  const [form, setForm] = useState({ name: category?.name || '', description: category?.description || '', imageUrl: category?.imageUrl || '', active: category?.active ?? true });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (category) await adminApi.updateCategory(category.id, form);
      else await adminApi.createCategory(form);
      toast.success(category ? 'Category updated!' : 'Category created!');
      onSave();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><FiX size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" /></div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" rows={2} /></div>
          <div><label className="label">Image URL</label><input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="input" /></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4" />
            <span className="text-slate-300 text-sm">Active</span>
          </label>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-800">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : (category ? 'Update' : 'Create')}</button>
        </div>
      </div>
    </div>
  );
}
