import { useEffect, useState } from 'react';
import api from '../../api.js';
import AppShell from '../../components/AppShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TaxDashboard() {
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
    <AppShell title="Soliq inspeksiyasi">
      {toast && (
        <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">
          {toast}
        </div>
      )}
      {summary?.stats && (
        <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Ochiq ish haqi / shartnoma signallari</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">{summary.stats.payrollAlerts}</p>
        </div>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold text-white">Ish haqi fondi bo‘yicha alertlar</h2>
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
