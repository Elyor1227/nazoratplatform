import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api.js';
import { downloadBlob } from '../../utils/downloadBlob.js';
import {
  ORG_FULL_NAME,
  ORG_SHORT,
  kpiMain,
  obyektlarToifaBoYicha,
  faolObektlar,
  obektlar,
  taqqoslashData,
  hisobotRows,
  korxonaHujjatlari,
  ogohlar,
  kameraData,
  getBadgeClass,
  diffVal,
} from '../../data/gasnDashboardMock.js';

function downloadDemoHujjat(nom, faylNomi) {
  const blob = new Blob([`Demo fayl: ${nom}\n${faylNomi}`], { type: 'application/pdf' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = faylNomi.endsWith('.pdf') ? faylNomi : `${faylNomi}.pdf`;
  a.click();
  URL.revokeObjectURL(href);
}

/** Toifa bo‘yicha obyekt nomlari — gorizontal infografika (donut o‘rniga) */
function ToifaInfografika() {
  const maxLen = Math.max(...obyektlarToifaBoYicha.map((g) => g.obyektlar.length), 1);
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-white">Obyektlar toifasi bo‘yicha</div>
        <p className="text-[11px] text-[#7a8eaa] mt-0.5">
          Har bir qatorda toifa va unga tegishli obyekt nomlari ko‘rsatiladi (ko‘p qavatli uylar, o‘quv
          obyekti, maktablar, bog‘cha, tibbiyot, sport va boshqalar).
        </p>
      </div>
      {obyektlarToifaBoYicha.map((g) => {
        const ulush = Math.round((g.obyektlar.length / maxLen) * 100);
        return (
          <div key={g.toifa} className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-white">{g.toifa}</span>
              <span className="text-[10px] text-[#7a8eaa]">{g.obyektlar.length} ta obyekt</span>
            </div>
            <div className="h-2.5 rounded-full bg-[#1e293b] overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${ulush}%`, background: g.rang }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.obyektlar.map((n) => (
                <span
                  key={n}
                  className="inline-flex max-w-full truncate rounded-md border px-2 py-1 text-[10px] leading-tight"
                  style={{ borderColor: `${g.rang}66`, color: g.rang, background: `${g.rang}14` }}
                  title={n}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [
          {
            label: 'Obyektlar soni',
            data: [219, 179, 227, 198],
            backgroundColor: 'rgba(34,211,238,.45)',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'Qiymat (mlrd so‘m)',
            data: [2294, 2581, 3191, 2750],
            backgroundColor: 'rgba(251,191,36,.35)',
            borderRadius: 6,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa' } },
          y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa' }, position: 'left' },
          y1: { grid: { display: false }, ticks: { color: '#fbbf24' }, position: 'right' },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);
  return <canvas ref={chartRef} className="h-full w-full" />;
};

const StatCard = ({ icon, label, value, sub, color = 'cyan' }) => {
  const colorMap = { cyan: 'text-cyan-400', yellow: 'text-yellow-400', red: 'text-red-400', green: 'text-green-400' };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-3 sm:p-4">
      <span className="absolute right-2 top-2 text-lg opacity-10 sm:text-xl">{icon}</span>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#7a8eaa] sm:text-[11px]">{label}</div>
      <div className={`text-lg font-bold sm:text-2xl ${colorMap[color]}`}>{value}</div>
      {sub && <div className="mt-1 text-[10px] text-[#7a8eaa]">{sub}</div>}
    </div>
  );
};

const Sidebar = ({ activePage, setActivePage }) => {
  const { logout, user } = useAuth();
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Bosh panel', badge: null },
    { id: 'obyektlar', icon: '🏗️', label: "Obyektlar", badge: { type: 'warn', text: String(obektlar.length) } },
    { id: 'taqqoslash', icon: '⚖️', label: 'Smeta taqqoslash', badge: null },
    { id: 'hisobotlar', icon: '📋', label: 'Korxonalar', badge: null },
    { id: 'arizalar', icon: '📝', label: 'Arizalar', badge: { type: 'warn', text: '3' } },
    { id: 'kamera', icon: '📷', label: 'Kamera', badge: null },
  ];
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-56 flex-col border-r border-white/10 bg-[#111827] sm:w-60">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 text-lg">🏛️</div>
          <div>
            <div className="text-sm font-bold leading-tight">{ORG_SHORT}</div>
            <div className="text-[9px] leading-snug text-[#7a8eaa]">{ORG_FULL_NAME}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-white/10 bg-[#1a2438] p-2.5 text-[10px] text-[#7a8eaa]">
          Korxonalar ma’lumotni faqat ko‘rishi mumkin; kiritish huquqi yo‘q.
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 pt-3">
        <div className="mb-1.5 px-2 text-[10px] uppercase tracking-wider text-[#3d4f6a]">Menyu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
              activePage === item.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-[#7a8eaa] hover:bg-[#1a2438] hover:text-[#e6edf8]'
            }`}
          >
            <span className="w-4 text-[15px]">{item.icon}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  item.badge.type === 'warn' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-slate-400'
                }`}
              >
                {item.badge.text}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={logout}
          className="mb-3 w-full rounded-lg border border-white/15 py-2 text-sm text-white hover:bg-white/5"
        >
          Chiqish
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-[#1a2438] p-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400">
            {(user?.fullName || user?.email || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium">{user?.fullName || user?.email}</div>
            <div className="text-[10px] text-[#7a8eaa]">Inspektor · {ORG_SHORT}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

function KorxonaModal({ open, onClose, korxonaNomi }) {
  if (!open || !korxonaNomi) return null;
  const data = korxonaHujjatlari[korxonaNomi];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="dialog">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">{korxonaNomi}</h3>
            {data?.inn && <p className="text-xs text-[#7a8eaa]">INN: {data.inn}</p>}
            <p className="mt-1 text-[11px] text-slate-400">
              Korxona tomonidan yuklangan ariza, PDF, ilovalar, o‘zgartirilgan hujjatlar va yakuniy akt.
              {ORG_SHORT}, soliq va boshqa idoralar hujjatlarni yuklab olishi mumkin.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {(data?.hujjatlar || []).map((h) => (
            <li
              key={h.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2"
            >
              <div>
                <div className="text-xs text-white">{h.nom}</div>
                <div className="text-[10px] text-slate-500">
                  {h.tur === 'ariza' && 'Ariza'}
                  {h.tur === 'pdf' && 'PDF'}
                  {h.tur === 'ilova' && 'Ilova'}
                  {h.tur === 'ozgartirilgan' && 'O‘zgartirilgan'}
                  {h.tur === 'yakuniy' && 'Yakuniy akt'} · {h.fayl}
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadDemoHujjat(h.nom, h.fayl)}
                className="shrink-0 rounded-md bg-cyan-500/20 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-500/30"
              >
                Yuklab olish
              </button>
            </li>
          ))}
        </ul>
        {!data && <p className="text-sm text-slate-500">Bu korxona uchun demo hujjatlar ro‘yxati mavjud emas.</p>}
      </div>
    </div>
  );
}

const DashboardPage = ({ summary, onOpenKorxona }) => {
  const stats = summary?.stats;
  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon="📥" label="Jami kelib tushgan arizalar" value={kpiMain.jamiArizalar} sub="" color="cyan" />
        <StatCard icon="✅" label="Ma’qullangan arizalar soni" value={kpiMain.maqullangan} sub="" color="green" />
        <StatCard icon="⛔" label="Rad etilgan arizalar soni" value={kpiMain.radEtilgan} sub="" color="red" />
        <StatCard icon="🏁" label="Yakunlangan obyektlar soni" value={kpiMain.yakunlanganObyektlar} sub="" color="green" />
        <StatCard icon="🔧" label="Qurilish davom etayotgan obyektlar" value={kpiMain.davomEtotgan} sub="" color="cyan" />
        <StatCard icon="⏸️" label="Qurilishi to‘xtatilgan obyektlar" value={kpiMain.toxtatilgan} sub="" color="yellow" />
        <StatCard icon="💰" label="Umumiy loyiha qiymati" value={kpiMain.umumiyLoyihaQiymati} sub="" color="yellow" />
        <StatCard icon="👷" label="Umumiy ish haqi fondi" value={kpiMain.umumiyIshHaqiFondi} sub="" color="cyan" />
        <StatCard icon="👥" label="Umumiy ishchilar soni" value={kpiMain.umumiyIshchilar.toLocaleString('uz-UZ')} sub="" color="green" />
        <StatCard icon="⚠️" label="Smeta nomuvofiqlik" value={stats?.alertsOpen ?? kpiMain.smetaNomuvofiqlik} sub="tafovut aniqlangan" color="red" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
          <ToifaInfografika />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="text-xs font-semibold">Dinamika (namuna)</div>
            <div className="text-[11px] text-[#7a8eaa]">Obyektlar va qiymat</div>
          </div>
          <div className="h-52 p-4">
            <BarChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="text-xs font-semibold">Faol qurilish obyektlari</div>
          </div>
          <div>
            {faolObektlar.map((o, idx) => {
              const d = diffVal(o.smeta, o.haqiqiy);
              const dIh = diffVal(o.ihSmeta, o.ihHaqiqiy);
              const dX = diffVal(o.xodimSmeta, o.xodimHaqiqiy);
              return (
                <div key={idx} className="cursor-pointer border-b border-white/10 p-3 hover:bg-[#1a2438]">
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium text-white">{o.name}</div>
                      <button
                        type="button"
                        onClick={() => onOpenKorxona?.(o.pudratchi)}
                        className="text-left text-[11px] text-cyan-400 hover:underline"
                        title="Korxona hujjatlari"
                      >
                        {o.pudratchi}
                      </button>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getBadgeClass(o.holat)}`}>{o.holatTxt}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] text-[#7a8eaa]">
                    <span>
                      Shartnoma: smeta {o.smeta} / haqiqiy {o.haqiqiy} / tafovut{' '}
                      <b className={d.d > 0 ? 'text-red-400' : 'text-emerald-400'}>
                        {d.d > 0 ? '+' : ''}
                        {d.d} mln
                      </b>
                    </span>
                    <span>
                      IH: {o.ihSmeta}/{o.ihHaqiqiy} /{' '}
                      <b className={dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {dIh.d > 0 ? '+' : ''}
                        {dIh.d}
                      </b>
                    </span>
                    <span>
                      Ishchilar: {o.xodimSmeta}/{o.xodimHaqiqiy} /{' '}
                      <b className={dX.d !== 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {dX.d > 0 ? '+' : ''}
                        {dX.d}
                      </b>
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#1a2438]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${o.progress}%`,
                        background: o.holat === 'b-red' ? '#f87171' : o.holat === 'b-green' ? '#34d399' : '#22d3ee',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="text-xs font-semibold">Ogohlantirishlar</div>
          </div>
          <div>
            {ogohlar.map((a, idx) => (
              <div key={idx} className="flex gap-2 border-b border-white/10 p-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: a.color }} />
                <div className="flex-1">
                  <div className="text-xs text-white">{a.text}</div>
                  <div className="text-[11px] text-[#7a8eaa]">{a.sub}</div>
                </div>
                <div className="text-[11px] text-[#3d4f6a]">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectsPage = ({ onOpenKorxona }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = obektlar.filter((o) => {
    if (filter !== 'all' && !o.toifa.toLowerCase().includes(filter)) return false;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      o.name.toLowerCase().includes(q) ||
      o.pudratchi.toLowerCase().includes(q) ||
      o.inn.includes(q)
    );
  });
  return (
    <div>
      <div className="mb-3">
        <input
          type="search"
          placeholder="Korxona INN si yoki obyekt nomi"
          className="w-full max-w-xl rounded-lg border border-white/10 bg-[#1a2438] px-3 py-2 text-sm text-white placeholder:text-[#3d4f6a] outline-none focus:border-cyan-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="mt-2 text-[11px] leading-relaxed text-[#7a8eaa]">
          Qidiruv: ko‘p qavatli uylar, o‘quv obyekti, maktablar, bog‘cha, tibbiyot, sport va boshqa
          turdagi obyektlar bo‘yicha.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'maktab', 'tibbiyot', 'sport', 'bog'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-[#7a8eaa] hover:border-cyan-400/50'
            }`}
          >
            {f === 'all' ? 'Hammasi' : f === 'maktab' ? 'Maktablar' : f === 'tibbiyot' ? 'Tibbiyot' : f === 'sport' ? 'Sport' : "Bog‘cha"}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a2438]">
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Obyekt</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Toifa</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Korxona</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Shartnoma smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">IH fondi smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">IH haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">IH tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Ishchilar smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, idx) => {
              const dS = diffVal(o.smeta, o.haqiqiy);
              const dIh = diffVal(o.ihSmeta, o.ihHaqiqiy);
              const dX = diffVal(o.xodimSmeta, o.xodimHaqiqiy);
              return (
                <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438]">
                  <td className="px-2 py-2 font-medium text-white">{o.name}</td>
                  <td className="px-2 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass('b-cyan')}`}>{o.toifa}</span>
                  </td>
                  <td className="px-2 py-2">
                    <button type="button" onClick={() => onOpenKorxona(o.pudratchi)} className="text-left text-cyan-400 hover:underline">
                      {o.pudratchi}
                    </button>
                  </td>
                  <td className="px-2 py-2">{o.smeta}</td>
                  <td className="px-2 py-2">{o.haqiqiy}</td>
                  <td className={`px-2 py-2 font-medium ${dS.d > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {dS.d > 0 ? '+' : ''}
                    {dS.d}
                  </td>
                  <td className="px-2 py-2">{o.ihSmeta}</td>
                  <td className="px-2 py-2">{o.ihHaqiqiy}</td>
                  <td className={`px-2 py-2 ${dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {dIh.d > 0 ? '+' : ''}
                    {dIh.d}
                  </td>
                  <td className="px-2 py-2">{o.xodimSmeta}</td>
                  <td className="px-2 py-2">{o.xodimHaqiqiy}</td>
                  <td className={`px-2 py-2 ${dX.d !== 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {dX.d > 0 ? '+' : ''}
                    {dX.d}
                  </td>
                  <td className="px-2 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(o.holat)}`}>{o.ht}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComparisonPage = ({ compareId, setCompareId, compareResult, runCompare }) => {
  const [tab, setTab] = useState('all');
  const filtered = taqqoslashData.filter((t) => (tab === 'all' ? true : tab === 'nomo' ? t.status === 'nomo' : t.status === 'ok'));
  return (
    <div>
      <div className="mb-4 flex w-fit gap-0.5 rounded-lg bg-[#1a2438] p-0.5">
        {['all', 'nomo', 'ok'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium ${tab === t ? 'bg-[#111827] text-white' : 'text-[#7a8eaa]'}`}
          >
            {t === 'all' ? 'Barchasi' : t === 'nomo' ? 'Nomuvofiqlar' : 'Muvofiq'}
          </button>
        ))}
      </div>
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-4">
        <h3 className="text-sm font-semibold text-white">Hisobot vs smeta (ID bo‘yicha)</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            placeholder="Hisobot ID"
            className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-[#1a2438] px-3 py-2 text-sm text-white"
          />
          <button type="button" onClick={runCompare} className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">
            Taqqoslash
          </button>
        </div>
        {compareResult && (
          <div className="mt-3 rounded-lg bg-black/30 p-3 text-sm text-slate-300">
            {compareResult.diff ? (
              <>
                <p>
                  Xodimlar tafovuti: <span className="text-white">{compareResult.diff.employeeDelta}</span>
                </p>
                <p>
                  Shartnoma tafovuti: <span className="text-white">{compareResult.diff.contractDelta?.toLocaleString?.()}</span>
                </p>
              </>
            ) : (
              <p>{compareResult.message}</p>
            )}
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px] text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a2438] text-left text-[10px] uppercase tracking-wider text-[#3d4f6a]">
              <th className="px-3 py-2">Obyekt</th>
              <th className="px-3 py-2">Korxona</th>
              <th className="px-3 py-2">Shartnoma smeta</th>
              <th className="px-3 py-2">Haqiqiy</th>
              <th className="px-3 py-2">Tafovut</th>
              <th className="px-3 py-2">IH fondi smeta</th>
              <th className="px-3 py-2">Haqiqiy</th>
              <th className="px-3 py-2">Tafovut</th>
              <th className="px-3 py-2">Ishchilar smeta</th>
              <th className="px-3 py-2">Haqiqiy</th>
              <th className="px-3 py-2">Tafovut</th>
              <th className="px-3 py-2">Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => {
              const dS = diffVal(t.smeta, t.haqiqiy);
              const dIh = diffVal(t.ihSmeta, t.ihHaqiqiy);
              const dX = diffVal(t.xodimSmeta, t.xodimHaqiqiy);
              return (
                <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438]">
                  <td className="px-3 py-2 font-medium text-white">{t.name}</td>
                  <td className="px-3 py-2 text-[#7a8eaa]">{t.pudratchi}</td>
                  <td className="px-3 py-2">{t.smeta}</td>
                  <td className="px-3 py-2">{t.haqiqiy}</td>
                  <td className={`px-3 py-2 font-medium ${dS.d > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {dS.d > 0 ? '+' : ''}
                    {dS.d}
                  </td>
                  <td className="px-3 py-2">{t.ihSmeta}</td>
                  <td className="px-3 py-2">{t.ihHaqiqiy}</td>
                  <td className={`px-3 py-2 ${dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {dIh.d > 0 ? '+' : ''}
                    {dIh.d}
                  </td>
                  <td className="px-3 py-2">{t.xodimSmeta}</td>
                  <td className="px-3 py-2">{t.xodimHaqiqiy}</td>
                  <td className={`px-3 py-2 ${dX.d !== 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {dX.d > 0 ? '+' : ''}
                    {dX.d}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(t.ht)}`}>{t.holatTxt}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CameraPage = () => (
  <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
    <p className="text-sm text-[#7a8eaa]">Kamera monitoringi (namuna ma’lumot)</p>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-[#1a2438]">
            <th className="px-3 py-2 text-left">Obyekt</th>
            <th className="px-3 py-2">Kamera</th>
            <th className="px-3 py-2">Signal</th>
            <th className="px-3 py-2">Holat</th>
          </tr>
        </thead>
        <tbody>
          {kameraData.map((k, i) => (
            <tr key={i} className="border-b border-white/10">
              <td className="px-3 py-2 text-white">{k.obekt}</td>
              <td className="px-3 py-2">{k.soni}</td>
              <td className="px-3 py-2 text-[#7a8eaa]">{k.signal}</td>
              <td className="px-3 py-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(k.holat)}`}>{k.ht}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReportsPage = ({ reports, downloadPdf, onOpenKorxona }) => (
  <div>
    <p className="mb-3 text-[11px] text-[#7a8eaa]">
      Korxona ustiga bosing — ariza, PDF va boshqa hujjatlarni ko‘rish/yuklab olish.
    </p>
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-[#1a2438]">
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Korxona</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">INN</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Hisobot (kamera)</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Tafovut</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Aylanma</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">Holat</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-[#3d4f6a]">PDF</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0
            ? reports.map((r) => (
                <tr key={r._id} className="border-b border-white/10">
                  <td className="px-3 py-2 text-white">{r.companyUserId || '—'}</td>
                  <td className="px-3 py-2 font-mono text-[#7a8eaa]">{String(r._id).slice(-8)}</td>
                  <td className="px-3 py-2">{(r.employeeCount ?? '-') + ' / -'}</td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2">{r.contractAmount?.toLocaleString?.() ?? '—'}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">Yangi</span>
                  </td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => downloadPdf(r._id, r.periodMonth, r.periodYear)} className="text-cyan-400 hover:underline">
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            : hisobotRows.map((h, idx) => {
                const diff = h.kamera - h.hisobot;
                const dcolor = diff > 5 ? '#f87171' : diff > 0 ? '#fbbf24' : '#34d399';
                return (
                  <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438]">
                    <td className="px-3 py-2 font-medium text-white">
                      <button type="button" onClick={() => onOpenKorxona?.(h.name)} className="text-left text-cyan-400 hover:underline">
                        {h.name}
                      </button>
                    </td>
                    <td className="px-3 py-2 font-mono text-[#7a8eaa]">{h.inn}</td>
                    <td className="px-3 py-2">
                      {h.hisobot} / {h.kamera}
                    </td>
                    <td className="px-3 py-2 font-semibold" style={{ color: dcolor }}>
                      {diff > 0 ? '+' : ''}
                      {diff}
                    </td>
                    <td className="px-3 py-2">{h.aylanma}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getBadgeClass(h.holat)}`}>{h.ht}</span>
                    </td>
                    <td className="px-3 py-2 text-[#3d4f6a]">—</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  </div>
);

/** Arizalar: faqat {ORG_SHORT} tasdiqlashi; biriktirilgan inspektor F.I.Sh. */
const ApplicationsPage = () => {
  const { user } = useAuth();
  const isGasn = user?.role === 'gasn';
  const [apps, setApps] = useState([
    {
      id: 'a1',
      objectName: '42-maktab yangi binosi',
      status: 'kutilmoqda',
      date: '2025-03-25',
      gasnFio: '',
    },
    {
      id: 'a2',
      objectName: 'Markaziy poliklinika rekonstr.',
      status: 'kutilmoqda',
      date: '2025-03-26',
      gasnFio: 'Karimov A.A.',
    },
    {
      id: 'a3',
      objectName: 'Sport majmuasi',
      status: 'maqullangan',
      date: '2025-03-20',
      gasnFio: 'Tursunov B.B.',
    },
  ]);
  const [fioInputs, setFioInputs] = useState({});

  const setFio = (id, v) => setFioInputs((p) => ({ ...p, [id]: v }));
  const assignFio = (id) => {
    const v = fioInputs[id]?.trim();
    if (!v) return;
    setApps((list) => list.map((a) => (a.id === id ? { ...a, gasnFio: v } : a)));
  };
  const approve = (id) => {
    const app = apps.find((a) => a.id === id);
    const fio = (fioInputs[id] || app?.gasnFio || '').trim();
    if (!fio) return;
    setApps((list) => list.map((a) => (a.id === id ? { ...a, status: 'maqullangan', gasnFio: fio } : a)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-[11px] text-cyan-100/90">
        Kelib tushgan ariza bo‘yicha faqat <strong>{ORG_SHORT}</strong> tasdiqlashi mumkin. Obyektga biriktirilgan{' '}
        <strong>{ORG_SHORT}</strong> xodimining F.I.Sh. quyida ko‘rsatiladi; xodimni {ORG_SHORT} o‘zi biriktiradi.
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a2438] text-left text-[10px] uppercase tracking-wider text-[#3d4f6a]">
              <th className="px-3 py-2">Obyekt</th>
              <th className="px-3 py-2">Sana</th>
              <th className="px-3 py-2">Holat</th>
              <th className="px-3 py-2">Biriktirilgan {ORG_SHORT} xodimi (F.I.Sh.)</th>
              <th className="px-3 py-2">F.I.Sh. biriktirish</th>
              {isGasn && <th className="px-3 py-2">Tasdiqlash</th>}
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-b border-white/10">
                <td className="px-3 py-2 text-white">{app.objectName}</td>
                <td className="px-3 py-2 text-[#7a8eaa]">{app.date}</td>
                <td className="px-3 py-2">
                  {app.status === 'maqullangan' && <span className="text-emerald-400">Ma’qullangan</span>}
                  {app.status === 'kutilmoqda' && <span className="text-amber-400">Kutilmoqda</span>}
                  {app.status === 'rad_etilgan' && <span className="text-red-400">Rad etilgan</span>}
                </td>
                <td className="px-3 py-2 text-cyan-300">{app.gasnFio || '—'}</td>
                <td className="px-3 py-2">
                  {isGasn ? (
                    <div className="flex flex-wrap gap-1">
                      <input
                        className="w-40 max-w-full rounded border border-white/10 bg-[#0f172a] px-2 py-1 text-xs text-white"
                        placeholder="Masalan: Karimov A.A."
                        value={fioInputs[app.id] ?? ''}
                        onChange={(e) => setFio(app.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => assignFio(app.id)}
                        className="rounded bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-white/15"
                      >
                        Saqlash
                      </button>
                    </div>
                  ) : (
                    <span className="text-[#3d4f6a]">—</span>
                  )}
                </td>
                {isGasn && (
                  <td className="px-3 py-2">
                    {app.status === 'kutilmoqda' ? (
                      <button
                        type="button"
                        onClick={() => approve(app.id)}
                        disabled={!(fioInputs[app.id] || app.gasnFio || '').trim()}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                        title={!(fioInputs[app.id] || app.gasnFio || '').trim() ? 'Avval F.I.Sh. kiriting yoki saqlang' : ''}
                      >
                        Tasdiqlash
                      </button>
                    ) : (
                      <span className="text-[#3d4f6a]">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function GasnDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [compareId, setCompareId] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [msg, setMsg] = useState('');
  const [korxonaModal, setKorxonaModal] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    Promise.all([api.get('/dashboard/summary'), api.get('/reports')])
      .then(([a, c]) => {
        setSummary(a.data);
        setReports(c.data.reports || []);
      })
      .catch(() => setMsg("Ma'lumot yuklanmadi"));
  }, [token]);

  const runCompare = async () => {
    setMsg('');
    setCompareResult(null);
    if (!compareId) return;
    try {
      const { data } = await api.get(`/compare/report/${compareId}`);
      setCompareResult(data);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Taqqoslash xatosi');
    }
  };

  const downloadPdf = async (reportId, periodMonth, periodYear) => {
    try {
      await downloadBlob(api, `/reports/${reportId}/pdf`, `hisobot-${periodYear}-${String(periodMonth).padStart(2, '0')}.pdf`);
    } catch {
      setMsg('PDF yuklab olinmadi');
    }
  };

  const pageTitles = {
    dashboard: `${ORG_SHORT} — bosh panel`,
    obyektlar: "Obyektlar ro'yxati",
    taqqoslash: 'Smeta va haqiqiy ko‘rsatkichlar',
    kamera: 'Kamera monitoringi',
    hisobotlar: 'Korxonalar hisobotlari',
    arizalar: 'Kelib tushgan arizalar',
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage summary={summary} onOpenKorxona={setKorxonaModal} />;
      case 'obyektlar':
        return <ObjectsPage onOpenKorxona={setKorxonaModal} />;
      case 'taqqoslash':
        return (
          <ComparisonPage
            compareId={compareId}
            setCompareId={setCompareId}
            compareResult={compareResult}
            runCompare={runCompare}
          />
        );
      case 'kamera':
        return <CameraPage />;
      case 'hisobotlar':
        return <ReportsPage reports={reports} downloadPdf={downloadPdf} onOpenKorxona={setKorxonaModal} />;
      case 'arizalar':
        return <ApplicationsPage />;
      default:
        return <DashboardPage summary={summary} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-[#e6edf8]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <KorxonaModal open={!!korxonaModal} onClose={() => setKorxonaModal(null)} korxonaNomi={korxonaModal} />

      <div className="ml-0 flex flex-col sm:ml-56 lg:ml-60">
        <div className="sticky top-0 z-40 flex h-auto min-h-14 flex-wrap items-center gap-2 border-b border-white/10 bg-[#111827] px-4 py-2 sm:px-6">
          <div>
            <div className="text-sm font-semibold">{pageTitles[activePage]}</div>
            <div className="max-w-xl text-[10px] text-[#7a8eaa] sm:text-xs">{ORG_FULL_NAME}</div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[10px] text-[#7a8eaa] sm:text-xs">
            <span>
              {new Date().toLocaleDateString('uz-UZ')} · {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {renderPage()}
          {msg && <p className="mt-4 text-sm text-amber-400">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
