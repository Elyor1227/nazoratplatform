// import { useEffect, useState } from 'react';
// import api from '../../api.js';
// import AppShell from '../../components/AppShell.jsx';
// import { downloadBlob } from '../../utils/downloadBlob.js';

// export default function CompanyDashboard() {
//   const [summary, setSummary] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [msg, setMsg] = useState('');
//   const [form, setForm] = useState({
//     periodYear: new Date().getFullYear(),
//     periodMonth: new Date().getMonth() + 1,
//     employeeCount: '',
//     payrollFund: '',
//     contractAmount: '',
//     constructionType: '',
//     notes: '',
//   });
//   const [files, setFiles] = useState([]);

//   async function load() {
//     const [s, r] = await Promise.all([
//       api.get('/dashboard/summary'),
//       api.get('/reports'),
//     ]);
//     setSummary(s.data);
//     setReports(r.data.reports || []);
//   }

//   useEffect(() => {
//     load().catch(() => setMsg('Ma\'lumot yuklanmadi'));
//   }, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setMsg('');
//     try {
//       const fd = new FormData();
//       fd.append('periodYear', String(form.periodYear));
//       fd.append('periodMonth', String(form.periodMonth));
//       fd.append('employeeCount', String(form.employeeCount));
//       fd.append('payrollFund', String(form.payrollFund));
//       fd.append('contractAmount', String(form.contractAmount));
//       fd.append('constructionType', form.constructionType);
//       fd.append('notes', form.notes || '');
//       for (const f of files) {
//         fd.append('invoices', f);
//       }
//       await api.post('/reports', fd);
//       setMsg('Hisobot va fakturalar saqlandi.');
//       setFiles([]);
//       load();
//     } catch (err) {
//       setMsg(err.response?.data?.error || 'Xatolik');
//     }
//   }

//   async function downloadPdf(reportId) {
//     try {
//       await downloadBlob(api, `/reports/${reportId}/pdf`, 'hisobot.pdf');
//     } catch {
//       setMsg('PDF yuklab olinmadi');
//     }
//   }

//   async function downloadInvoice(reportId, storedName, fileName) {
//     try {
//       const path = `/reports/${reportId}/files/${encodeURIComponent(storedName)}`;
//       await downloadBlob(api, path, fileName || 'fayl');
//     } catch {
//       setMsg('Fayl yuklab olinmadi');
//     }
//   }

//   return (
//     <AppShell title="Korxona kabineti">
//       {summary?.stats && (
//         <div className="mb-10 grid gap-4 sm:grid-cols-3">
//           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
//             <p className="text-sm text-slate-400">Hisobotlar</p>
//             <p className="mt-1 font-display text-2xl font-bold text-white">{summary.stats.reportCount}</p>
//           </div>
//           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
//             <p className="text-sm text-slate-400">Bog‘langan smeta</p>
//             <p className="mt-1 font-display text-2xl font-bold text-white">{summary.stats.projectsLinked}</p>
//           </div>
//           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
//             <p className="text-sm text-slate-400">So‘nggi davr</p>
//             <p className="mt-1 text-lg text-white">
//               {summary.stats.lastReport
//                 ? `${summary.stats.lastReport.periodMonth}/${summary.stats.lastReport.periodYear}`
//                 : '—'}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="grid gap-10 lg:grid-cols-2">
//         <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
//           <h2 className="font-display text-xl font-semibold text-white">Yangi hisobot</h2>
//           <p className="mt-1 text-sm text-slate-400">
//             Xodimlar, ish haqi fondi, shartnoma, qurilish turi, elektron fakturalar (PDF/rasm)
//           </p>
//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm text-slate-300">Yil</label>
//                 <input
//                   type="number"
//                   required
//                   value={form.periodYear}
//                   onChange={(e) => setForm({ ...form, periodYear: e.target.value })}
//                   className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm text-slate-300">Oy</label>
//                 <input
//                   type="number"
//                   min={1}
//                   max={12}
//                   required
//                   value={form.periodMonth}
//                   onChange={(e) => setForm({ ...form, periodMonth: e.target.value })}
//                   className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Xodimlar soni</label>
//               <input
//                 type="number"
//                 min={0}
//                 required
//                 value={form.employeeCount}
//                 onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
//                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Ish haqi fondi (so‘m)</label>
//               <input
//                 type="number"
//                 min={0}
//                 required
//                 value={form.payrollFund}
//                 onChange={(e) => setForm({ ...form, payrollFund: e.target.value })}
//                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Shartnoma summasi (so‘m)</label>
//               <input
//                 type="number"
//                 min={0}
//                 required
//                 value={form.contractAmount}
//                 onChange={(e) => setForm({ ...form, contractAmount: e.target.value })}
//                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Qurilish turi</label>
//               <input
//                 required
//                 value={form.constructionType}
//                 onChange={(e) => setForm({ ...form, constructionType: e.target.value })}
//                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//                 placeholder="Masalan: turar-joy, infratuzilma"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Elektron fakturalar</label>
//               <input
//                 type="file"
//                 multiple
//                 accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf"
//                 onChange={(e) => setFiles(Array.from(e.target.files || []))}
//                 className="mt-1 w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-white"
//               />
//               {files.length > 0 && (
//                 <p className="mt-1 text-xs text-slate-500">{files.length} ta fayl tanlandi</p>
//               )}
//             </div>
//             <div>
//               <label className="text-sm text-slate-300">Izoh</label>
//               <textarea
//                 value={form.notes}
//                 onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                 rows={2}
//                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
//               />
//             </div>
//             {msg && <p className="text-sm text-brand-400">{msg}</p>}
//             <button
//               type="submit"
//               className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-500"
//             >
//               Yuklash
//             </button>
//           </form>
//         </section>

//         <section>
//           <h2 className="font-display text-xl font-semibold text-white">Yuborilgan hisobotlar</h2>
//           <ul className="mt-4 space-y-4">
//             {reports.map((r) => (
//               <li
//                 key={r._id}
//                 className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <span className="text-white">
//                     {r.periodMonth}/{r.periodYear}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => downloadPdf(r._id)}
//                     className="rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
//                   >
//                     PDF eksport
//                   </button>
//                 </div>
//                 <p className="mt-1 text-slate-400">
//                   xodimlar: {r.employeeCount}, shartnoma: {r.contractAmount?.toLocaleString()} so‘m
//                 </p>
//                 {r.invoices?.length > 0 && (
//                   <ul className="mt-2 space-y-1 border-t border-white/10 pt-2 text-xs">
//                     {r.invoices.map((inv) => (
//                       <li key={inv._id || inv.storedName + inv.fileName}>
//                         {inv.storedName ? (
//                           <button
//                             type="button"
//                             onClick={() => downloadInvoice(r._id, inv.storedName, inv.fileName)}
//                             className="text-brand-400 hover:underline"
//                           >
//                             {inv.fileName}
//                           </button>
//                         ) : (
//                           <span>{inv.fileName}</span>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//             {reports.length === 0 && <li className="text-slate-500">Hali hisobot yo‘q.</li>}
//           </ul>
//         </section>
//       </div>
//     </AppShell>
//   );
// }

// ======================================================================================
// ======================================================================================
// ======================================================================================
// ======================================================================================

// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AppShell from '../../components/AppShell';
import { useAuth } from '../../context/AuthContext';

// -------------------- MOCK DATA --------------------
const fayllar = [
  { icon: '📊', name: '2025-Q4 Ish haqi vedomosti.xlsx', meta: 'XLSX · 245 KB', date: '12.01.2026', status: 's-green', st: 'Qabul qilindi' },
  { icon: '📄', name: '2025-Q4 Shartnoma №4.pdf', meta: 'PDF · 1.2 MB', date: '12.01.2026', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📋', name: '2025-Q3 Hisobot to\'plami.pdf', meta: 'PDF · 3.4 MB', date: '10.10.2025', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📎', name: '2024-yillik yakuniy hisobot.pdf', meta: 'PDF · 5.1 MB', date: '15.01.2025', status: 's-blue', st: 'Arxivda' },
];

const xabarlar = [
  { from: 'Soliq inspeksiyasi', text: '2025-Q4 hisobotingiz tasdiqlandi.', time: 'Bugun 08:30', type: 's-green' },
  { from: 'GASN', text: '14-ob\'ekt kamerasi ma\'lumotlari muvofiqlashtirish talab qiladi.', time: 'Kecha 16:45', type: 's-yellow' },
  { from: 'Tizim', text: '2025-Q1 hisobotini topshirish muddati — 10 aprel 2026.', time: '27.03.2026', type: 's-blue' },
];

const xodimlarData = [
  { n: 'Karimov Alisher', lav: 'Usta duvol', pinfl: '12345678901234', ihq: '3 200 000', sana: '01.03.2024', holat: 's-green' },
  { n: 'Rahimov Bobur', lav: 'Elektrik', pinfl: '23456789012345', ihq: '2 800 000', sana: '15.06.2024', holat: 's-green' },
  { n: 'Toshmatov Jasur', lav: 'Santexnik', pinfl: '34567890123456', ihq: '2 600 000', sana: '01.09.2024', holat: 's-green' },
  { n: 'Mirzayev Sardor', lav: 'Muhandis', pinfl: '45678901234567', ihq: '4 500 000', sana: '10.01.2025', holat: 's-green' },
  { n: 'Xoliqov Nodir', lav: 'Ishchi', pinfl: '56789012345678', ihq: '2 200 000', sana: '01.02.2025', holat: 's-yellow' },
  { n: 'Qodirov Ulugbek', lav: 'Kranchi', pinfl: '67890123456789', ihq: '3 800 000', sana: '05.03.2025', holat: 's-green' },
];

const tekshiruvlar = [
  { title: 'Soliq inspeksiyasi — 2024 yillik', status: 's-yellow', st: 'Jarayonda', date: '20.03.2026', detail: 'Inspektor: B. Toshmatov' },
  { title: 'GASN — 14-ob\'ekt kamera', status: 's-yellow', st: 'Kutilmoqda', date: '18.03.2026', detail: 'Kamera #14 ma\'lumotlari tahlil qilinmoqda' },
  { title: 'Mehnat inspeksiyasi — 2025-Q3', status: 's-green', st: 'Yopildi', date: '05.01.2026', detail: 'Hech qanday qonunbuzarlik topilmadi' },
  { title: 'Soliq inspeksiyasi — 2025-Q2', status: 's-green', st: 'Yopildi', date: '10.10.2025', detail: 'Tasdiqlandi' },
];

const reqDocsList = [
  { key: 'vedomost', label: 'Ish haqi vedomosti', formats: 'XLSX, PDF' },
  { key: 'shartnoma', label: 'Qurilish shartnomasi', formats: 'PDF' },
  { key: 'faktura', label: 'Elektron hisob-faktura', formats: 'XML, PDF' },
  { key: 'ijtimoiy', label: 'Ijtimoiy sug\'urta hisoboti', formats: 'PDF, XLSX' },
];

// Helper functions
const getStatusClass = (type) => {
  const classes = {
    's-green': 'bg-emerald-500/10 text-emerald-600',
    's-yellow': 'bg-amber-500/10 text-amber-600',
    's-red': 'bg-red-500/10 text-red-600',
    's-blue': 'bg-blue-500/10 text-blue-600',
    's-gray': 'bg-gray-100 text-gray-600',
  };
  return classes[type] || classes['s-gray'];
};

// -------------------- SIDEBAR --------------------
const Sidebar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  const mainItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', badge: null },
    { id: 'hisobot', icon: '📋', label: 'Hisobot yuklash', badge: null },
    { id: 'xodimlar', icon: '👷', label: "Xodimlar ro'yxati", badge: null },
    { id: 'shartnomalar', icon: '📄', label: 'Shartnomalar', badge: null },
  ];
  const statusItems = [
    { id: 'tekshiruv', icon: '🔍', label: 'Tekshiruv holati', badge: { type: 'danger', text: '1' } },
    { id: 'xabarlar', icon: '🔔', label: 'Xabarlar', badge: { type: 'ok', text: '3' } },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[230px] bg-[#0f1623] flex flex-col z-50">
      <div className="pt-5 pb-4 px-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-lg">🏢</div>
          <div>
            <div className="font-bold text-xs font-['Geologica'] text-white">Korxona Kabineti</div>
            <div className="text-[10px] text-[#5d6b85]">Qurilish Nazorat Tizimi</div>
          </div>
        </div>
        <div className="mt-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs font-semibold text-white">Baraka Qurilish LLC</div>
          <div className="text-[11px] text-[#5d6b85] font-mono">INN: 307 123 456</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-emerald-400">Faol korxona</span>
          </div>
        </div>
      </div>

      <div className="px-3 pt-4 pb-1">
        <div className="text-[10px] tracking-wider uppercase text-[#5d6b85] px-2 mb-1.5">Asosiy</div>
        {mainItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              activePage === item.id 
                ? 'bg-blue-500/20 text-blue-300' 
                : 'text-[#c8d0e0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-sm w-4">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="px-3 pt-4 pb-1">
        <div className="text-[10px] tracking-wider uppercase text-[#5d6b85] px-2 mb-1.5">Holat</div>
        {statusItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              activePage === item.id 
                ? 'bg-blue-500/20 text-blue-300' 
                : 'text-[#c8d0e0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-sm w-4">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                item.badge.type === 'danger' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {item.badge.text}
              </span>
            )}
          </button>
        ))}
      </div>

        <button onClick={logout} style={{ width: '100%', height: '40px', backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Chiqish</button>
      <div className="mt-auto p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-semibold text-blue-300">AK</div>
          <div>
            <div className="text-xs font-medium text-white">A. Karimov</div>
            <div className="text-[10px] text-[#5d6b85]">Bosh buxgalter</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// -------------------- STAT CARD --------------------
const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const colorMap = {
    blue: 'border-t-blue-600',
    green: 'border-t-emerald-600',
    amber: 'border-t-amber-600',
  };
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-4 relative overflow-hidden border-t-[3px] ${colorMap[color]}`}>
      <span className="absolute right-4 top-4 text-2xl opacity-15">{icon}</span>
      <div className="text-[11px] font-medium text-gray-500 mb-2 tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-[11px] text-gray-400 mt-1.5">{sub}</div>
    </div>
  );
};

// -------------------- BAR CHART --------------------
const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            { label: 'Daromad solig\'i', data: [5.6, 5.8, 6.1, 5.9, 6.4, 6.2, 6.8, 6.5, 7.1, 6.9, 7.4, 7.0], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 5, borderSkipped: false },
            { label: 'Ijtimoiy soliq', data: [5.2, 5.4, 5.7, 5.5, 5.9, 5.8, 6.3, 6.0, 6.6, 6.4, 6.9, 6.5], backgroundColor: 'rgba(5,150,105,0.65)', borderRadius: 5, borderSkipped: false }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b7a99', font: { size: 11 } } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b7a99', font: { size: 11 }, callback: v => v + ' mln' } }
          }
        }
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

// -------------------- DASHBOARD PAGE --------------------
const DashboardPage = ({ setActivePage }) => {
  return (
    <div>
      {/* Notification */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-3">
        <span className="text-amber-600 text-base">⚠️</span>
        <div className="flex-1">
          <div className="text-xs font-semibold text-amber-700">2025-yil I chorak hisobotini topshirish muddati: 10 aprel 2026</div>
          <div className="text-[11px] text-amber-600">Ish haqi fondi, xodimlar soni va aylanma ma'lumotlarini yuklang</div>
        </div>
        <button onClick={() => setActivePage('hisobot')} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors">Yuklash →</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-6">
        <StatCard icon="👷" label="Rasmiy xodimlar soni" value="47" sub="So'nggi hisobot: 15.01.2026" color="blue" />
        <StatCard icon="💰" label="Oylik ish haqi fondi" value="141 mln so'm" sub="O'rtacha: 3,0 mln so'm/kishi" color="green" />
        <StatCard icon="📊" label="Yillik aylanma (2025)" value="1,2 mlrd so'm" sub="QQSsiz, 4 ta shartnoma" color="amber" />
        <StatCard icon="✅" label="Topshirilgan hisobotlar" value="8/9" sub="1 ta kutilmoqda" color="green" />
      </div>

      {/* Chart + Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-800">Oylik soliq to'lovlar dinamikasi</div>
            <div className="text-xs text-gray-500">2025 yil · mln so'm</div>
          </div>
          <div className="p-5 h-52">
            <BarChart />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-800">Hisobot holati</div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {[
                { title: '2024-yil yillik hisobot', status: 'Qabul qilindi', statusClass: 's-green', date: '15.01.2025' },
                { title: '2025-Q3 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '10.10.2025' },
                { title: '2025-Q4 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '12.01.2026' },
                { title: '2025-Q1 chorak hisoboti', status: 'Kutilmoqda', statusClass: 's-yellow', date: 'Muddat: 10.04.2026' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${idx < 3 ? 'bg-emerald-500 border-emerald-500' : 'bg-amber-50 border-amber-500'}`}></div>
                    {idx < 3 && <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-xs font-medium text-gray-800">{item.title}</div>
                    <div className="mt-1"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(item.statusClass)}`}>{item.status}</span></div>
                    <div className="text-[11px] text-gray-400 mt-1">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files + Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-800">So'nggi yuklangan fayllar</div>
            <button onClick={() => setActivePage('hisobot')} className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">+ Yangi</button>
          </div>
          <div>
            {fayllar.map((f, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{f.icon}</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">{f.name}</div>
                  <div className="text-[11px] text-gray-500">{f.meta}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">{f.date}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(f.status)}`}>{f.st}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-800">Inspektordan xabarlar</div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">3 yangi</span>
          </div>
          <div>
            {xabarlar.map((x, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">💬</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">{x.from}</div>
                  <div className="text-[11px] text-gray-500">{x.text}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">{x.time}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(x.type)}`}>Yangi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- HISOBOT YUKLASH PAGE (Wizard) --------------------
const HisobotPage = () => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    davr: '2025-Q1 (Yanvar–Mart)',
    tur: 'Pudratchi (bosh)',
    xodim: '',
    ihf: '',
    aylanma: '',
    obekt: '',
    izoh: ''
  });

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const addFiles = (files) => {
    setUploadedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const buildReview = () => {
    const fmt = (v) => v ? Number(v).toLocaleString('uz-UZ') + ' so\'m' : '—';
    return (
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          ['Hisobot davri', formData.davr],
          ['Xodimlar soni', formData.xodim ? formData.xodim + ' nafar' : '—'],
          ['Ish haqi fondi', fmt(formData.ihf)],
          ['Aylanma (QQSsiz)', fmt(formData.aylanma)],
          ['Faol ob\'ektlar', formData.obekt ? formData.obekt + ' ta' : '—'],
        ].map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1">{k}</div>
            <div className="text-sm font-medium text-gray-800">{v}</div>
          </div>
        ))}
      </div>
    );
  };

  const resetForm = () => {
    setFormData({ davr: '2025-Q1 (Yanvar–Mart)', tur: 'Pudratchi (bosh)', xodim: '', ihf: '', aylanma: '', obekt: '', izoh: '' });
    setUploadedFiles([]);
    setStep(1);
  };

  const StepIndicator = () => (
    <div className="flex items-center mb-6">
      {[1, 2, 3, 4].map((s, idx) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-blue-600 text-white' : 'bg-gray-100 border border-gray-300 text-gray-500'
            }`}>
              {s < step ? '✓' : s}
            </div>
            <span className={`text-xs font-medium ${s === step ? 'text-blue-600' : s < step ? 'text-emerald-600' : 'text-gray-500'}`}>
              {s === 1 ? "Ma'lumotlar" : s === 2 ? 'Fayllar' : s === 3 ? 'Tekshirish' : 'Yuborish'}
            </span>
          </div>
          {idx < 3 && <div className={`flex-1 h-px mx-2 ${s < step ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Ma'lumotlar
  if (step === 1) {
    return (
      <div>
        <StepIndicator />
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold text-gray-800">Hisobot ma'lumotlari</div>
              <div className="text-xs text-gray-500">Asosiy ko'rsatkichlarni kiriting</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600">2025-Q1 · I chorak</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Hisobot davri</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={formData.davr} onChange={(e) => updateFormData('davr', e.target.value)}>
                  <option>2025-Q1 (Yanvar–Mart)</option>
                  <option>2025-Q2 (Aprel–Iyun)</option>
                  <option>2024-yillik</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Korxona turi</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={formData.tur} onChange={(e) => updateFormData('tur', e.target.value)}>
                  <option>Pudratchi (bosh)</option>
                  <option>Subpudratchi</option>
                  <option>Yetkazib beruvchi</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Xodimlar soni (davr oxiri)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 47" value={formData.xodim} onChange={(e) => updateFormData('xodim', e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Oylik ish haqi fondi (so'm)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 141000000" value={formData.ihf} onChange={(e) => updateFormData('ihf', e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Choraklik aylanma (QQSsiz, so'm)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 300000000" value={formData.aylanma} onChange={(e) => updateFormData('aylanma', e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Faol qurilish ob'ektlari soni</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 3" value={formData.obekt} onChange={(e) => updateFormData('obekt', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Izoh (ixtiyoriy)</label>
                <textarea rows="2" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y" placeholder="Qo'shimcha ma'lumotlar..." value={formData.izoh} onChange={(e) => updateFormData('izoh', e.target.value)}></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(2)}>Davom etish →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Fayllar
  if (step === 2) {
    const handleDrop = (e) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => e.preventDefault();

    return (
      <div>
        <StepIndicator />
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-800">Hujjatlar yuklash</div>
            <div className="text-xs text-gray-500">Rasmiy hujjatlar va elektron faturalar</div>
          </div>
          <div className="p-5">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-4"
              onClick={() => document.getElementById('fileInput').click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-3xl mb-2">📂</div>
              <div className="text-sm font-medium text-gray-800">Fayllarni bu yerga tashlang yoki bosing</div>
              <div className="text-xs text-gray-500">Ish haqi vedomosti, shartnomalar, elektron faturalar</div>
              <div className="flex gap-1.5 justify-center mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">PDF</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">XLSX</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">XML</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">JPG</span>
              </div>
            </div>
            <input type="file" id="fileInput" multiple style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />

            <div className="space-y-2 mb-4">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-lg">{f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.xlsx') ? '📊' : '📎'}</span>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-800">{f.name}</div>
                    <div className="text-[11px] text-gray-500">{(f.size / 1024).toFixed(0)} KB</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600">Yuklandi</span>
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Talab qilinadigan hujjatlar</div>
              {reqDocsList.map(doc => (
                <div key={doc.key} className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
                  <span className="text-xs text-gray-700">{doc.label} <span className="text-gray-400">({doc.formats})</span></span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${uploadedFiles.length > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {uploadedFiles.length > 0 ? '✓ Yuklandi' : 'Kutilmoqda'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors" onClick={() => setStep(1)}>← Orqaga</button>
              <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(3)}>Davom etish →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Tekshirish
  if (step === 3) {
    return (
      <div>
        <StepIndicator />
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="px-5 py-3 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-800">Ma'lumotlarni tekshirish</div>
          </div>
          <div className="p-5">
            {buildReview()}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
              <div className="text-xs font-semibold text-amber-600 mb-1">⚠ Diqqat</div>
              <div className="text-xs text-gray-600">Yuborilgan ma'lumotlar soliq organlari tomonidan tekshiriladi. Noto'g'ri ma'lumot uchun ma'muriy javobgarlik ko'zda tutilgan.</div>
            </div>
            <div className="flex justify-between">
              <button className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors" onClick={() => setStep(2)}>← Orqaga</button>
              <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(4)}>Tasdiqlash va yuborish →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Muvaffaqiyat
  return (
    <div>
      <StepIndicator />
      <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <div className="text-xl font-semibold text-gray-800 mb-2">Hisobot muvaffaqiyatli yuborildi!</div>
          <div className="text-sm text-gray-500 mb-6">Hisobot raqami: <strong className="font-mono text-blue-600">#2026-BQL-0341</strong></div>
          <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
            <div className="flex justify-between text-xs py-1.5 border-b border-gray-200"><span className="text-gray-500">Yuborilgan sana</span><span className="font-medium">28.03.2026, 10:14</span></div>
            <div className="flex justify-between text-xs py-1.5 border-b border-gray-200"><span className="text-gray-500">Davr</span><span className="font-medium">2025-Q1</span></div>
            <div className="flex justify-between text-xs py-1.5"><span className="text-gray-500">Holat</span><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600">Tekshirilmoqda</span></div>
          </div>
          <div className="flex gap-2.5 justify-center">
            <button onClick={resetForm} className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">Yangi hisobot</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- XODIMLAR PAGE --------------------
const XodimlarPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [xodimlar, setXodimlar] = useState(xodimlarData);
  const [newXodim, setNewXodim] = useState({ n: '', lav: '', pinfl: '', ihq: '', sana: '', mut: '' });

  const addXodim = () => {
    if (newXodim.n && newXodim.lav) {
      setXodimlar(prev => [...prev, { ...newXodim, holat: 's-green', ihq: newXodim.ihq + ' so\'m' }]);
      setNewXodim({ n: '', lav: '', pinfl: '', ihq: '', sana: '', mut: '' });
      setModalOpen(false);
    }
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-gray-800">Xodimlar ro'yxati</div>
            <div className="text-xs text-gray-500">Rasmiy bandlik — jami {xodimlar.length} nafar</div>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ Xodim qo'shish</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">#</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">F.I.Sh</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Lavozim</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">PINFL</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Ish haqi</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Qabul sanasi</th>
                <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Holat</th>
              </tr>
            </thead>
            <tbody>
              {xodimlar.map((x, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3.5 py-2.5 text-xs text-gray-500">{i + 1}</td>
                  <td className="px-3.5 py-2.5 text-xs font-medium text-gray-800">{x.n}</td>
                  <td className="px-3.5 py-2.5 text-xs text-gray-500">{x.lav}</td>
                  <td className="px-3.5 py-2.5 text-[11px] font-mono text-gray-500">{x.pinfl}</td>
                  <td className="px-3.5 py-2.5 text-xs font-medium">{x.ihq} so'm</td>
                  <td className="px-3.5 py-2.5 text-xs text-gray-500">{x.sana}</td>
                  <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(x.holat)}`}>{x.holat === 's-green' ? 'Faol' : 'Vaqtinchalik'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div className="text-base font-semibold text-gray-800">Yangi xodim qo'shish</div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">F.I.Sh</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="Karimov Alisher Bahodir o'g'li" value={newXodim.n} onChange={(e) => setNewXodim({ ...newXodim, n: e.target.value })} /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Lavozim</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="Usta duvol" value={newXodim.lav} onChange={(e) => setNewXodim({ ...newXodim, lav: e.target.value })} /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">PINFL</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="12345678901234" maxLength="14" value={newXodim.pinfl} onChange={(e) => setNewXodim({ ...newXodim, pinfl: e.target.value })} /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Ish haqi (so'm)</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="3000000" value={newXodim.ihq} onChange={(e) => setNewXodim({ ...newXodim, ihq: e.target.value })} /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Qabul sanasi</label><input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" value={newXodim.sana} onChange={(e) => setNewXodim({ ...newXodim, sana: e.target.value })} /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Mutaxassislik</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" value={newXodim.mut} onChange={(e) => setNewXodim({ ...newXodim, mut: e.target.value })}>
                  <option>Qurilishchi</option><option>Elektrik</option><option>Santexnik</option><option>Usta</option><option>Muhandis</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">Bekor</button>
              <button onClick={addXodim} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- TEKSHIRUV PAGE --------------------
const TekshiruvPage = () => {
  return (
    <div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5">
        <div className="flex gap-2.5">
          <span className="text-red-500">🔴</span>
          <div>
            <div className="text-xs font-semibold text-red-700">Faol tekshiruv: Soliq inspeksiyasi 2024-yillik hisobotni tekshirmoqda</div>
            <div className="text-[11px] text-red-600">Ish raqami: TK-2026-0089 · Inspektor: B. Toshmatov · Muddat: 05.04.2026</div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-800">Tekshiruv tarixi</div>
        </div>
        <div>
          {tekshiruvlar.map((t, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-800">{t.title}</div>
                <div className="text-[11px] text-gray-500">{t.detail}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-400">{t.date}</div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(t.status)}`}>{t.st}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------- SHARTNOMALAR PAGE (placeholder) --------------------
const ShartnomalarPage = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
    <div className="text-4xl mb-3">📄</div>
    <div className="text-base font-semibold text-gray-800">Shartnomalar bo'limi</div>
    <div className="text-sm text-gray-500 mt-1">Tez orada yangi funksiyalar qo'shiladi</div>
  </div>
);

// -------------------- XABARLAR PAGE (placeholder) --------------------
const XabarlarPage = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
    <div className="text-4xl mb-3">🔔</div>
    <div className="text-base font-semibold text-gray-800">Xabarlar</div>
    <div className="text-sm text-gray-500 mt-1">Sizda 3 ta yangi xabar mavjud</div>
  </div>
);

// -------------------- MAIN APP --------------------
const CompanyDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} />;
      case 'hisobot': return <HisobotPage />;
      case 'xodimlar': return <XodimlarPage />;
      case 'shartnomalar': return <ShartnomalarPage />;
      case 'tekshiruv': return <TekshiruvPage />;
      case 'xabarlar': return <XabarlarPage />;
      default: return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  const pageTitles = {
    dashboard: 'Korxona Dashboard',
    hisobot: 'Hisobot Yuklash',
    xodimlar: "Xodimlar Ro'yxati",
    shartnomalar: 'Shartnomalar',
    tekshiruv: 'Tekshiruv Holati',
    xabarlar: 'Xabarlar',
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />      
      <div className="ml-[230px] flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-7 gap-3 sticky top-0 z-40">
          <div>
            <div className="text-sm font-semibold font-['Geologica']">{pageTitles[activePage]}</div>
            <div className="text-xs text-gray-500">Baraka Qurilish LLC · INN 307123456</div>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 flex items-center gap-1">⚠ 1 ta ogohlantirish</span>
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">2025-Q1 hisoboti kutilmoqda</span>
            <span className="text-xs text-gray-500">28.03.2026</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-7">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
