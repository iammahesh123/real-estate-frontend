import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await login(email, password);

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // Default redirect based on highest role
      if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.roles.includes('ROLE_AGENT')) {
        navigate('/agent/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
              E
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Estate<span className="text-amber-600">Hub</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Access your personalized client dashboard, saved searches &amp; site visit pipeline.
          </p>
        </div>

        {/* Demo Quick Select */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
          <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2">
            Quick-Fill Seed Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@realestate.com')}
              className="px-2 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-lg text-xs font-bold text-slate-800 transition"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('agent1@realestate.com')}
              className="px-2 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-lg text-xs font-bold text-slate-800 transition"
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer@realestate.com')}
              className="px-2 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-lg text-xs font-bold text-slate-800 transition"
            >
              Customer
            </button>
          </div>

        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3.5 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-amber-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
