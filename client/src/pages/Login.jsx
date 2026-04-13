import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ROLE_HOME = {
  construction_company: '/app/company',
  gasn: '/app/gasn',
  tax_inspection: '/app/tax',
  labor_inspection: '/app/labor',
};

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate(ROLE_HOME[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Kirish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-2xl dark:backdrop-blur">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Tizimga kirish</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">JWT va rol asosida kirish (RBAC)</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-500 disabled:opacity-50"
          >
            {loading ? '...' : 'Kirish'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-500">
          <Link to="/" className="text-brand-600 hover:underline dark:text-brand-400">
            Bosh sahifa
          </Link>
        </p>
      </div>
    </div>
  );
}
