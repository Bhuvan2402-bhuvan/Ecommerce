import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setLoading(true);
    try {
      const res = await authApi.login(form);
      if (res.success) {
        setAuth(res.data);
        toast.success(`Welcome back, ${res.data.firstName}!`);
        navigate(res.data.role === 'ADMIN' ? '/admin' : '/');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
              <FiLock size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-1 text-sm">Sign in to your ShopSphere account</p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6 text-sm">
            <p className="text-primary-300 font-medium mb-1">Demo Credentials:</p>
            <p className="text-slate-400">Admin: <span className="text-white">admin@shopsphere.com</span> / <span className="text-white">Admin@123456</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="Your password"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            New to ShopSphere?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
