import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import api from '../../api.js';
import { downloadBlob } from '../../utils/downloadBlob.js';
import {
  ORG_FULL_NAME,
  ORG_SHORT,
  kpiMain,
  obyektlarToifaBoYicha,
  getBadgeClass,
  diffVal,
} from '../../data/gasnDashboardMock.js';
import { SUMMARY_FIELD_META, WORK_VOLUME_ROWS } from '../../data/objectRegistrationSchema.js';

function sortReportsLatest(reports) {
  return [...reports].sort((a, b) => {
    const py = (b.periodYear || 0) - (a.periodYear || 0);
    if (py !== 0) return py;
    return (b.periodMonth || 0) - (a.periodMonth || 0);
  });
}

function latestReportForCompany(reports, companyUserId) {
  const list = reports.filter((r) => String(r.companyUserId) === String(companyUserId));
  return sortReportsLatest(list)[0] || null;
}

function latestProjectForCompany(projects, companyUserId) {
  const list = projects.filter((p) => String(p.companyUserId) === String(companyUserId));
  return [...list].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null;
}

function fmtNum(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('uz-UZ');
}

function holatFromProjectReport(project, report) {
  if (!report) return { holat: 'b-blue', holatTxt: 'Hisobot yo‘q', progress: 22 };
  const dC = Number(report.contractAmount) - Number(project.smetaContractSum);
  const dE = Number(report.employeeCount) - Number(project.smetaEmployeeCount);
  const base = Number(project.smetaContractSum) || 1;
  const pct = Math.abs(dC) / base;
  if (pct > 0.08 || dE !== 0) return { holat: 'b-red', holatTxt: 'Tafovut', progress: 42 };
  return { holat: 'b-green', holatTxt: 'Muvofiq', progress: 76 };
}

/** Toifa bo‘yicha obyekt nomlari — gorizontal infografika (donut o‘rniga) */
function ToifaInfografika() {
  const maxLen = Math.max(...obyektlarToifaBoYicha.map((g) => g.obyektlar.length), 1);
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-slate-900 dark:text-white">Obyektlar toifasi bo‘yicha</div>
        <p className="mt-0.5 text-[11px] text-slate-600 dark:text-[#7a8eaa]">
          Har bir qatorda toifa va unga tegishli obyekt nomlari ko‘rsatiladi (namuna statistikasi).
        </p>
      </div>
      {obyektlarToifaBoYicha.map((g) => {
        const ulush = Math.round((g.obyektlar.length / maxLen) * 100);
        return (
          <div key={g.toifa} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#0f172a]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-900 dark:text-white">{g.toifa}</span>
              <span className="text-[10px] text-slate-600 dark:text-[#7a8eaa]">{g.obyektlar.length} ta obyekt</span>
            </div>
            <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#1e293b]">
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const tick = isDark ? '#94a3b8' : '#64748b';
    const grid = isDark ? 'rgba(255,255,255,.06)' : 'rgba(15,23,42,.08)';
    const legend = isDark ? '#94a3b8' : '#475569';
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
        plugins: { legend: { labels: { color: legend, font: { size: 10 } } } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: tick } },
          y: { grid: { color: grid }, ticks: { color: tick }, position: 'left' },
          y1: { grid: { display: false }, ticks: { color: isDark ? '#fbbf24' : '#b45309' }, position: 'right' },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [isDark]);
  return <canvas ref={chartRef} className="h-full w-full" />;
};

const StatCard = ({ icon, label, value, sub, color = 'cyan', onClick }) => {
  const colorMap = { cyan: 'text-cyan-400', yellow: 'text-yellow-400', red: 'text-red-400', green: 'text-green-400' };
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-white/10 dark:bg-[#111827] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <span className="absolute right-2 top-2 text-lg opacity-10 sm:text-xl">{icon}</span>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-600 sm:text-[11px] dark:text-[#7a8eaa]">{label}</div>
      <div className={`text-lg font-bold sm:text-2xl ${colorMap[color]}`}>{value}</div>
      {sub && <div className="mt-1 text-[10px] text-slate-600 dark:text-[#7a8eaa]">{sub}</div>}
    </div>
  );
};

const Sidebar = ({ activePage, setActivePage, projectsCount }) => {
  const { logout, user } = useAuth();
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Bosh sahifa', badge: null },
    { id: 'obyektlar', icon: '🏗️', label: 'Obyektlar', badge: { type: 'warn', text: String(projectsCount) } },
    // { id: 'taqqoslash', icon: '⚖️', label: 'Smeta taqqoslash', badge: null },
    { id: 'hisobotlar', icon: '📋', label: 'Korxonalar', badge: null },
    { id: 'arizalar', icon: '📝', label: 'Arizalar', badge: null },
  ];
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-56 flex-col border-r border-slate-200 bg-white sm:w-60 dark:border-white/10 dark:bg-[#111827]">
      <div className="border-b border-slate-200 p-4 dark:border-white/10 sm:p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 text-lg">🏛️</div>
          <div>
            <div className="text-sm font-bold leading-tight text-slate-900 dark:text-white">{ORG_SHORT}</div>
            <div className="text-[9px] leading-snug text-slate-600 dark:text-[#7a8eaa]">{ORG_FULL_NAME}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[10px] text-slate-600 dark:border-white/10 dark:bg-[#1a2438] dark:text-[#7a8eaa]">
          Korxonalar ma’lumotni faqat ko‘rishi mumkin; kiritish huquqi yo‘q.
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 pt-3">
        <div className="mb-1.5 px-2 text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Menyu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
              activePage === item.id
                ? 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#7a8eaa] dark:hover:bg-[#1a2438] dark:hover:text-[#e6edf8]'
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
      <div className="border-t border-slate-200 p-3 dark:border-white/10">
        <button
          type="button"
          onClick={logout}
          className="mb-3 w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
        >
          Chiqish
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 dark:bg-[#1a2438]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
            {(user?.fullName || user?.email || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-slate-900 dark:text-white">{user?.fullName || user?.email}</div>
            <div className="text-[10px] text-slate-600 dark:text-[#7a8eaa]">Inspektor · {ORG_SHORT}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

function KorxonaModal({ open, onClose, modal, reports }) {
  if (!open || !modal?.companyUserId) return null;
  const { organizationName, companyUserId } = modal;
  const companyReports = (reports || []).filter((r) => String(r.companyUserId) === String(companyUserId));
  const rows = companyReports.flatMap((r) =>
    (r.invoices || []).map((inv) => ({
      ...inv,
      reportId: r._id,
      periodLabel: `${String(r.periodMonth).padStart(2, '0')}/${r.periodYear}`,
    }))
  );

  const downloadFile = async (reportId, inv) => {
    try {
      await downloadBlob(
        api,
        `/reports/${reportId}/files/${encodeURIComponent(inv.storedName)}`,
        inv.fileName || 'fayl'
      );
    } catch {
      /* handled by parent msg */
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="dialog">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{organizationName}</h3>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Hisobotga biriktirilgan hisob-faktura va boshqa fayllar. Yuklab olish uchun tugmani bosing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-500">Bu korxona uchun yuklangan fayllar hali mavjud emas.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((h) => (
              <li
                key={`${h.reportId}-${h.storedName || h.fileName}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0f172a] px-3 py-2"
              >
                <div>
                  <div className="text-xs text-slate-900 dark:text-white">{h.fileName}</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-500">Hisobot davri: {h.periodLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadFile(h.reportId, h)}
                  className="shrink-0 rounded-md bg-cyan-100 px-2 py-1 text-[11px] text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
                >
                  Yuklab olish
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const DashboardPage = ({ summary, projects, reports, alerts, companyById, onOpenKorxona, kpi, onGoPage }) => {
  const stats = summary?.stats;
  const K = kpi || {};
  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 12),
    [projects]
  );

  const alertRows = useMemo(() => {
    return (alerts || []).slice(0, 10).map((a) => ({
      color:
        a.severity === 'critical' ? '#f87171' : a.severity === 'info' ? '#22d3ee' : '#fbbf24',
      text: a.message,
      sub: a.acknowledged ? 'Ko‘rilgan' : 'Yangi signal',
      time: a.createdAt
        ? new Date(a.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        : '—',
    }));
  }, [alerts]);

  const openCompany = (companyUserId) => {
    const c = companyById.get(String(companyUserId));
    onOpenKorxona({
      companyUserId,
      organizationName: c?.organizationName || c?.email || 'Korxona',
    });
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon="📥"
          label="Jami kelib tushgan arizalar"
          value={K.jamiArizalar ?? kpiMain.jamiArizalar}
          sub=""
          color="cyan"
          onClick={() => onGoPage?.('arizalar', null)}
        />
        <StatCard
          icon="✅"
          label="Ma’qullangan arizalar soni"
          value={K.maqullangan ?? kpiMain.maqullangan}
          sub=""
          color="green"
          onClick={() => onGoPage?.('arizalar', 'approved')}
        />
        <StatCard
          icon="⛔"
          label="Rad etilgan arizalar soni"
          value={K.radEtilgan ?? kpiMain.radEtilgan}
          sub=""
          color="red"
          onClick={() => onGoPage?.('arizalar', 'rejected')}
        />
        <StatCard
          icon="🏁"
          label="Yakunlangan obyektlar soni"
          value={K.yakunlanganObyektlar ?? kpiMain.yakunlanganObyektlar}
          sub=""
          color="green"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="🔧"
          label="Qurilish davom etayotgan obyektlar"
          value={K.davomEtotgan ?? kpiMain.davomEtotgan}
          sub=""
          color="cyan"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="⏸️"
          label="Qurilishi to‘xtatilgan obyektlar"
          value={K.toxtatilgan ?? kpiMain.toxtatilgan}
          sub=""
          color="yellow"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="💰"
          label="Umumiy loyiha qiymati"
          value={K.umumiyLoyihaQiymati ?? kpiMain.umumiyLoyihaQiymati}
          sub=""
          color="yellow"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="👷"
          label="Umumiy ish haqi fondi"
          value={K.umumiyIshHaqiFondi ?? kpiMain.umumiyIshHaqiFondi}
          sub=""
          color="cyan"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="👥"
          label="Umumiy ishchilar soni"
          value={typeof K.umumiyIshchilar === 'number' ? K.umumiyIshchilar.toLocaleString('uz-UZ') : kpiMain.umumiyIshchilar.toLocaleString('uz-UZ')}
          sub=""
          color="green"
          onClick={() => onGoPage?.('obyektlar')}
        />
        <StatCard
          icon="⚠️"
          label="Smeta nomuvofiqlik"
          value={K.smetaNomuvofiqlik ?? stats?.alertsOpen ?? kpiMain.smetaNomuvofiqlik}
          sub="ochiq signal"
          color="red"
          onClick={() => onGoPage?.('taqqoslash')}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-4">
          <ToifaInfografika />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Dinamika (namuna statistika)</div>
            <div className="text-[11px] text-slate-600 dark:text-[#7a8eaa]">Obyektlar va qiymat</div>
          </div>
          <div className="h-52 p-4">
            <BarChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Faol qurilish obyektlari (smeta / haqiqiy)</div>
            <div className="text-[10px] text-slate-600 dark:text-[#7a8eaa]">Ma’lumotlar bazadan: loyiha smetasi va korxona hisoboti</div>
          </div>
          <div>
            {sortedProjects.length === 0 ? (
              <p className="p-4 text-sm text-slate-600 dark:text-[#7a8eaa]">Hozircha smeta/loyiha yozuvlari yo‘q.</p>
            ) : (
              sortedProjects.map((project) => {
                const report = latestReportForCompany(reports, project.companyUserId);
                const company = companyById.get(String(project.companyUserId));
                const label = company?.organizationName || company?.email || 'Korxona';
                const dS = diffVal(Number(project.smetaContractSum), Number(report?.contractAmount ?? project.smetaContractSum));
                const dIh = diffVal(Number(project.smetaPayrollEstimate), Number(report?.payrollFund ?? project.smetaPayrollEstimate));
                const dX = diffVal(Number(project.smetaEmployeeCount), Number(report?.employeeCount ?? project.smetaEmployeeCount));
                const { holat, holatTxt, progress } = holatFromProjectReport(project, report);
                return (
                  <div key={project._id} className="cursor-pointer border-b border-slate-200 dark:border-white/10 p-3 hover:bg-slate-50 dark:hover:bg-[#1a2438]">
                    <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-medium text-slate-900 dark:text-white">{project.title}</div>
                        <button
                          type="button"
                          onClick={() => openCompany(project.companyUserId)}
                          className="text-left text-[11px] text-cyan-400 hover:underline"
                          title="Korxona hujjatlari"
                        >
                          {label}
                        </button>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getBadgeClass(holat)}`}>{holatTxt}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-600 dark:text-[#7a8eaa]">
                      <span>
                        Shartnoma: smeta {fmtNum(project.smetaContractSum)} / haqiqiy {fmtNum(report?.contractAmount)}{' '}
                        / tafovut{' '}
                        <b className={dS.d > 0 ? 'text-red-400' : 'text-emerald-400'}>
                          {dS.d > 0 ? '+' : ''}
                          {fmtNum(dS.d)}
                        </b>
                      </span>
                      <span>
                        IH: {fmtNum(project.smetaPayrollEstimate)}/{fmtNum(report?.payrollFund)} /{' '}
                        <b className={dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                          {dIh.d > 0 ? '+' : ''}
                          {fmtNum(dIh.d)}
                        </b>
                      </span>
                      <span>
                        Ishchilar: {project.smetaEmployeeCount}/{report?.employeeCount ?? '—'} /{' '}
                        <b className={dX.d !== 0 ? 'text-amber-400' : 'text-emerald-400'}>
                          {dX.d > 0 ? '+' : ''}
                          {dX.d}
                        </b>
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1a2438]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: holat === 'b-red' ? '#f87171' : holat === 'b-green' ? '#34d399' : '#22d3ee',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
          <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Ogohlantirishlar</div>
            <div className="text-[10px] text-slate-600 dark:text-[#7a8eaa]">Serverdagi signal va qoidalar natijasi</div>
          </div>
          <div>
            {alertRows.length === 0 ? (
              <p className="p-4 text-sm text-slate-600 dark:text-[#7a8eaa]">Hozircha ogohlantirish yo‘q.</p>
            ) : (
              alertRows.map((a, idx) => (
                <div key={idx} className="flex gap-2 border-b border-slate-200 dark:border-white/10 p-3">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: a.color }} />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900 dark:text-white">{a.text}</div>
                    <div className="text-[11px] text-slate-600 dark:text-[#7a8eaa]">{a.sub}</div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#3d4f6a]">{a.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ObjectsPage = ({ projects, reports, companyById, onOpenKorxona }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const rows = useMemo(() => {
    return projects.map((p) => {
      const report = latestReportForCompany(reports, p.companyUserId);
      const c = companyById.get(String(p.companyUserId));
      const toifa = report?.constructionType || '—';
      return { project: p, report, company: c, toifa };
    });
  }, [projects, reports, companyById]);

  const filtered = rows.filter(({ project, report, company, toifa }) => {
    if (filter !== 'all' && !String(toifa).toLowerCase().includes(filter)) return false;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    const blob = [project.title, company?.organizationName, company?.email, toifa].filter(Boolean).join(' ').toLowerCase();
    return blob.includes(q);
  });

  return (
    <div>
      <div className="mb-3">
        <input
          type="search"
          placeholder="Obyekt nomi, korxona yoki qurilish turi"
          className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-[#1a2438] dark:text-white dark:placeholder:text-slate-500 dark:text-[#3d4f6a] dark:focus:border-cyan-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-[#7a8eaa]">
          Ro‘yxat bazadagi loyiha smetasi va korxonaning oxirgi hisobotidan olinadi.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'turar', 'maktab', 'tibbiyot', 'sport', 'bog'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-400'
                : 'border-slate-200 text-slate-600 hover:border-cyan-400/50 dark:border-white/10 dark:text-[#7a8eaa]'
            }`}
          >
            {f === 'all'
              ? 'Hammasi'
              : f === 'maktab'
                ? 'Maktab'
                : f === 'tibbiyot'
                  ? 'Tibbiyot'
                  : f === 'sport'
                    ? 'Sport'
                    : f === 'bog'
                      ? 'Bog‘cha'
                      : 'Turar-joy'}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1a2438]">
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Obyekt</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Turi</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Korxona</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Shartnoma smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">IH fondi smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">IH haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">IH tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Ishchilar smeta</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Haqiqiy</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Tafovut</th>
              <th className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-8 text-center text-slate-600 dark:text-[#7a8eaa]">
                  Ma’lumot topilmadi yoki hali loyiha kiritilmagan.
                </td>
              </tr>
            ) : (
              filtered.map(({ project: o, report, company, toifa }) => {
                const dS = diffVal(Number(o.smetaContractSum), Number(report?.contractAmount ?? o.smetaContractSum));
                const dIh = diffVal(Number(o.smetaPayrollEstimate), Number(report?.payrollFund ?? o.smetaPayrollEstimate));
                const dX = diffVal(Number(o.smetaEmployeeCount), Number(report?.employeeCount ?? o.smetaEmployeeCount));
                const { holat, holatTxt } = holatFromProjectReport(o, report);
                const label = company?.organizationName || company?.email || '—';
                return (
                  <tr key={o._id} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#1a2438]">
                    <td className="px-2 py-2 font-medium text-slate-900 dark:text-white">{o.title}</td>
                    <td className="px-2 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass('b-cyan')}`}>{toifa}</span>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenKorxona({
                            companyUserId: o.companyUserId,
                            organizationName: label,
                          })
                        }
                        className="text-left text-cyan-400 hover:underline"
                      >
                        {label}
                      </button>
                    </td>
                    <td className="px-2 py-2">{fmtNum(o.smetaContractSum)}</td>
                    <td className="px-2 py-2">{fmtNum(report?.contractAmount)}</td>
                    <td className={`px-2 py-2 font-medium ${dS.d > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {dS.d > 0 ? '+' : ''}
                      {fmtNum(dS.d)}
                    </td>
                    <td className="px-2 py-2">{fmtNum(o.smetaPayrollEstimate)}</td>
                    <td className="px-2 py-2">{fmtNum(report?.payrollFund)}</td>
                    <td className={`px-2 py-2 ${dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {dIh.d > 0 ? '+' : ''}
                      {fmtNum(dIh.d)}
                    </td>
                    <td className="px-2 py-2">{o.smetaEmployeeCount}</td>
                    <td className="px-2 py-2">{report?.employeeCount ?? '—'}</td>
                    <td className={`px-2 py-2 ${dX.d !== 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {dX.d > 0 ? '+' : ''}
                      {dX.d}
                    </td>
                    <td className="px-2 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(holat)}`}>{holatTxt}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComparisonPage = ({ reports, projects, companyById, compareId, setCompareId, compareResult, runCompare }) => {
  const [tab, setTab] = useState('all');

  const tableRows = useMemo(() => {
    return sortReportsLatest(reports).map((report) => {
      const project = latestProjectForCompany(projects, report.companyUserId);
      const company = companyById.get(String(report.companyUserId));
      const pudratchi = company?.organizationName || company?.email || '—';
      if (!project) {
        return {
          key: report._id,
          name: report.constructionType || 'Hisobot',
          pudratchi,
          smeta: null,
          haqiqiy: report.contractAmount,
          ihSmeta: null,
          ihHaqiqiy: report.payrollFund,
          xodimSmeta: null,
          xodimHaqiqiy: report.employeeCount,
          ht: 'b-yellow',
          holatTxt: 'Smeta yo‘q',
          status: 'nomo',
        };
      }
      const dS = diffVal(project.smetaContractSum, report.contractAmount);
      const dIh = diffVal(project.smetaPayrollEstimate, report.payrollFund);
      const dX = diffVal(project.smetaEmployeeCount, report.employeeCount);
      const base = Number(project.smetaContractSum) || 1;
      const nomo = Math.abs(dS.d) / base > 0.08 || dX.d !== 0;
      return {
        key: report._id,
        name: project.title,
        pudratchi,
        smeta: project.smetaContractSum,
        haqiqiy: report.contractAmount,
        ihSmeta: project.smetaPayrollEstimate,
        ihHaqiqiy: report.payrollFund,
        xodimSmeta: project.smetaEmployeeCount,
        xodimHaqiqiy: report.employeeCount,
        dS,
        dIh,
        dX,
        ht: nomo ? 'b-red' : 'b-green',
        holatTxt: nomo ? 'Nomuvofiq' : 'Muvofiq',
        status: nomo ? 'nomo' : 'ok',
      };
    });
  }, [reports, projects, companyById]);

  const filtered = tableRows.filter((t) => (tab === 'all' ? true : tab === 'nomo' ? t.status === 'nomo' : t.status === 'ok'));

  return (
    <div>
      <div className="mb-4 flex w-fit gap-0.5 rounded-lg bg-slate-100 dark:bg-[#1a2438] p-0.5">
        {['all', 'nomo', 'ok'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium ${tab === t ? 'bg-slate-200 text-slate-900 dark:bg-[#111827] dark:text-white' : 'text-slate-600 dark:text-[#7a8eaa]'}`}
          >
            {t === 'all' ? 'Barchasi' : t === 'nomo' ? 'Nomuvofiqlar' : 'Muvofiq'}
          </button>
        ))}
      </div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hisobot vs smeta (ID bo‘yicha)</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            placeholder="Hisobot ID"
            className="min-w-[200px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-[#1a2438] dark:text-white"
          />
          <button
            type="button"
            onClick={runCompare}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-900 hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            Taqqoslash
          </button>
        </div>
        {compareResult && (
          <div className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-800 dark:bg-black/30 dark:text-slate-300">
            {compareResult.diff ? (
              <>
                <p>
                  Xodimlar tafovuti:{' '}
                  <span className="font-medium text-slate-900 dark:text-white">{compareResult.diff.employeeDelta}</span>
                </p>
                <p>
                  Shartnoma tafovuti:{' '}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {compareResult.diff.contractDelta?.toLocaleString?.()}
                  </span>
                </p>
              </>
            ) : (
              <p>{compareResult.message}</p>
            )}
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-transparent">
        <table className="w-full min-w-[900px] text-xs text-slate-700 dark:text-slate-300">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1a2438] text-left text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-center text-slate-600 dark:text-[#7a8eaa]">
                  Hisobotlar yo‘q — korxonalar muddatli hisobot yuborganidan keyin jadval to‘ladi.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                if (t.smeta == null) {
                  return (
                    <tr key={t.key} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#1a2438]">
                      <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{t.name}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-[#7a8eaa]">{t.pudratchi}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">{fmtNum(t.haqiqiy)}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">{fmtNum(t.ihHaqiqiy)}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">{t.xodimHaqiqiy}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(t.ht)}`}>{t.holatTxt}</span>
                      </td>
                    </tr>
                  );
                }
                const dS = t.dS;
                const dIh = t.dIh;
                const dX = t.dX;
                return (
                  <tr key={t.key} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#1a2438]">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{t.name}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-[#7a8eaa]">{t.pudratchi}</td>
                    <td className="px-3 py-2">{fmtNum(t.smeta)}</td>
                    <td className="px-3 py-2">{fmtNum(t.haqiqiy)}</td>
                    <td className={`px-3 py-2 font-medium ${dS.d > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {dS.d > 0 ? '+' : ''}
                      {fmtNum(dS.d)}
                    </td>
                    <td className="px-3 py-2">{fmtNum(t.ihSmeta)}</td>
                    <td className="px-3 py-2">{fmtNum(t.ihHaqiqiy)}</td>
                    <td className={`px-3 py-2 ${dIh.d > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {dIh.d > 0 ? '+' : ''}
                      {fmtNum(dIh.d)}
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsPage = ({ reports, companyById, downloadPdf, onOpenKorxona }) => (
  <div>
    <p className="mb-3 text-[11px] text-slate-600 dark:text-[#7a8eaa]">
      Korxona ustiga bosing — yuklangan hisob-faktura va ilovalarni ko‘rish/yuklab olish.
    </p>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1a2438]">
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Korxona</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Davr</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Xodimlar</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">IH fondi</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Shartnoma</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">Qurilish turi</th>
            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">PDF</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-600 dark:text-[#7a8eaa]">
                Hali korxonalardan hisobot kelib tushmagan.
              </td>
            </tr>
          ) : (
            reports.map((r) => {
              const c = companyById.get(String(r.companyUserId));
              const name = c?.organizationName || c?.email || String(r.companyUserId);
              return (
                <tr key={r._id} className="border-b border-slate-200 dark:border-white/10">
                  <td className="px-3 py-2 text-slate-900 dark:text-white">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenKorxona({
                          companyUserId: r.companyUserId,
                          organizationName: name,
                        })
                      }
                      className="text-left text-cyan-400 hover:underline"
                    >
                      {name}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-[#7a8eaa]">
                    {r.periodMonth}/{r.periodYear}
                  </td>
                  <td className="px-3 py-2">{r.employeeCount ?? '—'}</td>
                  <td className="px-3 py-2">{fmtNum(r.payrollFund)}</td>
                  <td className="px-3 py-2">{fmtNum(r.contractAmount)}</td>
                  <td className="px-3 py-2">{r.constructionType || '—'}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => downloadPdf(r._id, r.periodMonth, r.periodYear)}
                      className="text-cyan-400 hover:underline"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

function statusLabel(status) {
  if (status === 'approved') return { text: 'Ma’qullangan', cls: 'text-emerald-400' };
  if (status === 'rejected') return { text: 'Rad etilgan', cls: 'text-red-400' };
  return { text: 'Kutilmoqda', cls: 'text-amber-400' };
}

const ApplicationsPage = ({ onError, statusFilter }) => {
  const { user } = useAuth();
  const isGasn = user?.role === 'gasn';
  const [apps, setApps] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fioInputs, setFioInputs] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [detailApp, setDetailApp] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/applications');
      const list = data.applications || [];
      setApps(list);
      setFioInputs((prev) => {
        const next = { ...prev };
        for (const a of list) {
          if (a.gasnInspectorFio && next[a._id] === undefined) next[a._id] = a.gasnInspectorFio;
        }
        return next;
      });
    } catch {
      onError?.("Arizalar ro'yxati yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!isGasn) return;
    (async () => {
      try {
        const { data } = await api.get('/gasn/inspectors');
        setInspectors(data.inspectors || []);
      } catch {
        setInspectors([]);
      }
    })();
  }, [isGasn]);

  const visibleApps = statusFilter ? apps.filter((a) => a.status === statusFilter) : apps;

  const setFio = (id, v) => setFioInputs((p) => ({ ...p, [id]: v }));

  const assignFio = async (id) => {
    const v = fioInputs[id]?.trim();
    if (!v) return;
    setBusyId(id);
    onError?.('');
    try {
      await api.patch(`/applications/${id}`, { gasnInspectorFio: v });
      await load();
    } catch (e) {
      onError?.(e.response?.data?.error || 'Saqlanmadi');
    } finally {
      setBusyId(null);
    }
  };

  const approve = async (id) => {
    const app = apps.find((a) => a._id === id);
    const fio = (fioInputs[id] ?? app?.gasnInspectorFio ?? '').trim();
    if (!fio) return;
    setBusyId(id);
    onError?.('');
    try {
      await api.post(`/applications/${id}/approve`, { gasnInspectorFio: fio });
      await load();
    } catch (e) {
      onError?.(e.response?.data?.error || 'Tasdiqlanmadi');
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id) => {
    setBusyId(id);
    onError?.('');
    try {
      await api.post(`/applications/${id}/reject`, {});
      await load();
    } catch (e) {
      onError?.(e.response?.data?.error || 'Rad etilmadi');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-[#7a8eaa]">Yuklanmoqda…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-[11px] text-cyan-100/90">
        Kelib tushgan ariza bo‘yicha faqat <strong>{ORG_SHORT}</strong> tasdiqlashi mumkin. Obyektga biriktirilgan{' '}
        <strong>{ORG_SHORT}</strong> xodimi quyidagi ro‘yxatdan tanlanadi; qo‘lda yozilmaydi.
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1a2438] text-left text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#3d4f6a]">
              <th className="px-3 py-2">Obyekt</th>
              <th className="px-3 py-2">Ro‘yxat jadvallari</th>
              {isGasn && <th className="px-3 py-2">Korxona</th>}
              {isGasn && <th className="px-3 py-2">Biriktirilgan fayllar</th>}
              <th className="px-3 py-2">Sana</th>
              <th className="px-3 py-2">Holat</th>
              <th className="px-3 py-2">Biriktirilgan {ORG_SHORT} xodimi</th>
              <th className="px-3 py-2">Xodimni tanlash</th>
              {isGasn && <th className="px-3 py-2">Tasdiqlash</th>}
              {isGasn && <th className="px-3 py-2">Rad etish</th>}
            </tr>
          </thead>
          <tbody>
            {visibleApps.length === 0 ? (
              <tr>
                <td colSpan={isGasn ? 10 : 6} className="px-4 py-8 text-center text-slate-600 dark:text-[#7a8eaa]">
                  Hozircha ariza yo‘q.
                </td>
              </tr>
            ) : (
              visibleApps.map((app) => {
                const st = statusLabel(app.status);
                const dateStr = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString('uz-UZ')
                  : '—';
                const att = app.attachments || [];
                return (
                  <tr key={app._id} className="border-b border-slate-200 dark:border-white/10">
                    <td className="px-3 py-2 text-slate-900 dark:text-white">{app.objectName}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="rounded bg-white/10 px-2 py-1 text-[11px] text-cyan-300 hover:bg-white/15"
                        onClick={() => setDetailApp(app)}
                      >
                        Ko‘rish
                      </button>
                    </td>
                    {isGasn && (
                      <td className="px-3 py-2 text-slate-600 dark:text-[#7a8eaa]">{app.organizationName || app.companyEmail || '—'}</td>
                    )}
                    {isGasn && (
                      <td className="max-w-[200px] px-3 py-2 align-top text-[11px] text-[#a1a1aa]">
                        {att.length === 0 ? (
                          <span className="text-slate-500 dark:text-[#3d4f6a]">—</span>
                        ) : (
                          <ul className="list-none space-y-1 p-0">
                            {att.map((a, idx) => (
                              <li key={idx}>
                                <button
                                  type="button"
                                  className="text-left text-cyan-400 underline decoration-cyan-500/40 hover:text-cyan-300"
                                  onClick={() =>
                                    downloadBlob(
                                      api,
                                      `/applications/${app._id}/files/${encodeURIComponent(a.storedName)}`,
                                      a.fileName || 'fayl'
                                    )
                                  }
                                >
                                  {a.fileName}
                                </button>
                                {a.step ? (
                                  <span className="text-slate-500 dark:text-[#3d4f6a]"> · {a.step}-bosqich</span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2 text-slate-600 dark:text-[#7a8eaa]">{dateStr}</td>
                    <td className="px-3 py-2">
                      <span className={st.cls}>{st.text}</span>
                    </td>
                    <td className="px-3 py-2 text-cyan-300">{app.gasnInspectorFio || '—'}</td>
                    <td className="px-3 py-2">
                      {isGasn ? (
                        <div className="flex flex-wrap items-center gap-1">
                          <select
                            className="max-w-[200px] rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#0f172a] dark:text-white dark:shadow-none"
                            value={fioInputs[app._id] ?? app.gasnInspectorFio ?? ''}
                            onChange={(e) => setFio(app._id, e.target.value)}
                            disabled={app.status !== 'pending'}
                          >
                            <option value="">— Xodimni tanlang —</option>
                            {inspectors.map((x) => (
                              <option key={x.id} value={x.fio}>
                                {x.fio}
                                {x.position ? ` (${x.position})` : ''}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => assignFio(app._id)}
                            disabled={busyId === app._id || app.status !== 'pending'}
                            className="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] text-slate-800 hover:bg-slate-200 disabled:opacity-40 dark:border-transparent dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          >
                            Saqlash
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 dark:text-[#3d4f6a]">—</span>
                      )}
                    </td>
                    {isGasn && (
                      <td className="px-3 py-2">
                        {app.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => approve(app._id)}
                            disabled={
                              busyId === app._id || !(fioInputs[app._id] ?? app.gasnInspectorFio ?? '').trim()
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-emerald-500"
                            title={
                              !(fioInputs[app._id] ?? app.gasnInspectorFio ?? '').trim()
                                ? 'Avval F.I.Sh. kiriting yoki saqlang'
                                : ''
                            }
                          >
                            Tasdiqlash
                          </button>
                        ) : (
                          <span className="text-slate-500 dark:text-[#3d4f6a]">—</span>
                        )}
                      </td>
                    )}
                    {isGasn && (
                      <td className="px-3 py-2">
                        {app.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => reject(app._id)}
                            disabled={busyId === app._id}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 shadow-sm hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-300 dark:shadow-none dark:hover:bg-red-950/50"
                          >
                            Rad etish
                          </button>
                        ) : (
                          <span className="text-slate-500 dark:text-[#3d4f6a]">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detailApp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetailApp(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] p-5 text-sm text-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Obyekt ro‘yxatga olish jadvallari</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-[#7a8eaa]">{detailApp.objectName}</p>
              </div>
              <button
                type="button"
                className="rounded px-2 py-1 text-lg leading-none text-slate-400 hover:bg-white/10 hover:text-white"
                onClick={() => setDetailApp(null)}
                aria-label="Yopish"
              >
                ×
              </button>
            </div>

            {!detailApp.registrationSummary ? (
              <p className="text-amber-300/95">Bu arizada xulosa / ishlar hajmi jadvallari kiritilmagan (eski ariza).</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#3d4f6a]">Xulosa jadval (so‘m)</h4>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full min-w-[320px] text-xs">
                      <tbody>
                        {SUMMARY_FIELD_META.slice(0, 4).map((row, idx) => (
                          <tr key={row.key} className="border-b border-slate-200 dark:border-white/10">
                            <td className="px-2 py-1.5 text-slate-600 dark:text-[#7a8eaa]">{idx + 1}</td>
                            <td className="px-2 py-1.5 text-slate-300">{row.label}</td>
                            <td className="px-2 py-1.5 text-right text-slate-900 dark:text-white">
                              {Number(detailApp.registrationSummary[row.key] ?? 0).toLocaleString('uz-UZ')}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-b border-slate-200 dark:border-white/10 bg-black/20">
                          <td colSpan={2} className="px-2 py-1.5 font-medium text-slate-300">
                            Jami (QQSsiz)
                          </td>
                          <td className="px-2 py-1.5 text-right font-medium text-emerald-300">
                            {(
                              Number(detailApp.registrationSummary.materials ?? 0) +
                              Number(detailApp.registrationSummary.equipment ?? 0) +
                              Number(detailApp.registrationSummary.machinery ?? 0) +
                              Number(detailApp.registrationSummary.wages ?? 0)
                            ).toLocaleString('uz-UZ')}
                          </td>
                        </tr>
                        {SUMMARY_FIELD_META.slice(4).map((row, idx) => (
                          <tr key={row.key} className="border-b border-slate-200 dark:border-white/10">
                            <td className="px-2 py-1.5 text-slate-600 dark:text-[#7a8eaa]">{idx + 5}</td>
                            <td className="px-2 py-1.5 text-slate-300">{row.label}</td>
                            <td className="px-2 py-1.5 text-right text-slate-900 dark:text-white">
                              {Number(detailApp.registrationSummary[row.key] ?? 0).toLocaleString('uz-UZ')}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-black/25">
                          <td colSpan={2} className="px-2 py-1.5 font-semibold text-slate-200">
                            Jami qurilish-montaj
                          </td>
                          <td className="px-2 py-1.5 text-right font-semibold text-cyan-300">
                            {(
                              Number(detailApp.registrationSummary.materials ?? 0) +
                              Number(detailApp.registrationSummary.equipment ?? 0) +
                              Number(detailApp.registrationSummary.machinery ?? 0) +
                              Number(detailApp.registrationSummary.wages ?? 0) +
                              Number(detailApp.registrationSummary.otherExpenses ?? 0) +
                              Number(detailApp.registrationSummary.vat ?? 0)
                            ).toLocaleString('uz-UZ')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600 dark:text-[#7a8eaa]">
                    Ishchi-xodimlar:{' '}
                    <span className="text-slate-200">
                      {detailApp.registrationEmployeeCount != null
                        ? `${detailApp.registrationEmployeeCount} nafar`
                        : '—'}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#3d4f6a]">Ishlar hajmlari</h4>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full min-w-[640px] text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1a2438] text-left text-slate-500 dark:text-[#3d4f6a]">
                          <th className="px-2 py-1.5">№</th>
                          <th className="px-2 py-1.5">Komponent</th>
                          <th className="px-2 py-1.5">O‘lchov</th>
                          <th className="px-2 py-1.5 text-right">Hajm</th>
                          <th className="px-2 py-1.5 text-right">Birlik narxi</th>
                          <th className="px-2 py-1.5 text-right">Summa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detailApp.workVolumes || []).map((row, i) => {
                          const vol = Number(row.volume ?? 0);
                          const pr = Number(row.pricePerUnit ?? 0);
                          const sum = vol * pr;
                          const label =
                            row.labelUz || WORK_VOLUME_ROWS.find((w) => w.key === row.key)?.labelUz || row.key;
                          return (
                            <tr key={row.key || i} className="border-b border-slate-200 dark:border-white/10">
                              <td className="px-2 py-1 text-slate-600 dark:text-[#7a8eaa]">{i + 1}</td>
                              <td className="px-2 py-1 text-slate-300">{label}</td>
                              <td className="px-2 py-1 text-[#a1a1aa]">{row.unit || '—'}</td>
                              <td className="px-2 py-1 text-right text-slate-200">{vol.toLocaleString('uz-UZ')}</td>
                              <td className="px-2 py-1 text-right text-slate-200">{pr.toLocaleString('uz-UZ')}</td>
                              <td className="px-2 py-1 text-right text-slate-900 dark:text-white">{sum.toLocaleString('uz-UZ')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function GasnDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsStatusFilter, setApplicationsStatusFilter] = useState(null);
  const [compareId, setCompareId] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [msg, setMsg] = useState('');
  const [korxonaModal, setKorxonaModal] = useState(null);
  const { token } = useAuth();

  const companyById = useMemo(() => {
    const m = new Map();
    (companies || []).forEach((c) => m.set(String(c._id), c));
    return m;
  }, [companies]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/applications'),
      api.get('/reports'),
      api.get('/projects'),
      api.get('/dashboard/companies'),
      api.get('/alerts'),
    ])
      .then(([a, apps, r, p, co, al]) => {
        setSummary(a.data);
        setApplications(apps.data.applications || []);
        setReports(r.data.reports || []);
        setProjects(p.data.projects || []);
        setCompanies(co.data.companies || []);
        setAlerts(al.data.alerts || []);
      })
      .catch(() => setMsg("Ma'lumot yuklanmadi"));
  }, [token]);

  const goPage = (page, appsFilter = null) => {
    setApplicationsStatusFilter(page === 'arizalar' ? appsFilter : null);
    setActivePage(page);
  };

  const computedKpi = useMemo(() => {
    const apps = applications || [];
    const approvedCount = apps.filter((a) => a.status === 'approved').length;
    const rejectedCount = apps.filter((a) => a.status === 'rejected').length;

    const latestReportByCompany = new Map();
    for (const r of reports || []) {
      const cid = String(r.companyUserId);
      const key = (Number(r.periodYear || 0) * 100 + Number(r.periodMonth || 0));
      const existing = latestReportByCompany.get(cid);
      if (!existing) {
        latestReportByCompany.set(cid, { report: r, key });
      } else if (key > existing.key) {
        latestReportByCompany.set(cid, { report: r, key });
      }
    }

    const toNum = (v) => (v == null || Number.isNaN(Number(v)) ? 0 : Number(v));
    let yakunlangan = 0;
    let davom = 0;
    let toxtatilgan = 0;
    let totalContract = 0;
    let totalPayroll = 0;
    let totalEmployees = 0;

    for (const pr of projects || []) {
      totalContract += toNum(pr.smetaContractSum);
      totalPayroll += toNum(pr.smetaPayrollEstimate);
      totalEmployees += toNum(pr.smetaEmployeeCount);

      const rep = latestReportByCompany.get(String(pr.companyUserId))?.report ?? null;
      const { holat } = holatFromProjectReport(pr, rep);
      if (holat === 'b-green') yakunlangan++;
      else if (holat === 'b-red') toxtatilgan++;
      else if (holat === 'b-blue') davom++;
    }

    const formatMlrd = (n) => {
      const mlrd = n / 1_000_000_000;
      return `${mlrd.toLocaleString('uz-UZ', { maximumFractionDigits: 2 })} mlrd so‘m`;
    };

    return {
      jamiArizalar: apps.length,
      maqullangan: approvedCount,
      radEtilgan: rejectedCount,
      yakunlanganObyektlar: yakunlangan,
      davomEtotgan: davom,
      toxtatilgan,
      umumiyLoyihaQiymati: formatMlrd(totalContract),
      umumiyIshHaqiFondi: formatMlrd(totalPayroll),
      umumiyIshchilar: totalEmployees,
      smetaNomuvofiqlik: summary?.stats?.alertsOpen ?? 0,
    };
  }, [applications, projects, reports, summary]);

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
    dashboard: `${ORG_SHORT} — bosh sahifa`,
    obyektlar: "Obyektlar ro'yxati",
    taqqoslash: 'Smeta va haqiqiy ko‘rsatkichlar',
    hisobotlar: 'Korxonalar hisobotlari',
    arizalar: 'Kelib tushgan arizalar',
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            summary={summary}
            projects={projects}
            reports={reports}
            alerts={alerts}
            companyById={companyById}
            onOpenKorxona={setKorxonaModal}
            kpi={computedKpi}
            onGoPage={goPage}
          />
        );
      case 'obyektlar':
        return (
          <ObjectsPage projects={projects} reports={reports} companyById={companyById} onOpenKorxona={setKorxonaModal} />
        );
      case 'taqqoslash':
        return (
          <ComparisonPage
            reports={reports}
            projects={projects}
            companyById={companyById}
            compareId={compareId}
            setCompareId={setCompareId}
            compareResult={compareResult}
            runCompare={runCompare}
          />
        );
      case 'hisobotlar':
        return (
          <ReportsPage reports={reports} companyById={companyById} downloadPdf={downloadPdf} onOpenKorxona={setKorxonaModal} />
        );
      case 'arizalar':
        return <ApplicationsPage onError={setMsg} statusFilter={applicationsStatusFilter} />;
      default:
        return (
          <DashboardPage
            summary={summary}
            projects={projects}
            reports={reports}
            alerts={alerts}
            companyById={companyById}
            onOpenKorxona={setKorxonaModal}
            kpi={computedKpi}
            onGoPage={goPage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0b1120] dark:text-[#e6edf8]">
      <Sidebar activePage={activePage} setActivePage={(id) => goPage(id, null)} projectsCount={projects.length} />
      <KorxonaModal open={!!korxonaModal} onClose={() => setKorxonaModal(null)} modal={korxonaModal} reports={reports} />

      <div className="ml-0 flex flex-col sm:ml-56 lg:ml-60">
        <div className="sticky top-0 z-40 flex h-auto min-h-14 flex-wrap items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-[#111827] sm:px-6">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{pageTitles[activePage]}</div>
            <div className="max-w-xl text-[10px] text-slate-600 sm:text-xs dark:text-[#7a8eaa]">{ORG_FULL_NAME}</div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[10px] text-slate-600 sm:text-xs dark:text-[#7a8eaa]">
            <ThemeToggle />
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
