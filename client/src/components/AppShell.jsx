import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const ROLE_HOME = {
  construction_company: '/app/company',
  gasn: '/app/gasn',
  tax_inspection: '/app/tax',
  labor_inspection: '/app/labor',
};

const ROLE_LABEL = {
  construction_company: 'Qurilish korxonasi',
  gasn: 'Davlat arxitektura-qurilish nazorat inspeksiyasi',
  tax_inspection: 'Soliq inspeksiyasi',
  labor_inspection: 'Mehnat inspeksiyasi',
};

export default function AppShell({ title, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link
              to={ROLE_HOME[user.role]}
              className="font-display text-lg font-semibold text-slate-900 dark:text-white"
            >
              QurilishNazorat
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-500">{ROLE_LABEL[user.role]}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-slate-600 dark:text-slate-400">{user.organizationName || user.email}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {title && (
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        )}
        <div className={title ? 'mt-8' : ''}>{children}</div>
      </main>
    </div>
  );
}
