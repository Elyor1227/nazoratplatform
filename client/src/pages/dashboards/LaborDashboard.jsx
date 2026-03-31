import { useEffect, useState } from 'react';
import api from '../../api.js';
import AppShell from '../../components/AppShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LaborDashboard() {
  const { socket } = useAuth();
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  async function load() {
    const [s, a] = await Promise.all([api.get('/dashboard/summary'), api.get('/alerts')]);
    setSummary(s.data);
    setAlerts(a.data.alerts || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (payload) => {
      setToast(payload.alert?.message || 'Yangi signal');
      setAlerts((prev) => [payload.alert, ...prev].filter(Boolean));
    };
    socket.on('alert:new', onNew);
    return () => socket.off('alert:new', onNew);
  }, [socket]);

  async function ack(id) {
    await api.patch(`/alerts/${id}/ack`);
    setAlerts((prev) => prev.map((x) => (x._id === id ? { ...x, acknowledged: true } : x)));
  }

  return (
    <AppShell title="Mehnat inspeksiyasi">
      {toast && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {toast}
        </div>
      )}
      {summary?.stats && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">“Nol” xodim signallari</p>
            <p className="mt-1 font-display text-3xl font-bold text-red-400">{summary.stats.zeroAlerts}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Shartnomasi bor, xodim 0 (hisobotlar)</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              {summary.stats.zeroEmployeeReports}
            </p>
          </div>
        </div>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold text-white">Bandlik monitoringi</h2>
        <ul className="mt-4 space-y-3">
          {alerts.map((a) => (
            <li
              key={a._id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-4"
            >
              <div>
                <p className="text-white">{a.message}</p>
                <p className="mt-1 text-xs text-slate-500">{a.type}</p>
              </div>
              {!a.acknowledged && (
                <button
                  type="button"
                  onClick={() => ack(a._id)}
                  className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/15"
                >
                  Qabul qilindi
                </button>
              )}
            </li>
          ))}
          {alerts.length === 0 && <li className="text-slate-500">Hozircha alert yo‘q.</li>}
        </ul>
      </section>
    </AppShell>
  );
}
