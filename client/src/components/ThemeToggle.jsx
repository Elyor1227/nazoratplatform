import { useTheme } from '../context/ThemeContext.jsx';

/** Kun (light) / Tun (dark) rejimini almashtirish */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${className} ${
        isDark
          ? 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
          : 'border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
      }`}
      title={isDark ? 'Kun rejimiga o‘tish' : 'Tun rejimiga o‘tish'}
      aria-label={isDark ? 'Kun rejimi' : 'Tun rejimi'}
    >
      <span aria-hidden>{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Kun' : 'Tun'}</span>
    </button>
  );
}
