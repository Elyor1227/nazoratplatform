  // import { useEffect, useState } from 'react';
  // import api from '../../api.js';
  // import AppShell from '../../components/AppShell.jsx';
  // import { downloadBlob } from '../../utils/downloadBlob.js';

  // export default function GasnDashboard() {
  //   const [summary, setSummary] = useState(null);
  //   const [companies, setCompanies] = useState([]);
  //   const [reports, setReports] = useState([]);
  //   const [projects, setProjects] = useState([]);
  //   const [compareId, setCompareId] = useState('');
  //   const [compareResult, setCompareResult] = useState(null);
  //   const [projectForm, setProjectForm] = useState({
  //     companyUserId: '',
  //     title: '',
  //     smetaEmployeeCount: '',
  //     smetaContractSum: '',
  //     smetaPayrollEstimate: '',
  //     notes: '',
  //   });
  //   const [msg, setMsg] = useState('');

  //   useEffect(() => {
  //     Promise.all([
  //       api.get('/dashboard/summary'),
  //       api.get('/dashboard/companies'),
  //       api.get('/reports'),
  //       api.get('/projects'),
  //     ])
  //       .then(([a, b, c, d]) => {
  //         setSummary(a.data);
  //         setCompanies(b.data.companies || []);
  //         setReports(c.data.reports || []);
  //         setProjects(d.data.projects || []);
  //       })
  //       .catch(() => setMsg('Ma\'lumot yuklanmadi'));
  //   }, []);

  //   async function runCompare() {
  //     setMsg('');
  //     setCompareResult(null);
  //     if (!compareId) return;
  //     try {
  //       const { data } = await api.get(`/compare/report/${compareId}`);
  //       setCompareResult(data);
  //     } catch (e) {
  //       setMsg(e.response?.data?.error || 'Taqqoslash xatosi');
  //     }
  //   }

  //   async function downloadPdf(reportId, periodMonth, periodYear) {
  //     try {
  //       await downloadBlob(
  //         api,
  //         `/reports/${reportId}/pdf`,
  //         `hisobot-${periodYear}-${String(periodMonth).padStart(2, '0')}.pdf`
  //       );
  //     } catch {
  //       setMsg('PDF yuklab olinmadi');
  //     }
  //   }

  //   async function submitProject(e) {
  //     e.preventDefault();
  //     setMsg('');
  //     try {
  //       await api.post('/projects', {
  //         ...projectForm,
  //         smetaEmployeeCount: Number(projectForm.smetaEmployeeCount) || 0,
  //         smetaContractSum: Number(projectForm.smetaContractSum) || 0,
  //         smetaPayrollEstimate: Number(projectForm.smetaPayrollEstimate) || 0,
  //       });
  //       setMsg('Smeta/loyiha saqlandi.');
  //       const { data } = await api.get('/projects');
  //       setProjects(data.projects || []);
  //     } catch (e) {
  //       setMsg(e.response?.data?.error || 'Xatolik');
  //     }
  //   }

  //   return (
  //     <AppShell title="GASN — smeta va hisobot">
  //       {summary?.stats && (
  //         <div className="mb-10 grid gap-4 sm:grid-cols-3">
  //           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
  //             <p className="text-sm text-slate-400">Hisobotlar (jami)</p>
  //             <p className="mt-1 font-display text-2xl font-bold text-white">{summary.stats.reportsTotal}</p>
  //           </div>
  //           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
  //             <p className="text-sm text-slate-400">Loyiha/smeta yozuvlari</p>
  //             <p className="mt-1 font-display text-2xl font-bold text-white">{summary.stats.projectsTotal}</p>
  //           </div>
  //           <div className="rounded-xl border border-white/10 bg-white/5 p-4">
  //             <p className="text-sm text-slate-400">Ochiq signal</p>
  //             <p className="mt-1 font-display text-2xl font-bold text-amber-400">{summary.stats.alertsOpen}</p>
  //           </div>
  //         </div>
  //       )}

  //       <div className="grid gap-10 lg:grid-cols-2">
  //         <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
  //           <h2 className="font-display text-lg font-semibold text-white">Smeta / loyiha bazasi</h2>
  //           <form onSubmit={submitProject} className="mt-4 space-y-3 text-sm">
  //             <div>
  //               <label className="text-slate-400">Korxona</label>
  //               <select
  //                 required
  //                 value={projectForm.companyUserId}
  //                 onChange={(e) => setProjectForm({ ...projectForm, companyUserId: e.target.value })}
  //                 className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
  //               >
  //                 <option value="">Tanlang</option>
  //                 {companies.map((c) => (
  //                   <option key={c._id} value={c._id}>
  //                     {c.organizationName || c.email}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             <input
  //               required
  //               placeholder="Loyiha nomi"
  //               value={projectForm.title}
  //               onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
  //               className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
  //             />
  //             <div className="grid grid-cols-3 gap-2">
  //               <input
  //                 type="number"
  //                 placeholder="Smeta xodimlar"
  //                 value={projectForm.smetaEmployeeCount}
  //                 onChange={(e) => setProjectForm({ ...projectForm, smetaEmployeeCount: e.target.value })}
  //                 className="rounded-lg border border-white/10 bg-slate-950 px-2 py-2 text-white"
  //               />
  //               <input
  //                 type="number"
  //                 placeholder="Smeta shartnoma"
  //                 value={projectForm.smetaContractSum}
  //                 onChange={(e) => setProjectForm({ ...projectForm, smetaContractSum: e.target.value })}
  //                 className="rounded-lg border border-white/10 bg-slate-950 px-2 py-2 text-white"
  //               />
  //               <input
  //                 type="number"
  //                 placeholder="Smeta IH fondi"
  //                 value={projectForm.smetaPayrollEstimate}
  //                 onChange={(e) => setProjectForm({ ...projectForm, smetaPayrollEstimate: e.target.value })}
  //                 className="rounded-lg border border-white/10 bg-slate-950 px-2 py-2 text-white"
  //               />
  //             </div>
  //             <button type="submit" className="w-full rounded-lg bg-brand-600 py-2 text-white hover:bg-brand-500">
  //               Saqlash
  //             </button>
  //           </form>
  //           <ul className="mt-6 max-h-48 space-y-2 overflow-auto text-xs text-slate-400">
  //             {projects.map((p) => (
  //               <li key={p._id}>
  //                 {p.title} — korxona ID: {p.companyUserId}
  //               </li>
  //             ))}
  //           </ul>
  //         </section>

  //         <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
  //           <h2 className="font-display text-lg font-semibold text-white">Hisobot vs smeta</h2>
  //           <p className="mt-1 text-sm text-slate-400">Hisobot ID ni kiriting va taqqoslang</p>
  //           <div className="mt-4 flex gap-2">
  //             <input
  //               value={compareId}
  //               onChange={(e) => setCompareId(e.target.value)}
  //               placeholder="Hisobot ID"
  //               className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
  //             />
  //             <button
  //               type="button"
  //               onClick={runCompare}
  //               className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
  //             >
  //               Taqqoslash
  //             </button>
  //           </div>
  //           {compareResult && (
  //             <div className="mt-4 rounded-lg bg-black/30 p-4 text-sm text-slate-300">
  //               {compareResult.diff ? (
  //                 <>
  //                   <p>
  //                     Xodimlar farqi: <span className="text-white">{compareResult.diff.employeeDelta}</span>
  //                   </p>
  //                   <p>
  //                     Shartnoma farqi:{' '}
  //                     <span className="text-white">{compareResult.diff.contractDelta?.toLocaleString?.()}</span>
  //                   </p>
  //                   <p className="mt-2 text-xs text-slate-500">
  //                     Haqiqiy: {JSON.stringify(compareResult.actual)} | Smeta: {JSON.stringify(compareResult.smeta)}
  //                   </p>
  //                 </>
  //               ) : (
  //                 <p>{compareResult.message}</p>
  //               )}
  //             </div>
  //           )}
  //         </section>
  //       </div>

  //       <section className="mt-10">
  //         <h2 className="font-display text-lg font-semibold text-white">Barcha hisobotlar</h2>
  //         <ul className="mt-3 space-y-3 text-sm text-slate-400">
  //           {reports.map((r) => (
  //             <li
  //               key={r._id}
  //               className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
  //             >
  //               <span>
  //                 <code className="text-brand-400">{r._id}</code> — {r.periodMonth}/{r.periodYear} — korxona:{' '}
  //                 {r.companyUserId}
  //               </span>
  //               <button
  //                 type="button"
  //                 onClick={() => downloadPdf(r._id, r.periodMonth, r.periodYear)}
  //                 className="rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
  //               >
  //                 PDF
  //               </button>
  //             </li>
  //           ))}
  //         </ul>
  //       </section>
  //       {msg && <p className="mt-6 text-sm text-brand-400">{msg}</p>}
  //     </AppShell>
  //   );
  // }
//  ==============================================================================================
//  ==============================================================================================
//  ==============================================================================================
//  ==============================================================================================
// // App.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import { useAuth } from '../../context/AuthContext';

// // -------------------- MOCK DATA --------------------
// const faolObektlar = [
//   { name: '42-maktab yangi binosi', manzil: 'Andijon sh., Navro\'z ko\'chasi', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, xodim: 38, kamera: true, progress: 72, holat: 'b-blue', holatTxt: 'Qurilmoqda' },
//   { name: 'Markaziy poliklinika rekonstr.', manzil: 'Asaka t., Mustaqillik ko\'chasi', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, xodim: 52, kamera: true, progress: 85, holat: 'b-green', holatTxt: 'Yakunlanmoqda' },
//   { name: 'Sport majmuasi (yangi)', manzil: 'Oltinko\'l t., Sport ko\'chasi', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, xodim: 29, kamera: false, progress: 45, holat: 'b-red', holatTxt: 'Tafovut!' },
//   { name: 'Maktabgacha ta\'lim markazi', manzil: 'Xo\'jaobod t., Bog\'ishamol', pudratchi: 'Yangi Bino Servis', smeta: 900, haqiqiy: 870, xodim: 14, kamera: true, progress: 60, holat: 'b-blue', holatTxt: 'Qurilmoqda' },
// ];

// const ogohlar = [
//   { color: '#f87171', text: '"Sport majmuasi" — smeta +19% oshib ketdi', sub: 'Tafovut: +350 mln so\'m · Tekshiruv talab etiladi', time: '09:14' },
//   { color: '#f87171', text: 'Kamera: ob\'ekt #7 — 31 norasmiy ishchi', sub: 'Hisobot: 14 nafar · Tafovut: 17 nafar', time: '08:50' },
//   { color: '#fbbf24', text: '"Master Stroy" hujjati ekspertizasiz', sub: 'Smeta-loyiha hujjati yuklanmagan', time: '08:22' },
//   { color: '#fbbf24', text: '42-maktab ob\'ektida material kirimisiz', sub: '70% material naqd pul, ombor kirimsiz', time: '07:55' },
//   { color: '#22d3ee', text: 'Yangi pudratchi ariza: "Al-Amin Pudrat"', sub: 'Ekspertiza tekshiruvi kutilmoqda', time: '07:30' },
// ];

// const obektlar = [
//   { name: '42-maktab yangi binosi', toifa: 'Maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, holat: 'b-blue', ht: 'Qurilmoqda', kamera: true },
//   { name: 'Markaziy poliklinika', toifa: 'Tibbiyot', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, holat: 'b-green', ht: 'Yakunlanmoqda', kamera: true },
//   { name: 'Sport majmuasi', toifa: 'Sport', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, holat: 'b-red', ht: 'Tafovut!', kamera: false },
//   { name: 'MTM Bog\'ishamol', toifa: 'Bog\'cha', pudratchi: 'Yangi Bino Servis', smeta: 900, haqiqiy: 870, holat: 'b-blue', ht: 'Qurilmoqda', kamera: true },
//   { name: 'Xo\'jaobod maktabi', toifa: 'Maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 1200, haqiqiy: 1180, holat: 'b-green', ht: 'Yakunlandi', kamera: true },
//   { name: 'Tuman kasalxonasi', toifa: 'Tibbiyot', pudratchi: 'Al-Amin Pudrat', smeta: 4500, haqiqiy: 3800, holat: 'b-yellow', ht: 'Ogohlantirish', kamera: false },
//   { name: 'Musiqa maktabi', toifa: 'Musiqa', pudratchi: 'Andijon Qurilish', smeta: 680, haqiqiy: 710, holat: 'b-yellow', ht: 'Tafovut', kamera: true },
// ];

// const taqqoslashData = [
//   { name: 'Sport majmuasi', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, xodimSmeta: 25, xodimHaqiqiy: 29, materialSmeta: 800, materialHaqiqiy: 980, status: 'nomo', ht: 'b-red', holatTxt: 'Nomuvofiq' },
//   { name: 'Tuman kasalxonasi', pudratchi: 'Al-Amin Pudrat', smeta: 4500, haqiqiy: 3800, xodimSmeta: 60, xodimHaqiqiy: 52, materialSmeta: 2000, materialHaqiqiy: 1750, status: 'nomo', ht: 'b-yellow', holatTxt: 'Tafovut' },
//   { name: 'Musiqa maktabi', pudratchi: 'Andijon Qurilish', smeta: 680, haqiqiy: 710, xodimSmeta: 10, xodimHaqiqiy: 12, materialSmeta: 300, materialHaqiqiy: 330, status: 'nomo', ht: 'b-yellow', holatTxt: 'Kichik tafovut' },
//   { name: '42-maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, xodimSmeta: 40, xodimHaqiqiy: 38, materialSmeta: 1000, materialHaqiqiy: 995, status: 'ok', ht: 'b-green', holatTxt: 'Muvofiq' },
//   { name: 'Markaziy poliklinika', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, xodimSmeta: 55, xodimHaqiqiy: 52, materialSmeta: 1400, materialHaqiqiy: 1320, status: 'ok', ht: 'b-green', holatTxt: 'Muvofiq' },
// ];

// const kameraData = [
//   { obekt: '42-maktab yangi binosi', soni: 4, signal: '2 daq oldin', aniqlangan: '38 ishchi, 3 texnika', holat: 'b-green', ht: 'Online' },
//   { obekt: 'Markaziy poliklinika', soni: 6, signal: '5 daq oldin', aniqlangan: '52 ishchi, 7 texnika', holat: 'b-green', ht: 'Online' },
//   { obekt: 'MTM Bog\'ishamol', soni: 3, signal: '1 daq oldin', aniqlangan: '14 ishchi, 1 texnika', holat: 'b-green', ht: 'Online' },
//   { obekt: 'Xo\'jaobod maktabi', soni: 5, signal: '12 daq oldin', aniqlangan: '28 ishchi, 4 texnika', holat: 'b-blue', ht: 'Buffering' },
//   { obekt: 'Asaka tibbiyot', soni: 2, signal: '48 daq oldin', aniqlangan: 'Ulanmagan', holat: 'b-red', ht: 'Offline' },
// ];

// const hisobotRows = [
//   { name: 'Baraka Qurilish LLC', inn: '307123456', hisobot: 47, kamera: 38, aylanma: '1.2 mlrd', holat: 'b-green', ht: 'Muvofiq' },
//   { name: 'Sharq Build Group', inn: '307654321', hisobot: 52, kamera: 52, aylanma: '890 mln', holat: 'b-green', ht: 'Muvofiq' },
//   { name: 'Master Stroy UZ', inn: '307111222', hisobot: 29, kamera: 31, aylanma: '450 mln', holat: 'b-yellow', ht: 'Tafovut +2' },
//   { name: 'Yangi Bino Servis', inn: '307987654', hisobot: 0, kamera: 14, aylanma: '2.1 mlrd', holat: 'b-red', ht: 'Nomuvofiq!' },
//   { name: 'Andijon Qurilish', inn: '307333444', hisobot: 1, kamera: 12, aylanma: '3.4 mlrd', holat: 'b-red', ht: 'Nomuvofiq!' },
//   { name: 'Al-Amin Pudrat', inn: '307555666', hisobot: 14, kamera: 14, aylanma: '670 mln', holat: 'b-green', ht: 'Muvofiq' },
// ];

// // Helper function
// const getBadgeClass = (type) => {
//   const classes = {
//     'b-red': 'bg-red-500/10 text-red-400',
//     'b-yellow': 'bg-yellow-500/10 text-yellow-400',
//     'b-green': 'bg-green-500/10 text-green-400',
//     'b-blue': 'bg-blue-500/10 text-blue-400',
//     'b-cyan': 'bg-cyan-500/10 text-cyan-400',
//   };
//   return classes[type] || 'bg-gray-500/10 text-gray-400';
// };

// // -------------------- SIDEBAR --------------------
// const Sidebar = ({ activePage, setActivePage }) => {
//   const {logout, user} = useAuth();
//   const navItems = [
//     { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
//     { id: 'obyektlar', icon: '🏗️', label: "Ob'ektlar", badge: { type: 'warn', text: '12' } },
//     { id: 'taqqoslash', icon: '⚖️', label: 'Smeta taqqoslash', badge: { type: 'default', text: '5' } },
//     { id: 'hisobotlar', icon: '📋', label: 'Korxona hisobotlari', badge: null },
//     { id: 'kamera', icon: '📷', label: 'Kamera monitoringi', badge: { type: 'ok', text: '17' } },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#111827] border-r border-white/10 flex flex-col z-50">
//       <div className="p-5 pb-4 border-b border-white/10">
//         <div className="flex items-center gap-2.5">
//           <div className="w-9 h-9 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-xl flex items-center justify-center text-lg">🔍</div>
//           <div>
//             <div className="font-bold text-sm">GASN Tizimi</div>
//             <div className="text-[10px] text-[#7a8eaa]">Qurilish nazorat inspeksiyasi</div>
//           </div>
//         </div>
//         <div className="mt-3 p-2.5 bg-[#1a2438] rounded-lg border border-white/10">
//           <div className="text-xs font-semibold">Andijon viloyati GASN</div>
//           <div className="text-[10px] text-[#7a8eaa]">Davlat arxitektura-qurilish nazorat inspeksiyasi</div>
//           <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full w-fit">
//             📍 Andijon viloyati
//           </div>
//         </div>
//       </div>

//       <div className="px-2.5 pt-4 pb-1">
//         <div className="text-[10px] tracking-wider uppercase text-[#3d4f6a] px-2 mb-1.5">Asosiy</div>
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActivePage(item.id)}
//             className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
//               activePage === item.id 
//                 ? 'bg-cyan-500/10 text-cyan-400' 
//                 : 'text-[#7a8eaa] hover:bg-[#1a2438] hover:text-[#e6edf8]'
//             }`}
//           >
//             <span className="text-[15px] w-4">{item.icon}</span>
//             <span>{item.label}</span>
//             {item.badge && (
//               <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
//                 item.badge.type === 'warn' ? 'bg-yellow-500/20 text-yellow-400' : 
//                 item.badge.type === 'ok' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
//               }`}>
//                 {item.badge.text}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//         <button onClick={logout} style={{ width: '100%', height: '40px', backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Chiqish</button>
//       <div className="mt-auto p-3 border-t border-white/10">

//         <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1a2438]">
//           <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center text-xs font-semibold text-cyan-400">SA</div>
//           <div>
//             <div className="text-xs font-medium">S. Alimov</div>
//             <div className="text-[10px] text-[#7a8eaa]">Bosh inspektor · GASN</div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// // -------------------- STAT CARD --------------------
// const StatCard = ({ icon, label, value, sub, color = 'cyan' }) => {
//   const colorMap = {
//     cyan: 'text-cyan-400',
//     yellow: 'text-yellow-400',
//     red: 'text-red-400',
//     green: 'text-green-400',
//   };
//   return (
//     <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
//       <span className="absolute right-3 top-3 text-xl opacity-10">{icon}</span>
//       <div className="text-[11px] font-medium text-[#7a8eaa] mb-2 tracking-wide">{label}</div>
//       <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
//       <div className="text-[11px] text-[#7a8eaa] mt-1.5">{sub}</div>
//     </div>
//   );
// };

// // -------------------- DONUT CHART --------------------
// const DonutChart = ({ data, labels, colors }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       if (chartInstance.current) chartInstance.current.destroy();
//       chartInstance.current = new Chart(chartRef.current, {
//         type: 'doughnut',
//         data: {
//           labels: labels,
//           datasets: [{
//             data: data,
//             backgroundColor: colors,
//             borderWidth: 0,
//             hoverOffset: 6,
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           cutout: '62%',
//           plugins: { legend: { display: false } }
//         }
//       });
//     }
//     return () => { if (chartInstance.current) chartInstance.current.destroy(); };
//   }, [data, labels, colors]);

//   return <canvas ref={chartRef} className="w-full h-full" />;
// };

// // -------------------- BAR CHART --------------------
// const BarChart = () => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       if (chartInstance.current) chartInstance.current.destroy();
//       chartInstance.current = new Chart(chartRef.current, {
//         type: 'bar',
//         data: {
//           labels: ['2022', '2023', '2024', '2025'],
//           datasets: [
//             { label: 'Qurilish soni', data: [219, 179, 227, null], backgroundColor: 'rgba(34,211,238,.5)', borderRadius: 6, borderSkipped: false, yAxisID: 'y' },
//             { label: 'Qiymat (mlrd)', data: [2294, 2581, 3191, null], backgroundColor: 'rgba(251,191,36,.4)', borderRadius: 6, borderSkipped: false, yAxisID: 'y1' }
//           ]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: { legend: { display: false } },
//           scales: {
//             x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa', font: { size: 11 } } },
//             y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa', font: { size: 11 } }, position: 'left' },
//             y1: { grid: { display: false }, ticks: { color: '#7a8eaa', font: { size: 11 }, callback: (v) => v / 1000 + 'T' }, position: 'right' }
//           }
//         }
//       });
//     }
//     return () => { if (chartInstance.current) chartInstance.current.destroy(); };
//   }, []);

//   return <canvas ref={chartRef} className="w-full h-full" />;
// };

// // -------------------- DASHBOARD PAGE --------------------
// const DashboardPage = () => {
//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
//         <StatCard icon="🏗️" label="Jami qurilgan ob'ektlar" value="865" sub="2016–2025 · barcha toifalar" color="cyan" />
//         <StatCard icon="💰" label="Umumiy investitsiya" value="4 181 mlrd" sub="so'm · 2016–2024" color="yellow" />
//         <StatCard icon="⚠️" label="Smeta nomuvofiqlik" value="5" sub="ob'ektda tafovut aniqlangan" color="red" />
//         <StatCard icon="📷" label="Faol kameralar" value="62" sub="17 ta ob'ektda · 44 ta montajda" color="green" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10">
//             <div className="text-xs font-semibold">Ob'ektlar toifasi bo'yicha</div>
//             <div className="text-[11px] text-[#7a8eaa]">2016–2025 · jami 865 ta</div>
//           </div>
//           <div className="p-4 h-52">
//             <DonutChart 
//               data={[229, 126, 115, 30, 8, 348, 9]}
//               labels={['Maktablar (229)', 'Tibbiyot (126)', "Bog'cha (115)", 'Sport (30)', 'Musiqa (8)', 'Boshqa (348)', 'Litsey (9)']}
//               colors={['#22d3ee', '#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#fb923c']}
//             />
//           </div>
//         </div>
//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10">
//             <div className="text-xs font-semibold">Ko'p qavatli uylar dinamikasi</div>
//             <div className="text-[11px] text-[#7a8eaa]">2022–2025 · mlrd so'm</div>
//           </div>
//           <div className="p-4 h-52">
//             <BarChart />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
//             <div>
//               <div className="text-xs font-semibold">Faol qurilish ob'ektlari</div>
//               <div className="text-[11px] text-[#7a8eaa]">Real vaqt nazorati</div>
//             </div>
//             <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-white/10 text-[#7a8eaa] hover:border-cyan-400 hover:text-cyan-400 transition-colors">Barchasi →</button>
//           </div>
//           <div>
//             {faolObektlar.map((o, idx) => {
//               const diff = o.haqiqiy - o.smeta;
//               const diffPct = Math.round(diff / o.smeta * 100);
//               const diffColor = diff > 0 ? '#f87171' : diff < -100 ? '#fbbf24' : '#34d399';
//               return (
//                 <div key={idx} className="p-3 border-b border-white/10 cursor-pointer hover:bg-[#1a2438] transition-colors">
//                   <div className="flex items-start justify-between mb-1.5">
//                     <div>
//                       <div className="text-xs font-medium text-white">{o.name}</div>
//                       <div className="text-[11px] text-[#7a8eaa]">{o.manzil} · {o.pudratchi}</div>
//                     </div>
//                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(o.holat)}`}>{o.holatTxt}</span>
//                   </div>
//                   <div className="flex flex-wrap gap-4 text-[11px] text-[#7a8eaa] mb-1.5">
//                     <span>Smeta: <b className="text-white">{o.smeta} mln</b></span>
//                     <span>Haqiqiy: <b className="text-white">{o.haqiqiy} mln</b></span>
//                     <span>Tafovut: <b style={{ color: diffColor }}>{diff > 0 ? '+' : ''}{diff} mln ({diff > 0 ? '+' : ''}{diffPct}%)</b></span>
//                     <span>Xodim: <b className="text-white">{o.xodim} nafar</b></span>
//                     <span>{o.kamera ? '📷 Kamera faol' : '📵 Kamera yo\'q'}</span>
//                   </div>
//                   <div className="h-1 bg-[#1a2438] rounded-full overflow-hidden">
//                     <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: o.holat === 'b-red' ? '#f87171' : o.holat === 'b-green' ? '#34d399' : '#22d3ee' }}></div>
//                   </div>
//                   <div className="flex justify-between text-[10px] text-[#3d4f6a] mt-0.5">
//                     <span>{o.progress}% bajarildi</span>
//                     <span>Muddat: 01.09.2026</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
//             <div className="text-xs font-semibold">Ogohlantirishlar</div>
//             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">8 ta</span>
//           </div>
//           <div>
//             {ogohlar.map((a, idx) => (
//               <div key={idx} className="flex items-start gap-2.5 p-3 border-b border-white/10 cursor-pointer hover:bg-[#1a2438] transition-colors">
//                 <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }}></div>
//                 <div className="flex-1">
//                   <div className="text-xs text-white">{a.text}</div>
//                   <div className="text-[11px] text-[#7a8eaa]">{a.sub}</div>
//                 </div>
//                 <div className="text-[11px] text-[#3d4f6a] flex-shrink-0">{a.time}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------- OBJECTS PAGE --------------------
// const ObjectsPage = () => {
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredObektlar = obektlar.filter(o => {
//     if (filter !== 'all' && !o.toifa.toLowerCase().includes(filter)) return false;
//     if (searchTerm && !o.name.toLowerCase().includes(searchTerm.toLowerCase()) && !o.pudratchi.toLowerCase().includes(searchTerm.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 items-center mb-4">
//         <input 
//           type="text" 
//           placeholder="🔍  Ob'ekt nomi yoki manzil..." 
//           className="flex-1 max-w-64 px-3 py-1.5 rounded-lg border border-white/10 bg-[#1a2438] text-white text-xs placeholder:text-[#3d4f6a] outline-none focus:border-cyan-400"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         {['all', 'maktab', 'tibbiyot', 'sport', 'bogcha'].map(f => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
//               filter === f 
//                 ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' 
//                 : 'border-white/10 text-[#7a8eaa] hover:border-cyan-400 hover:text-cyan-400'
//             }`}
//           >
//             {f === 'all' ? 'Hammasi' : f === 'maktab' ? 'Maktablar' : f === 'tibbiyot' ? 'Tibbiyot' : f === 'sport' ? 'Sport' : "Bog'cha"}
//           </button>
//         ))}
//         <button className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-400 text-black hover:opacity-85 transition-opacity flex items-center gap-1.5">
//           + Yangi ob'ekt
//         </button>
//       </div>

//       <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-white/10 bg-[#1a2438]">
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Ob'ekt nomi</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Toifa</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Pudratchi</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Smeta</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Haqiqiy</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Tafovut</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Holat</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Kamera</th>
//              </tr>
//           </thead>
//           <tbody>
//             {filteredObektlar.map((o, idx) => {
//               const diff = o.haqiqiy - o.smeta;
//               const pct = Math.round(diff / o.smeta * 100);
//               const dcolor = diff > 50 ? '#f87171' : diff < -200 ? '#fbbf24' : '#34d399';
//               return (
//                 <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors cursor-pointer">
//                   <td className="px-3.5 py-2.5 text-xs font-medium text-white">{o.name}</td>
//                   <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass('b-cyan')}`}>{o.toifa}</span></td>
//                   <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{o.pudratchi}</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{o.smeta} mln</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{o.haqiqiy} mln</td>
//                   <td className="px-3.5 py-2.5">
//                     <span style={{ color: dcolor }} className="text-xs font-semibold">{diff > 0 ? '+' : ''}{diff} mln</span>
//                     <span className="text-[10px] text-[#7a8eaa] ml-1">({diff > 0 ? '+' : ''}{pct}%)</span>
//                   </td>
//                   <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(o.holat)}`}>{o.ht}</span></td>
//                   <td className="px-3.5 py-2.5 text-center">
//                     {o.kamera ? <span className="text-green-400 text-base">●</span> : <span className="text-[#3d4f6a] text-base">○</span>}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // -------------------- COMPARISON PAGE --------------------
// const ComparisonPage = () => {
//   const [tab, setTab] = useState('all');

//   const filteredData = taqqoslashData.filter(t => {
//     if (tab === 'all') return true;
//     if (tab === 'nomo') return t.status === 'nomo';
//     return t.status === 'ok';
//   });

//   return (
//     <div>
//       <div className="flex gap-0.5 bg-[#1a2438] rounded-lg p-0.5 mb-4 w-fit">
//         {['all', 'nomo', 'ok'].map(t => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
//               tab === t ? 'bg-[#111827] text-white' : 'text-[#7a8eaa] hover:text-white'
//             }`}
//           >
//             {t === 'all' ? "Barcha ob'ektlar" : t === 'nomo' ? 'Nomuvofiqlar (5)' : 'Muvofiq'}
//           </button>
//         ))}
//       </div>

//       <div className="space-y-3">
//         {filteredData.map((t, idx) => {
//           const diff = t.haqiqiy - t.smeta;
//           const pct = Math.round(Math.abs(diff) / t.smeta * 100);
//           const smPct = Math.min(100, Math.round(t.smeta / Math.max(t.smeta, t.haqiqiy) * 100));
//           const hqPct = Math.min(100, Math.round(t.haqiqiy / Math.max(t.smeta, t.haqiqiy) * 100));
//           const xodimSmPct = Math.round(t.xodimSmeta / Math.max(t.xodimSmeta, t.xodimHaqiqiy) * 100);
//           const xodimHqPct = Math.round(t.xodimHaqiqiy / Math.max(t.xodimSmeta, t.xodimHaqiqiy) * 100);
//           const materialSmPct = Math.round(t.materialSmeta / Math.max(t.materialSmeta, t.materialHaqiqiy) * 100);
//           const materialHqPct = Math.round(t.materialHaqiqiy / Math.max(t.materialSmeta, t.materialHaqiqiy) * 100);
          
//           return (
//             <div key={idx} className="bg-[#111827] border border-white/10 rounded-2xl">
//               <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center flex-wrap gap-2">
//                 <div>
//                   <div className="text-xs font-semibold">{t.name}</div>
//                   <div className="text-[11px] text-[#7a8eaa]">Pudratchi: {t.pudratchi}</div>
//                 </div>
//                 <div className="flex items-center gap-2.5">
//                   <span className={`text-xs font-semibold ${diff > 100 ? 'text-red-400' : diff < -100 ? 'text-yellow-400' : 'text-green-400'}`}>
//                     {diff > 0 ? '+' : ''}{diff} mln so'm ({diff > 0 ? '+' : ''}{pct}%)
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(t.ht)}`}>{t.holatTxt}</span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
//                 <div className="p-3">
//                   <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Umumiy narx</div>
//                   <div className="grid grid-cols-2 gap-1.5">
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${smPct}%` }}></div></div>
//                       <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.smeta} mln</div>
//                     </div>
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${hqPct}%`, background: diff > 100 ? '#f87171' : '#34d399' }}></div></div>
//                       <div className="text-[11px] font-medium" style={{ color: diff > 100 ? '#f87171' : '#34d399' }}>{t.haqiqiy} mln</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Xodimlar soni</div>
//                   <div className="grid grid-cols-2 gap-1.5">
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${xodimSmPct}%` }}></div></div>
//                       <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.xodimSmeta} nafar</div>
//                     </div>
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${xodimHqPct}%`, background: t.xodimHaqiqiy > t.xodimSmeta * 1.1 ? '#f87171' : '#34d399' }}></div></div>
//                       <div className="text-[11px] font-medium" style={{ color: t.xodimHaqiqiy > t.xodimSmeta * 1.1 ? '#f87171' : '#34d399' }}>{t.xodimHaqiqiy} nafar</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Material xarajat</div>
//                   <div className="grid grid-cols-2 gap-1.5">
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${materialSmPct}%` }}></div></div>
//                       <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.materialSmeta} mln</div>
//                     </div>
//                     <div>
//                       <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
//                       <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${materialHqPct}%`, background: t.materialHaqiqiy > t.materialSmeta * 1.1 ? '#f87171' : '#34d399' }}></div></div>
//                       <div className="text-[11px] font-medium" style={{ color: t.materialHaqiqiy > t.materialSmeta * 1.1 ? '#f87171' : '#34d399' }}>{t.materialHaqiqiy} mln</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // -------------------- CAMERA PAGE --------------------
// const CameraPage = () => {
//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
//         <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
//           <div className="text-[11px] text-[#7a8eaa] mb-2">Belgilangan ob'ektlar</div>
//           <div className="text-2xl font-bold text-cyan-400">61</div>
//           <div className="text-[11px] text-[#7a8eaa] mt-1">kamera o'rnatilishi rejalashtirilgan</div>
//         </div>
//         <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
//           <div className="text-[11px] text-[#7a8eaa] mb-2">O'rnatilgan kameralar</div>
//           <div className="text-2xl font-bold text-green-400">62 dona</div>
//           <div className="text-[11px] text-[#7a8eaa] mt-1">17 ta ob'ektda (Hikvision)</div>
//         </div>
//         <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
//           <div className="text-[11px] text-[#7a8eaa] mb-2">Montaj jarayonida</div>
//           <div className="text-2xl font-bold text-yellow-400">44</div>
//           <div className="text-[11px] text-[#7a8eaa] mt-1">ob'ektda ishlar davom etmoqda</div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
//             <div>
//               <div className="text-xs font-semibold">Kamera o'rnatilgan ob'ektlar</div>
//               <div className="text-[11px] text-[#7a8eaa]">Jonli holat</div>
//             </div>
//             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
//               Online
//             </span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/10 bg-[#1a2438]">
//                   <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Ob'ekt</th>
//                   <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Kamera soni</th>
//                   <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">So'nggi signal</th>
//                   <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Aniqlangan</th>
//                   <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Holat</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {kameraData.map((k, idx) => (
//                   <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors">
//                     <td className="px-3.5 py-2.5 text-xs font-medium text-white">{k.obekt}</td>
//                     <td className="px-3.5 py-2.5 text-xs font-medium">{k.soni} dona</td>
//                     <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{k.signal}</td>
//                     <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{k.aniqlangan}</td>
//                     <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(k.holat)}`}>{k.ht}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="bg-[#111827] border border-white/10 rounded-2xl">
//           <div className="px-4 py-3 border-b border-white/10">
//             <div className="text-xs font-semibold">O'rnatish jarayoni</div>
//           </div>
//           <div className="p-4">
//             <div className="mb-3.5">
//               <div className="flex justify-between text-xs text-[#7a8eaa] mb-1.5">
//                 <span>Umumiy holat</span>
//                 <span className="text-white font-medium">17/61 ob'ekt</span>
//               </div>
//               <div className="h-2.5 bg-[#1a2438] rounded-full overflow-hidden">
//                 <div className="h-full rounded-full bg-green-400" style={{ width: '28%' }}></div>
//               </div>
//               <div className="text-[11px] text-[#7a8eaa] mt-1">28% bajarildi</div>
//             </div>
//             <div className="space-y-2.5">
//               <div>
//                 <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>O'rnatildi</span><span className="text-white">28%</span></div>
//                 <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-green-400" style={{ width: '28%' }}></div></div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>Montajda</span><span className="text-white">72%</span></div>
//                 <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-yellow-400" style={{ width: '72%' }}></div></div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>Kutilmoqda</span><span className="text-white">0%</span></div>
//                 <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-gray-600" style={{ width: '0%' }}></div></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------- REPORTS PAGE --------------------
// const ReportsPage = () => {
//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 items-center mb-4">
//         <input 
//           type="text" 
//           placeholder="🔍  INN yoki korxona nomi..." 
//           className="flex-1 max-w-64 px-3 py-1.5 rounded-lg border border-white/10 bg-[#1a2438] text-white text-xs placeholder:text-[#3d4f6a] outline-none focus:border-cyan-400"
//         />
//         <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Hammasi (926)</button>
//         <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Tekshirilmagan</button>
//         <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Nomuvofiq</button>
//         <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Tasdiqlangan</button>
//       </div>

//       <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-white/10 bg-[#1a2438]">
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Korxona</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">INN</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Xodimlar (hisobot)</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Xodimlar (kamera)</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Tafovut</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Aylanma</th>
//               <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Holat</th>
//             </tr>
//           </thead>
//           <tbody>
//             {hisobotRows.map((h, idx) => {
//               const diff = h.kamera - h.hisobot;
//               const dcolor = diff > 5 ? '#f87171' : diff > 0 ? '#fbbf24' : '#34d399';
//               return (
//                 <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors">
//                   <td className="px-3.5 py-2.5 text-xs font-medium text-white">{h.name}</td>
//                   <td className="px-3.5 py-2.5 text-xs font-mono text-[#7a8eaa]">{h.inn}</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{h.hisobot} nafar</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{h.kamera} nafar</td>
//                   <td className="px-3.5 py-2.5 text-xs font-semibold" style={{ color: dcolor }}>{diff > 0 ? '+' : ''}{diff} nafar</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{h.aylanma}</td>
//                   <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(h.holat)}`}>{h.ht}</span></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // -------------------- MAIN APP --------------------
// const GasnDashboard = () => {
//   const [activePage, setActivePage] = useState('dashboard');

//   const pageTitles = {
//     dashboard: 'GASN — Bosh Panel',
//     obyektlar: "Qurilish Ob'ektlari",
//     taqqoslash: 'Smeta Taqqoslash',
//     kamera: 'Kamera Monitoringi',
//     hisobotlar: 'Korxona Hisobotlari',
//   };

//   const renderPage = () => {
//     switch(activePage) {
//       case 'dashboard': return <DashboardPage />;
//       case 'obyektlar': return <ObjectsPage />;
//       case 'taqqoslash': return <ComparisonPage />;
//       case 'kamera': return <CameraPage />;
//       case 'hisobotlar': return <ReportsPage />;
//       default: return <DashboardPage />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b1120] text-[#e6edf8]">
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
//       <div className="ml-60 flex flex-col">
//         <div className="h-14 bg-[#111827] border-b border-white/10 flex items-center px-6 gap-3 sticky top-0 z-40">
//           <div>
//             <div className="text-sm font-semibold">{pageTitles[activePage]}</div>
//             <div className="text-xs text-[#7a8eaa]">Andijon viloyati · 2016–2025 · 865 ta ob'ekt nazoratda</div>
//           </div>
//           <div className="ml-auto flex items-center gap-2.5">
//             <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
//               Jonli nazorat
//             </span>
//             <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">5 ta nomuvofiqlik</span>
//             <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-400">12 ta faol ob'ekt</span>
//             <span className="text-xs text-[#7a8eaa]">28.03.2026 · 10:22</span>
//           </div>
//         </div>

//         <div className="p-5 md:p-6">
//           {renderPage()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GasnDashboard;

// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================

// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import "chart.js/auto";
import Chart from 'chart.js/auto';
import { useAuth } from '../../context/AuthContext';
import api from '../../api.js';
import { downloadBlob } from '../../utils/downloadBlob.js';

// -------------------- MOCK DATA (static fallback) --------------------
const faolObektlar = [
  { name: '42-maktab yangi binosi', manzil: 'Andijon sh., Navro\'z ko\'chasi', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, xodim: 38, kamera: true, progress: 72, holat: 'b-blue', holatTxt: 'Qurilmoqda' },
  { name: 'Markaziy poliklinika rekonstr.', manzil: 'Asaka t., Mustaqillik ko\'chasi', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, xodim: 52, kamera: true, progress: 85, holat: 'b-green', holatTxt: 'Yakunlanmoqda' },
  { name: 'Sport majmuasi (yangi)', manzil: 'Oltinko\'l t., Sport ko\'chasi', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, xodim: 29, kamera: false, progress: 45, holat: 'b-red', holatTxt: 'Tafovut!' },
  { name: 'Maktabgacha ta\'lim markazi', manzil: 'Xo\'jaobod t., Bog\'ishamol', pudratchi: 'Yangi Bino Servis', smeta: 900, haqiqiy: 870, xodim: 14, kamera: true, progress: 60, holat: 'b-blue', holatTxt: 'Qurilmoqda' },
];

const ogohlar = [
  { color: '#f87171', text: '"Sport majmuasi" — smeta +19% oshib ketdi', sub: 'Tafovut: +350 mln so\'m · Tekshiruv talab etiladi', time: '09:14' },
  { color: '#f87171', text: 'Kamera: ob\'ekt #7 — 31 norasmiy ishchi', sub: 'Hisobot: 14 nafar · Tafovut: 17 nafar', time: '08:50' },
  { color: '#fbbf24', text: '"Master Stroy" hujjati ekspertizasiz', sub: 'Smeta-loyiha hujjati yuklanmagan', time: '08:22' },
  { color: '#fbbf24', text: '42-maktab ob\'ektida material kirimisiz', sub: '70% material naqd pul, ombor kirimsiz', time: '07:55' },
  { color: '#22d3ee', text: 'Yangi pudratchi ariza: "Al-Amin Pudrat"', sub: 'Ekspertiza tekshiruvi kutilmoqda', time: '07:30' },
];

const obektlar = [
  { name: '42-maktab yangi binosi', toifa: 'Maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, holat: 'b-blue', ht: 'Qurilmoqda', kamera: true },
  { name: 'Markaziy poliklinika', toifa: 'Tibbiyot', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, holat: 'b-green', ht: 'Yakunlanmoqda', kamera: true },
  { name: 'Sport majmuasi', toifa: 'Sport', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, holat: 'b-red', ht: 'Tafovut!', kamera: false },
  { name: 'MTM Bog\'ishamol', toifa: 'Bog\'cha', pudratchi: 'Yangi Bino Servis', smeta: 900, haqiqiy: 870, holat: 'b-blue', ht: 'Qurilmoqda', kamera: true },
  { name: 'Xo\'jaobod maktabi', toifa: 'Maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 1200, haqiqiy: 1180, holat: 'b-green', ht: 'Yakunlandi', kamera: true },
  { name: 'Tuman kasalxonasi', toifa: 'Tibbiyot', pudratchi: 'Al-Amin Pudrat', smeta: 4500, haqiqiy: 3800, holat: 'b-yellow', ht: 'Ogohlantirish', kamera: false },
  { name: 'Musiqa maktabi', toifa: 'Musiqa', pudratchi: 'Andijon Qurilish', smeta: 680, haqiqiy: 710, holat: 'b-yellow', ht: 'Tafovut', kamera: true },
];

const taqqoslashData = [
  { name: 'Sport majmuasi', pudratchi: 'Master Stroy UZ', smeta: 1800, haqiqiy: 2150, xodimSmeta: 25, xodimHaqiqiy: 29, materialSmeta: 800, materialHaqiqiy: 980, status: 'nomo', ht: 'b-red', holatTxt: 'Nomuvofiq' },
  { name: 'Tuman kasalxonasi', pudratchi: 'Al-Amin Pudrat', smeta: 4500, haqiqiy: 3800, xodimSmeta: 60, xodimHaqiqiy: 52, materialSmeta: 2000, materialHaqiqiy: 1750, status: 'nomo', ht: 'b-yellow', holatTxt: 'Tafovut' },
  { name: 'Musiqa maktabi', pudratchi: 'Andijon Qurilish', smeta: 680, haqiqiy: 710, xodimSmeta: 10, xodimHaqiqiy: 12, materialSmeta: 300, materialHaqiqiy: 330, status: 'nomo', ht: 'b-yellow', holatTxt: 'Kichik tafovut' },
  { name: '42-maktab', pudratchi: 'Baraka Qurilish LLC', smeta: 2400, haqiqiy: 2380, xodimSmeta: 40, xodimHaqiqiy: 38, materialSmeta: 1000, materialHaqiqiy: 995, status: 'ok', ht: 'b-green', holatTxt: 'Muvofiq' },
  { name: 'Markaziy poliklinika', pudratchi: 'Sharq Build Group', smeta: 3100, haqiqiy: 2890, xodimSmeta: 55, xodimHaqiqiy: 52, materialSmeta: 1400, materialHaqiqiy: 1320, status: 'ok', ht: 'b-green', holatTxt: 'Muvofiq' },
];

const kameraData = [
  { obekt: '42-maktab yangi binosi', soni: 4, signal: '2 daq oldin', aniqlangan: '38 ishchi, 3 texnika', holat: 'b-green', ht: 'Online' },
  { obekt: 'Markaziy poliklinika', soni: 6, signal: '5 daq oldin', aniqlangan: '52 ishchi, 7 texnika', holat: 'b-green', ht: 'Online' },
  { obekt: 'MTM Bog\'ishamol', soni: 3, signal: '1 daq oldin', aniqlangan: '14 ishchi, 1 texnika', holat: 'b-green', ht: 'Online' },
  { obekt: 'Xo\'jaobod maktabi', soni: 5, signal: '12 daq oldin', aniqlangan: '28 ishchi, 4 texnika', holat: 'b-blue', ht: 'Buffering' },
  { obekt: 'Asaka tibbiyot', soni: 2, signal: '48 daq oldin', aniqlangan: 'Ulanmagan', holat: 'b-red', ht: 'Offline' },
];

const hisobotRows = [
  { name: 'Baraka Qurilish LLC', inn: '307123456', hisobot: 47, kamera: 38, aylanma: '1.2 mlrd', holat: 'b-green', ht: 'Muvofiq' },
  { name: 'Sharq Build Group', inn: '307654321', hisobot: 52, kamera: 52, aylanma: '890 mln', holat: 'b-green', ht: 'Muvofiq' },
  { name: 'Master Stroy UZ', inn: '307111222', hisobot: 29, kamera: 31, aylanma: '450 mln', holat: 'b-yellow', ht: 'Tafovut +2' },
  { name: 'Yangi Bino Servis', inn: '307987654', hisobot: 0, kamera: 14, aylanma: '2.1 mlrd', holat: 'b-red', ht: 'Nomuvofiq!' },
  { name: 'Andijon Qurilish', inn: '307333444', hisobot: 1, kamera: 12, aylanma: '3.4 mlrd', holat: 'b-red', ht: 'Nomuvofiq!' },
  { name: 'Al-Amin Pudrat', inn: '307555666', hisobot: 14, kamera: 14, aylanma: '670 mln', holat: 'b-green', ht: 'Muvofiq' },
];

// Helper
const getBadgeClass = (type) => {
  const classes = {
    'b-red': 'bg-red-500/10 text-red-400',
    'b-yellow': 'bg-yellow-500/10 text-yellow-400',
    'b-green': 'bg-green-500/10 text-green-400',
    'b-blue': 'bg-blue-500/10 text-blue-400',
    'b-cyan': 'bg-cyan-500/10 text-cyan-400',
  };
  return classes[type] || 'bg-gray-500/10 text-gray-400';
};

// -------------------- SIDEBAR (added 'arizalar' item) --------------------
const Sidebar = ({ activePage, setActivePage }) => {
  const { logout, user } = useAuth();
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'obyektlar', icon: '🏗️', label: "Ob'ektlar", badge: { type: 'warn', text: '12' } },
    { id: 'taqqoslash', icon: '⚖️', label: 'Smeta taqqoslash', badge: { type: 'default', text: '5' } },
    { id: 'hisobotlar', icon: '📋', label: 'Korxona hisobotlari', badge: null },
    // { id: 'kamera', icon: '📷', label: 'Kamera monitoringi', badge: { type: 'ok', text: '17' } },
    { id: 'arizalar', icon: '📝', label: 'Arizalar', badge: { type: 'warn', text: '3' } }, // new
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#111827] border-r border-white/10 flex flex-col z-50">
      <div className="p-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-xl flex items-center justify-center text-lg">🔍</div>
          <div>
            <div className="font-bold text-sm">GASN Tizimi</div>
            <div className="text-[10px] text-[#7a8eaa]">Qurilish nazorat inspeksiyasi</div>
          </div>
        </div>
        <div className="mt-3 p-2.5 bg-[#1a2438] rounded-lg border border-white/10">
          <div className="text-xs font-semibold">Andijon viloyati GASN</div>
          <div className="text-[10px] text-[#7a8eaa]">Davlat arxitektura-qurilish nazorat inspeksiyasi</div>
          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full w-fit">
            📍 Andijon viloyati
          </div>
        </div>
      </div>

      <div className="px-2.5 pt-4 pb-1">
        <div className="text-[10px] tracking-wider uppercase text-[#3d4f6a] px-2 mb-1.5">Asosiy</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
              activePage === item.id
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-[#7a8eaa] hover:bg-[#1a2438] hover:text-[#e6edf8]'
            }`}
          >
            <span className="text-[15px] w-4">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                item.badge.type === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                item.badge.type === 'ok' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.badge.text}
              </span>
            )}
          </button>
        ))}
      </div>

      <button onClick={logout} style={{ width: '100%', height: '40px', backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Chiqish</button>
      <div className="mt-auto p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1a2438]">
          <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center text-xs font-semibold text-cyan-400">SA</div>
          <div>
            <div className="text-xs font-medium">S. Alimov</div>
            <div className="text-[10px] text-[#7a8eaa]">Bosh inspektor · GASN</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// -------------------- STAT CARD --------------------
const StatCard = ({ icon, label, value, sub, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400',
  };
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
      <span className="absolute right-3 top-3 text-xl opacity-10">{icon}</span>
      <div className="text-[11px] font-medium text-[#7a8eaa] mb-2 tracking-wide">{label}</div>
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-[11px] text-[#7a8eaa] mt-1.5">{sub}</div>
    </div>
  );
};

// -------------------- DONUT CHART --------------------
const DonutChart = ({ data, labels, colors }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: { legend: { display: false } }
        }
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, labels, colors]);

  return <canvas ref={chartRef} className="w-full h-full" />;
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
          labels: ['2022', '2023', '2024', '2025'],
          datasets: [
            { label: 'Qurilish soni', data: [219, 179, 227, null], backgroundColor: 'rgba(34,211,238,.5)', borderRadius: 6, borderSkipped: false, yAxisID: 'y' },
            { label: 'Qiymat (mlrd)', data: [2294, 2581, 3191, null], backgroundColor: 'rgba(251,191,36,.4)', borderRadius: 6, borderSkipped: false, yAxisID: 'y1' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#7a8eaa', font: { size: 11 } }, position: 'left' },
            y1: { grid: { display: false }, ticks: { color: '#7a8eaa', font: { size: 11 }, callback: (v) => v / 1000 + 'T' }, position: 'right' }
          }
        }
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

// -------------------- DASHBOARD PAGE (dynamic summary) --------------------
const DashboardPage = ({ summary }) => {
  // If summary is loaded, use its numbers; otherwise fallback to static stats
  const stats = summary?.stats || {
    reportsTotal: '--',
    projectsTotal: '--',
    alertsOpen: '--',
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon="🏗️" label="Jami qurilgan ob'ektlar" value={stats.projectsTotal !== '--' ? stats.projectsTotal : "865"} sub="2016–2025 · barcha toifalar" color="cyan" />
        <StatCard icon="💰" label="Umumiy investitsiya" value="4 181 mlrd" sub="so'm · 2016–2024" color="yellow" />
        <StatCard icon="⚠️" label="Smeta nomuvofiqlik" value={stats.alertsOpen !== '--' ? stats.alertsOpen : "5"} sub="ob'ektda tafovut aniqlangan" color="red" />
        <StatCard icon="📷" label="Faol kameralar" value="62" sub="17 ta ob'ektda · 44 ta montajda" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-xs font-semibold">Ob'ektlar toifasi bo'yicha</div>
            <div className="text-[11px] text-[#7a8eaa]">2016–2025 · jami 865 ta</div>
          </div>
          <div className="p-4 h-52">
            <DonutChart
              data={[229, 126, 115, 30, 8, 348, 9]}
              labels={['Maktablar (229)', 'Tibbiyot (126)', "Bog'cha (115)", 'Sport (30)', 'Musiqa (8)', 'Boshqa (348)', 'Litsey (9)']}
              colors={['#22d3ee', '#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#fb923c']}
            />
          </div>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-xs font-semibold">Ko'p qavatli uylar dinamikasi</div>
            <div className="text-[11px] text-[#7a8eaa]">2022–2025 · mlrd so'm</div>
          </div>
          <div className="p-4 h-52">
            <BarChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold">Faol qurilish ob'ektlari</div>
              <div className="text-[11px] text-[#7a8eaa]">Real vaqt nazorati</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-white/10 text-[#7a8eaa] hover:border-cyan-400 hover:text-cyan-400 transition-colors">Barchasi →</button>
          </div>
          <div>
            {faolObektlar.map((o, idx) => {
              const diff = o.haqiqiy - o.smeta;
              const diffPct = Math.round(diff / o.smeta * 100);
              const diffColor = diff > 0 ? '#f87171' : diff < -100 ? '#fbbf24' : '#34d399';
              return (
                <div key={idx} className="p-3 border-b border-white/10 cursor-pointer hover:bg-[#1a2438] transition-colors">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div className="text-xs font-medium text-white">{o.name}</div>
                      <div className="text-[11px] text-[#7a8eaa]">{o.manzil} · {o.pudratchi}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(o.holat)}`}>{o.holatTxt}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] text-[#7a8eaa] mb-1.5">
                    <span>Smeta: <b className="text-white">{o.smeta} mln</b></span>
                    <span>Haqiqiy: <b className="text-white">{o.haqiqiy} mln</b></span>
                    <span>Tafovut: <b style={{ color: diffColor }}>{diff > 0 ? '+' : ''}{diff} mln ({diff > 0 ? '+' : ''}{diffPct}%)</b></span>
                    <span>Xodim: <b className="text-white">{o.xodim} nafar</b></span>
                    <span>{o.kamera ? '📷 Kamera faol' : '📵 Kamera yo\'q'}</span>
                  </div>
                  <div className="h-1 bg-[#1a2438] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: o.holat === 'b-red' ? '#f87171' : o.holat === 'b-green' ? '#34d399' : '#22d3ee' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#3d4f6a] mt-0.5">
                    <span>{o.progress}% bajarildi</span>
                    <span>Muddat: 01.09.2026</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <div className="text-xs font-semibold">Ogohlantirishlar</div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">8 ta</span>
          </div>
          <div>
            {ogohlar.map((a, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 border-b border-white/10 cursor-pointer hover:bg-[#1a2438] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }}></div>
                <div className="flex-1">
                  <div className="text-xs text-white">{a.text}</div>
                  <div className="text-[11px] text-[#7a8eaa]">{a.sub}</div>
                </div>
                <div className="text-[11px] text-[#3d4f6a] flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- OBJECTS PAGE (static, can be extended later) --------------------
const ObjectsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredObektlar = obektlar.filter(o => {
    if (filter !== 'all' && !o.toifa.toLowerCase().includes(filter)) return false;
    if (searchTerm && !o.name.toLowerCase().includes(searchTerm.toLowerCase()) && !o.pudratchi.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="🔍  Ob'ekt nomi yoki manzil..."
          className="flex-1 max-w-64 px-3 py-1.5 rounded-lg border border-white/10 bg-[#1a2438] text-white text-xs placeholder:text-[#3d4f6a] outline-none focus:border-cyan-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {['all', 'maktab', 'tibbiyot', 'sport', 'bogcha'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filter === f
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                : 'border-white/10 text-[#7a8eaa] hover:border-cyan-400 hover:text-cyan-400'
            }`}
          >
            {f === 'all' ? 'Hammasi' : f === 'maktab' ? 'Maktablar' : f === 'tibbiyot' ? 'Tibbiyot' : f === 'sport' ? 'Sport' : "Bog'cha"}
          </button>
        ))}
        <button className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-400 text-black hover:opacity-85 transition-opacity flex items-center gap-1.5">
          + Yangi ob'ekt
        </button>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a2438]">
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Ob'ekt nomi</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Toifa</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Pudratchi</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Smeta</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Haqiqiy</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Tafovut</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Holat</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Kamera</th>
             </tr>
          </thead>
          <tbody>
            {filteredObektlar.map((o, idx) => {
              const diff = o.haqiqiy - o.smeta;
              const pct = Math.round(diff / o.smeta * 100);
              const dcolor = diff > 50 ? '#f87171' : diff < -200 ? '#fbbf24' : '#34d399';
              return (
                <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors cursor-pointer">
                  <td className="px-3.5 py-2.5 text-xs font-medium text-white">{o.name}</td>
                  <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass('b-cyan')}`}>{o.toifa}</span></td>
                  <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{o.pudratchi}</td>
                  <td className="px-3.5 py-2.5 text-xs font-medium">{o.smeta} mln</td>
                  <td className="px-3.5 py-2.5 text-xs font-medium">{o.haqiqiy} mln</td>
                  <td className="px-3.5 py-2.5">
                    <span style={{ color: dcolor }} className="text-xs font-semibold">{diff > 0 ? '+' : ''}{diff} mln</span>
                    <span className="text-[10px] text-[#7a8eaa] ml-1">({diff > 0 ? '+' : ''}{pct}%)</span>
                  </td>
                  <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(o.holat)}`}>{o.ht}</span></td>
                  <td className="px-3.5 py-2.5 text-center">
                    {o.kamera ? <span className="text-green-400 text-base">●</span> : <span className="text-[#3d4f6a] text-base">○</span>}
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

// -------------------- COMPARISON PAGE (static + API compare) --------------------
const ComparisonPage = ({ compareId, setCompareId, compareResult, runCompare }) => {
  const [tab, setTab] = useState('all');

  const filteredData = taqqoslashData.filter(t => {
    if (tab === 'all') return true;
    if (tab === 'nomo') return t.status === 'nomo';
    return t.status === 'ok';
  });

  return (
    <div>
      <div className="flex gap-0.5 bg-[#1a2438] rounded-lg p-0.5 mb-4 w-fit">
        {['all', 'nomo', 'ok'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t ? 'bg-[#111827] text-white' : 'text-[#7a8eaa] hover:text-white'
            }`}
          >
            {t === 'all' ? "Barcha ob'ektlar" : t === 'nomo' ? 'Nomuvofiqlar (5)' : 'Muvofiq'}
          </button>
        ))}
      </div>

      {/* API comparison section */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-4">
        <h3 className="text-sm font-semibold text-white">Hisobot vs smeta taqqoslash</h3>
        <div className="mt-2 flex gap-2">
          <input
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            placeholder="Hisobot ID"
            className="flex-1 rounded-lg border border-white/10 bg-[#1a2438] px-3 py-2 text-sm text-white"
          />
          <button
            onClick={runCompare}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Taqqoslash
          </button>
        </div>
        {compareResult && (
          <div className="mt-3 rounded-lg bg-black/30 p-3 text-sm text-slate-300">
            {compareResult.diff ? (
              <>
                <p>Xodimlar farqi: <span className="text-white">{compareResult.diff.employeeDelta}</span></p>
                <p>Shartnoma farqi: <span className="text-white">{compareResult.diff.contractDelta?.toLocaleString?.()}</span></p>
                <p className="mt-2 text-xs text-slate-500">
                  Haqiqiy: {JSON.stringify(compareResult.actual)} | Smeta: {JSON.stringify(compareResult.smeta)}
                </p>
              </>
            ) : (
              <p>{compareResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Static comparison data (unchanged) */}
      <div className="space-y-3">
        {filteredData.map((t, idx) => {
          const diff = t.haqiqiy - t.smeta;
          const pct = Math.round(Math.abs(diff) / t.smeta * 100);
          const smPct = Math.min(100, Math.round(t.smeta / Math.max(t.smeta, t.haqiqiy) * 100));
          const hqPct = Math.min(100, Math.round(t.haqiqiy / Math.max(t.smeta, t.haqiqiy) * 100));
          const xodimSmPct = Math.round(t.xodimSmeta / Math.max(t.xodimSmeta, t.xodimHaqiqiy) * 100);
          const xodimHqPct = Math.round(t.xodimHaqiqiy / Math.max(t.xodimSmeta, t.xodimHaqiqiy) * 100);
          const materialSmPct = Math.round(t.materialSmeta / Math.max(t.materialSmeta, t.materialHaqiqiy) * 100);
          const materialHqPct = Math.round(t.materialHaqiqiy / Math.max(t.materialSmeta, t.materialHaqiqiy) * 100);

          return (
            <div key={idx} className="bg-[#111827] border border-white/10 rounded-2xl">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <div className="text-xs font-semibold">{t.name}</div>
                  <div className="text-[11px] text-[#7a8eaa]">Pudratchi: {t.pudratchi}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-semibold ${diff > 100 ? 'text-red-400' : diff < -100 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {diff > 0 ? '+' : ''}{diff} mln so'm ({diff > 0 ? '+' : ''}{pct}%)
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(t.ht)}`}>{t.holatTxt}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="p-3">
                  <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Umumiy narx</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${smPct}%` }}></div></div>
                      <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.smeta} mln</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${hqPct}%`, background: diff > 100 ? '#f87171' : '#34d399' }}></div></div>
                      <div className="text-[11px] font-medium" style={{ color: diff > 100 ? '#f87171' : '#34d399' }}>{t.haqiqiy} mln</div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Xodimlar soni</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${xodimSmPct}%` }}></div></div>
                      <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.xodimSmeta} nafar</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${xodimHqPct}%`, background: t.xodimHaqiqiy > t.xodimSmeta * 1.1 ? '#f87171' : '#34d399' }}></div></div>
                      <div className="text-[11px] font-medium" style={{ color: t.xodimHaqiqiy > t.xodimSmeta * 1.1 ? '#f87171' : '#34d399' }}>{t.xodimHaqiqiy} nafar</div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between text-[11px] text-[#7a8eaa] mb-1.5">Material xarajat</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Smeta</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full bg-blue-400" style={{ width: `${materialSmPct}%` }}></div></div>
                      <div className="text-[11px] font-medium text-blue-400 mt-0.5">{t.materialSmeta} mln</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#3d4f6a]">Haqiqiy</div>
                      <div className="h-2 bg-[#1a2438] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${materialHqPct}%`, background: t.materialHaqiqiy > t.materialSmeta * 1.1 ? '#f87171' : '#34d399' }}></div></div>
                      <div className="text-[11px] font-medium" style={{ color: t.materialHaqiqiy > t.materialSmeta * 1.1 ? '#f87171' : '#34d399' }}>{t.materialHaqiqiy} mln</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------- CAMERA PAGE (static) --------------------
const CameraPage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
          <div className="text-[11px] text-[#7a8eaa] mb-2">Belgilangan ob'ektlar</div>
          <div className="text-2xl font-bold text-cyan-400">61</div>
          <div className="text-[11px] text-[#7a8eaa] mt-1">kamera o'rnatilishi rejalashtirilgan</div>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
          <div className="text-[11px] text-[#7a8eaa] mb-2">O'rnatilgan kameralar</div>
          <div className="text-2xl font-bold text-green-400">62 dona</div>
          <div className="text-[11px] text-[#7a8eaa] mt-1">17 ta ob'ektda (Hikvision)</div>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
          <div className="text-[11px] text-[#7a8eaa] mb-2">Montaj jarayonida</div>
          <div className="text-2xl font-bold text-yellow-400">44</div>
          <div className="text-[11px] text-[#7a8eaa] mt-1">ob'ektda ishlar davom etmoqda</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold">Kamera o'rnatilgan ob'ektlar</div>
              <div className="text-[11px] text-[#7a8eaa]">Jonli holat</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Online
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-[#1a2438]">
                  <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Ob'ekt</th>
                  <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Kamera soni</th>
                  <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">So'nggi signal</th>
                  <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Aniqlangan</th>
                  <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a]">Holat</th>
                </tr>
              </thead>
              <tbody>
                {kameraData.map((k, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors">
                    <td className="px-3.5 py-2.5 text-xs font-medium text-white">{k.obekt}</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{k.soni} dona</td>
                    <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{k.signal}</td>
                    <td className="px-3.5 py-2.5 text-xs text-[#7a8eaa]">{k.aniqlangan}</td>
                    <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(k.holat)}`}>{k.ht}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-xs font-semibold">O'rnatish jarayoni</div>
          </div>
          <div className="p-4">
            <div className="mb-3.5">
              <div className="flex justify-between text-xs text-[#7a8eaa] mb-1.5">
                <span>Umumiy holat</span>
                <span className="text-white font-medium">17/61 ob'ekt</span>
              </div>
              <div className="h-2.5 bg-[#1a2438] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-400" style={{ width: '28%' }}></div>
              </div>
              <div className="text-[11px] text-[#7a8eaa] mt-1">28% bajarildi</div>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>O'rnatildi</span><span className="text-white">28%</span></div>
                <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-green-400" style={{ width: '28%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>Montajda</span><span className="text-white">72%</span></div>
                <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-yellow-400" style={{ width: '72%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#7a8eaa] mb-1"><span>Kutilmoqda</span><span className="text-white">0%</span></div>
                <div className="h-1.5 bg-[#1a2438] rounded-full overflow-hidden"><div className="h-full rounded-full bg-gray-600" style={{ width: '0%' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- REPORTS PAGE (dynamic from API) --------------------
const ReportsPage = ({ reports, downloadPdf }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="🔍  INN yoki korxona nomi..."
          className="flex-1 max-w-64 px-3 py-1.5 rounded-lg border border-white/10 bg-[#1a2438] text-white text-xs placeholder:text-[#3d4f6a] outline-none focus:border-cyan-400"
        />
        <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Hammasi (926)</button>
        <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Tekshirilmagan</button>
        <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Nomuvofiq</button>
        <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-[#7a8eaa] bg-transparent hover:border-cyan-400 hover:text-cyan-400 transition-colors">Tasdiqlangan</button>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a2438]">
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Korxona</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">INN</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Xodimlar (hisobot)</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Xodimlar (kamera)</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Tafovut</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Aylanma</th>
              <th className="text-left px-3.5 py-2 text-[10px] font-medium text-[#3d4f6a] uppercase tracking-wider">Holat</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r) => {
                // Use placeholder for missing fields
                const diff = 0; // no camera data yet
                const dcolor = '#34d399';
                return (
                  <tr key={r._id} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors">
                    <td className="px-3.5 py-2.5 text-xs font-medium text-white">{r.companyUserId || 'Noma’lum'}</td>
                    <td className="px-3.5 py-2.5 text-xs font-mono text-[#7a8eaa]">{r._id.slice(-6)}</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{r.reportData?.employeeCount || '-'} nafar</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">-</td>
                    <td className="px-3.5 py-2.5 text-xs font-semibold" style={{ color: dcolor }}>0</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{r.reportData?.contractSum?.toLocaleString?.() || '-'}</td>
                    <td className="px-3.5 py-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400">Yangi</span></td>
                    <td className="px-3.5 py-2.5">
                      <button
                        onClick={() => downloadPdf(r._id, r.periodMonth, r.periodYear)}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              hisobotRows.map((h, idx) => {
                const diff = h.kamera - h.hisobot;
                const dcolor = diff > 5 ? '#f87171' : diff > 0 ? '#fbbf24' : '#34d399';
                return (
                  <tr key={idx} className="border-b border-white/10 hover:bg-[#1a2438] transition-colors">
                    <td className="px-3.5 py-2.5 text-xs font-medium text-white">{h.name}</td>
                    <td className="px-3.5 py-2.5 text-xs font-mono text-[#7a8eaa]">{h.inn}</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{h.hisobot} nafar</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{h.kamera} nafar</td>
                    <td className="px-3.5 py-2.5 text-xs font-semibold" style={{ color: dcolor }}>{diff > 0 ? '+' : ''}{diff} nafar</td>
                    <td className="px-3.5 py-2.5 text-xs font-medium">{h.aylanma}</td>
                    <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getBadgeClass(h.holat)}`}>{h.ht}</span></td>
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

// -------------------- APPLICATIONS PAGE (new) --------------------
const ApplicationsPage = () => {
  const [applications, setApplications] = useState([
    { id: 1, name: "42-maktab yangi binosi", status: "Ariza yuborilgan", date: "2025-03-25", step: 1 },
    { id: 2, name: "Markaziy poliklinika", status: "Hujjatlar tekshirilmoqda", date: "2025-03-26", step: 2 },
    { id: 3, name: "Sport majmuasi", status: "Qabul qilingan", date: "2025-03-24", step: 5 },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contractor: "",
    step1File: null,
    step2File: null,
    step3File1: null,
    step3File2: null,
    step3File3: null,
    step4File: null,
    step5File: null,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, stepKey) => {
    setFormData({ ...formData, [stepKey]: e.target.files[0] });
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const submitApplication = () => {
    // Mock submit: add new application to list
    const newApp = {
      id: applications.length + 1,
      name: formData.name || "Yangi ob'ekt",
      status: "Ariza yuborilgan",
      date: new Date().toISOString().slice(0, 10),
      step: 1,
    };
    setApplications([...applications, newApp]);
    alert("Ariza muvaffaqiyatli yuborildi!");
    // Reset form
    setFormData({
      name: "", address: "", contractor: "",
      step1File: null, step2File: null, step3File1: null, step3File2: null, step3File3: null,
      step4File: null, step5File: null,
    });
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-sm font-semibold text-white">1-босқич: Объектни рўйхатдан ўтказиш учун ариза юбориш</h3>
            <div className="mt-3 space-y-3">
              <input
                name="name"
                placeholder="Объект номи"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
              />
              <input
                name="address"
                placeholder="Манзил"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
              />
              <input
                name="contractor"
                placeholder="Пудратчи корхона"
                value={formData.contractor}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-sm font-semibold text-white">2-босқич: Лойиха-смета ҳужжатларини ПДФ шаклида юклаш</h3>
            <div className="mt-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'step2File')}
                className="w-full text-white text-sm"
              />
              {formData.step2File && <p className="text-xs text-green-400 mt-1">Танланган: {formData.step2File.name}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-sm font-semibold text-white">3-босқич: 3 та Excel жадвални юклаш</h3>
            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs text-slate-400">Жадвал 1</label>
                <input type="file" accept=".xlsx,.xls" onChange={(e) => handleFileChange(e, 'step3File1')} className="w-full text-white text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Жадвал 2</label>
                <input type="file" accept=".xlsx,.xls" onChange={(e) => handleFileChange(e, 'step3File2')} className="w-full text-white text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Жадвал 3</label>
                <input type="file" accept=".xlsx,.xls" onChange={(e) => handleFileChange(e, 'step3File3')} className="w-full text-white text-sm" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-sm font-semibold text-white">4-босқич: Ўзгартириш бўлганда ҳужжатларни қайта юклаш</h3>
            <div className="mt-3">
              <input
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={(e) => handleFileChange(e, 'step4File')}
                className="w-full text-white text-sm"
              />
              {formData.step4File && <p className="text-xs text-green-400 mt-1">Танланган: {formData.step4File.name}</p>}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-sm font-semibold text-white">5-босқич: Объектни якунлаш тўғрисида далолатнома</h3>
            <div className="mt-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'step5File')}
                className="w-full text-white text-sm"
              />
              {formData.step5File && <p className="text-xs text-green-400 mt-1">Танланган: {formData.step5File.name}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
        <h2 className="text-lg font-semibold text-white">Янги ариза</h2>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step ? 'bg-cyan-500 text-white' : step < currentStep ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {step}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 hidden sm:block">Босқич {step}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            {renderStep()}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30"
            >
              Орқага
            </button>
            {currentStep < 5 ? (
              <button onClick={nextStep} className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium">
                Кейинги
              </button>
            ) : (
              <button onClick={submitApplication} className="px-4 py-2 rounded-lg bg-green-500 text-black font-medium">
                Аризани юбориш
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Юборилган аризалар</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-2">Объект номи</th>
                <th className="pb-2">Ҳолат</th>
                <th className="pb-2">Сана</th>
                <th className="pb-2">Босқич</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-white/10 text-white">
                  <td className="py-2">{app.name}</td>
                  <td className="py-2 text-yellow-400">{app.status}</td>
                  <td className="py-2 text-slate-400">{app.date}</td>
                  <td className="py-2">{app.step}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// -------------------- MAIN APP --------------------
const GasnDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  // API data states
  const [summary, setSummary] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [compareId, setCompareId] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [msg, setMsg] = useState('');

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/companies'),
      api.get('/reports'),
      api.get('/projects'),
    ])
      .then(([a, b, c, d]) => {
        setSummary(a.data);
        setCompanies(b.data.companies || []);
        setReports(c.data.reports || []);
        setProjects(d.data.projects || []);
      })
      .catch(() => setMsg('Ma\'lumot yuklanmadi'));
  }, []);

  // Comparison function
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

  // PDF download function
  const downloadPdf = async (reportId, periodMonth, periodYear) => {
    try {
      await downloadBlob(
        api,
        `/reports/${reportId}/pdf`,
        `hisobot-${periodYear}-${String(periodMonth).padStart(2, '0')}.pdf`
      );
    } catch {
      setMsg('PDF yuklab olinmadi');
    }
  };

  const pageTitles = {
    dashboard: 'GASN — Bosh Panel',
    obyektlar: "Qurilish Ob'ektlari",
    taqqoslash: 'Smeta Taqqoslash',
    kamera: 'Kamera Monitoringi',
    hisobotlar: 'Korxona Hisobotlari',
    arizalar: 'Arizalar va Hujjatlar',
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage summary={summary} />;
      case 'obyektlar':
        return <ObjectsPage />;
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
        return <ReportsPage reports={reports} downloadPdf={downloadPdf} />;
      case 'arizalar':
        return <ApplicationsPage />;
      default:
        return <DashboardPage summary={summary} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-[#e6edf8]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="ml-60 flex flex-col">
        <div className="h-14 bg-[#111827] border-b border-white/10 flex items-center px-6 gap-3 sticky top-0 z-40">
          <div>
            <div className="text-sm font-semibold">{pageTitles[activePage]}</div>
            <div className="text-xs text-[#7a8eaa]">Andijon viloyati · 2016–2025 · 865 ta ob'ekt nazoratda</div>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Jonli nazorat
            </span>
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">5 ta nomuvofiqlik</span>
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-400">12 ta faol ob'ekt</span>
            <span className="text-xs text-[#7a8eaa]">{new Date().toLocaleDateString('uz-UZ')} · {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="p-5 md:p-6">
          {renderPage()}
          {msg && <p className="mt-6 text-sm text-brand-400">{msg}</p>}
        </div>
      </div>
    </div>
  );
};

export default GasnDashboard;