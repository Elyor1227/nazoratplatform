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

// // App.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import AppShell from '../../components/AppShell';
// import { useAuth } from '../../context/AuthContext';

// // -------------------- MOCK DATA --------------------
// const fayllar = [
//   { icon: '📊', name: '2025-Q4 Ish haqi vedomosti.xlsx', meta: 'XLSX · 245 KB', date: '12.01.2026', status: 's-green', st: 'Qabul qilindi' },
//   { icon: '📄', name: '2025-Q4 Shartnoma №4.pdf', meta: 'PDF · 1.2 MB', date: '12.01.2026', status: 's-green', st: 'Tasdiqlandi' },
//   { icon: '📋', name: '2025-Q3 Hisobot to\'plami.pdf', meta: 'PDF · 3.4 MB', date: '10.10.2025', status: 's-green', st: 'Tasdiqlandi' },
//   { icon: '📎', name: '2024-yillik yakuniy hisobot.pdf', meta: 'PDF · 5.1 MB', date: '15.01.2025', status: 's-blue', st: 'Arxivda' },
// ];

// const xabarlar = [
//   { from: 'Soliq inspeksiyasi', text: '2025-Q4 hisobotingiz tasdiqlandi.', time: 'Bugun 08:30', type: 's-green' },
//   { from: 'GASN', text: '14-ob\'ekt kamerasi ma\'lumotlari muvofiqlashtirish talab qiladi.', time: 'Kecha 16:45', type: 's-yellow' },
//   { from: 'Tizim', text: '2025-Q1 hisobotini topshirish muddati — 10 aprel 2026.', time: '27.03.2026', type: 's-blue' },
// ];

// const xodimlarData = [
//   { n: 'Karimov Alisher', lav: 'Usta duvol', pinfl: '12345678901234', ihq: '3 200 000', sana: '01.03.2024', holat: 's-green' },
//   { n: 'Rahimov Bobur', lav: 'Elektrik', pinfl: '23456789012345', ihq: '2 800 000', sana: '15.06.2024', holat: 's-green' },
//   { n: 'Toshmatov Jasur', lav: 'Santexnik', pinfl: '34567890123456', ihq: '2 600 000', sana: '01.09.2024', holat: 's-green' },
//   { n: 'Mirzayev Sardor', lav: 'Muhandis', pinfl: '45678901234567', ihq: '4 500 000', sana: '10.01.2025', holat: 's-green' },
//   { n: 'Xoliqov Nodir', lav: 'Ishchi', pinfl: '56789012345678', ihq: '2 200 000', sana: '01.02.2025', holat: 's-yellow' },
//   { n: 'Qodirov Ulugbek', lav: 'Kranchi', pinfl: '67890123456789', ihq: '3 800 000', sana: '05.03.2025', holat: 's-green' },
// ];

// const tekshiruvlar = [
//   { title: 'Soliq inspeksiyasi — 2024 yillik', status: 's-yellow', st: 'Jarayonda', date: '20.03.2026', detail: 'Inspektor: B. Toshmatov' },
//   { title: 'GASN — 14-ob\'ekt kamera', status: 's-yellow', st: 'Kutilmoqda', date: '18.03.2026', detail: 'Kamera #14 ma\'lumotlari tahlil qilinmoqda' },
//   { title: 'Mehnat inspeksiyasi — 2025-Q3', status: 's-green', st: 'Yopildi', date: '05.01.2026', detail: 'Hech qanday qonunbuzarlik topilmadi' },
//   { title: 'Soliq inspeksiyasi — 2025-Q2', status: 's-green', st: 'Yopildi', date: '10.10.2025', detail: 'Tasdiqlandi' },
// ];

// const reqDocsList = [
//   { key: 'vedomost', label: 'Ish haqi vedomosti', formats: 'XLSX, PDF' },
//   { key: 'shartnoma', label: 'Qurilish shartnomasi', formats: 'PDF' },
//   { key: 'faktura', label: 'Elektron hisob-faktura', formats: 'XML, PDF' },
//   { key: 'ijtimoiy', label: 'Ijtimoiy sug\'urta hisoboti', formats: 'PDF, XLSX' },
// ];

// // Helper functions
// const getStatusClass = (type) => {
//   const classes = {
//     's-green': 'bg-emerald-500/10 text-emerald-600',
//     's-yellow': 'bg-amber-500/10 text-amber-600',
//     's-red': 'bg-red-500/10 text-red-600',
//     's-blue': 'bg-blue-500/10 text-blue-600',
//     's-gray': 'bg-gray-100 text-gray-600',
//   };
//   return classes[type] || classes['s-gray'];
// };

// // -------------------- SIDEBAR --------------------
// const Sidebar = ({ activePage, setActivePage }) => {
//   const { user, logout } = useAuth();

//   const mainItems = [
//     { id: 'dashboard', icon: '⊞', label: 'Dashboard', badge: null },
//     { id: 'hisobot', icon: '📋', label: 'Hisobot yuklash', badge: null },
//     { id: 'xodimlar', icon: '👷', label: "Xodimlar ro'yxati", badge: null },
//     { id: 'shartnomalar', icon: '📄', label: 'Shartnomalar', badge: null },
//   ];
//   const statusItems = [
//     { id: 'tekshiruv', icon: '🔍', label: 'Tekshiruv holati', badge: { type: 'danger', text: '1' } },
//     { id: 'xabarlar', icon: '🔔', label: 'Xabarlar', badge: { type: 'ok', text: '3' } },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 bottom-0 w-[230px] bg-[#0f1623] flex flex-col z-50">
//       <div className="pt-5 pb-4 px-5 border-b border-white/10">
//         <div className="flex items-center gap-2.5">
//           <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-lg">🏢</div>
//           <div>
//             <div className="font-bold text-xs font-['Geologica'] text-white">Korxona Kabineti</div>
//             <div className="text-[10px] text-[#5d6b85]">Qurilish Nazorat Tizimi</div>
//           </div>
//         </div>
//         <div className="mt-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
//           <div className="text-xs font-semibold text-white">Baraka Qurilish LLC</div>
//           <div className="text-[11px] text-[#5d6b85] font-mono">INN: 307 123 456</div>
//           <div className="flex items-center gap-1.5 mt-1.5">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
//             <span className="text-[10px] text-emerald-400">Faol korxona</span>
//           </div>
//         </div>
//       </div>

//       <div className="px-3 pt-4 pb-1">
//         <div className="text-[10px] tracking-wider uppercase text-[#5d6b85] px-2 mb-1.5">Asosiy</div>
//         {mainItems.map(item => (
//           <button
//             key={item.id}
//             onClick={() => setActivePage(item.id)}
//             className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
//               activePage === item.id 
//                 ? 'bg-blue-500/20 text-blue-300' 
//                 : 'text-[#c8d0e0] hover:bg-white/5 hover:text-white'
//             }`}
//           >
//             <span className="text-sm w-4">{item.icon}</span>
//             <span>{item.label}</span>
//           </button>
//         ))}
//       </div>

//       <div className="px-3 pt-4 pb-1">
//         <div className="text-[10px] tracking-wider uppercase text-[#5d6b85] px-2 mb-1.5">Holat</div>
//         {statusItems.map(item => (
//           <button
//             key={item.id}
//             onClick={() => setActivePage(item.id)}
//             className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
//               activePage === item.id 
//                 ? 'bg-blue-500/20 text-blue-300' 
//                 : 'text-[#c8d0e0] hover:bg-white/5 hover:text-white'
//             }`}
//           >
//             <span className="text-sm w-4">{item.icon}</span>
//             <span>{item.label}</span>
//             {item.badge && (
//               <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
//                 item.badge.type === 'danger' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
//               }`}>
//                 {item.badge.text}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//         <button onClick={logout} style={{ width: '100%', height: '40px', backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Chiqish</button>
//       <div className="mt-auto p-3 border-t border-white/10">
//         <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5">
//           <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-semibold text-blue-300">AK</div>
//           <div>
//             <div className="text-xs font-medium text-white">A. Karimov</div>
//             <div className="text-[10px] text-[#5d6b85]">Bosh buxgalter</div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// // -------------------- STAT CARD --------------------
// const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
//   const colorMap = {
//     blue: 'border-t-blue-600',
//     green: 'border-t-emerald-600',
//     amber: 'border-t-amber-600',
//   };
//   return (
//     <div className={`bg-white border border-gray-200 rounded-2xl p-4 relative overflow-hidden border-t-[3px] ${colorMap[color]}`}>
//       <span className="absolute right-4 top-4 text-2xl opacity-15">{icon}</span>
//       <div className="text-[11px] font-medium text-gray-500 mb-2 tracking-wide">{label}</div>
//       <div className="text-2xl font-bold text-gray-800">{value}</div>
//       <div className="text-[11px] text-gray-400 mt-1.5">{sub}</div>
//     </div>
//   );
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
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//           datasets: [
//             { label: 'Daromad solig\'i', data: [5.6, 5.8, 6.1, 5.9, 6.4, 6.2, 6.8, 6.5, 7.1, 6.9, 7.4, 7.0], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 5, borderSkipped: false },
//             { label: 'Ijtimoiy soliq', data: [5.2, 5.4, 5.7, 5.5, 5.9, 5.8, 6.3, 6.0, 6.6, 6.4, 6.9, 6.5], backgroundColor: 'rgba(5,150,105,0.65)', borderRadius: 5, borderSkipped: false }
//           ]
//         },
//         options: {
//           responsive: true, maintainAspectRatio: false,
//           plugins: { legend: { display: false } },
//           scales: {
//             x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b7a99', font: { size: 11 } } },
//             y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b7a99', font: { size: 11 }, callback: v => v + ' mln' } }
//           }
//         }
//       });
//     }
//     return () => { if (chartInstance.current) chartInstance.current.destroy(); };
//   }, []);

//   return <canvas ref={chartRef} className="w-full h-full" />;
// };

// // -------------------- DASHBOARD PAGE --------------------
// const DashboardPage = ({ setActivePage }) => {
//   return (
//     <div>
//       {/* Notification */}
//       <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-3">
//         <span className="text-amber-600 text-base">⚠️</span>
//         <div className="flex-1">
//           <div className="text-xs font-semibold text-amber-700">2025-yil I chorak hisobotini topshirish muddati: 10 aprel 2026</div>
//           <div className="text-[11px] text-amber-600">Ish haqi fondi, xodimlar soni va aylanma ma'lumotlarini yuklang</div>
//         </div>
//         <button onClick={() => setActivePage('hisobot')} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors">Yuklash →</button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-6">
//         <StatCard icon="👷" label="Rasmiy xodimlar soni" value="47" sub="So'nggi hisobot: 15.01.2026" color="blue" />
//         <StatCard icon="💰" label="Oylik ish haqi fondi" value="141 mln so'm" sub="O'rtacha: 3,0 mln so'm/kishi" color="green" />
//         <StatCard icon="📊" label="Yillik aylanma (2025)" value="1,2 mlrd so'm" sub="QQSsiz, 4 ta shartnoma" color="amber" />
//         <StatCard icon="✅" label="Topshirilgan hisobotlar" value="8/9" sub="1 ta kutilmoqda" color="green" />
//       </div>

//       {/* Chart + Timeline */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200">
//             <div className="text-sm font-semibold text-gray-800">Oylik soliq to'lovlar dinamikasi</div>
//             <div className="text-xs text-gray-500">2025 yil · mln so'm</div>
//           </div>
//           <div className="p-5 h-52">
//             <BarChart />
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200">
//             <div className="text-sm font-semibold text-gray-800">Hisobot holati</div>
//           </div>
//           <div className="p-4">
//             <div className="space-y-3">
//               {[
//                 { title: '2024-yil yillik hisobot', status: 'Qabul qilindi', statusClass: 's-green', date: '15.01.2025' },
//                 { title: '2025-Q3 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '10.10.2025' },
//                 { title: '2025-Q4 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '12.01.2026' },
//                 { title: '2025-Q1 chorak hisoboti', status: 'Kutilmoqda', statusClass: 's-yellow', date: 'Muddat: 10.04.2026' },
//               ].map((item, idx) => (
//                 <div key={idx} className="flex gap-3">
//                   <div className="flex flex-col items-center">
//                     <div className={`w-3 h-3 rounded-full border-2 ${idx < 3 ? 'bg-emerald-500 border-emerald-500' : 'bg-amber-50 border-amber-500'}`}></div>
//                     {idx < 3 && <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>}
//                   </div>
//                   <div className="flex-1 pb-4">
//                     <div className="text-xs font-medium text-gray-800">{item.title}</div>
//                     <div className="mt-1"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(item.statusClass)}`}>{item.status}</span></div>
//                     <div className="text-[11px] text-gray-400 mt-1">{item.date}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Files + Messages */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
//             <div className="text-sm font-semibold text-gray-800">So'nggi yuklangan fayllar</div>
//             <button onClick={() => setActivePage('hisobot')} className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">+ Yangi</button>
//           </div>
//           <div>
//             {fayllar.map((f, idx) => (
//               <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
//                 <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{f.icon}</div>
//                 <div className="flex-1">
//                   <div className="text-xs font-medium text-gray-800">{f.name}</div>
//                   <div className="text-[11px] text-gray-500">{f.meta}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[11px] text-gray-400">{f.date}</div>
//                   <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(f.status)}`}>{f.st}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
//             <div className="text-sm font-semibold text-gray-800">Inspektordan xabarlar</div>
//             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">3 yangi</span>
//           </div>
//           <div>
//             {xabarlar.map((x, idx) => (
//               <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
//                 <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">💬</div>
//                 <div className="flex-1">
//                   <div className="text-xs font-medium text-gray-800">{x.from}</div>
//                   <div className="text-[11px] text-gray-500">{x.text}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-[11px] text-gray-400">{x.time}</div>
//                   <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(x.type)}`}>Yangi</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------- HISOBOT YUKLASH PAGE (Wizard) --------------------
// const HisobotPage = () => {
//   const [step, setStep] = useState(1);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [formData, setFormData] = useState({
//     davr: '2025-Q1 (Yanvar–Mart)',
//     tur: 'Pudratchi (bosh)',
//     xodim: '',
//     ihf: '',
//     aylanma: '',
//     obekt: '',
//     izoh: ''
//   });

//   const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

//   const addFiles = (files) => {
//     setUploadedFiles(prev => [...prev, ...Array.from(files)]);
//   };

//   const removeFile = (index) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const buildReview = () => {
//     const fmt = (v) => v ? Number(v).toLocaleString('uz-UZ') + ' so\'m' : '—';
//     return (
//       <div className="grid grid-cols-2 gap-2.5 mb-4">
//         {[
//           ['Hisobot davri', formData.davr],
//           ['Xodimlar soni', formData.xodim ? formData.xodim + ' nafar' : '—'],
//           ['Ish haqi fondi', fmt(formData.ihf)],
//           ['Aylanma (QQSsiz)', fmt(formData.aylanma)],
//           ['Faol ob\'ektlar', formData.obekt ? formData.obekt + ' ta' : '—'],
//         ].map(([k, v]) => (
//           <div key={k} className="bg-gray-50 rounded-lg p-3">
//             <div className="text-[11px] text-gray-500 mb-1">{k}</div>
//             <div className="text-sm font-medium text-gray-800">{v}</div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const resetForm = () => {
//     setFormData({ davr: '2025-Q1 (Yanvar–Mart)', tur: 'Pudratchi (bosh)', xodim: '', ihf: '', aylanma: '', obekt: '', izoh: '' });
//     setUploadedFiles([]);
//     setStep(1);
//   };

//   const StepIndicator = () => (
//     <div className="flex items-center mb-6">
//       {[1, 2, 3, 4].map((s, idx) => (
//         <React.Fragment key={s}>
//           <div className="flex items-center gap-2">
//             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
//               s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-blue-600 text-white' : 'bg-gray-100 border border-gray-300 text-gray-500'
//             }`}>
//               {s < step ? '✓' : s}
//             </div>
//             <span className={`text-xs font-medium ${s === step ? 'text-blue-600' : s < step ? 'text-emerald-600' : 'text-gray-500'}`}>
//               {s === 1 ? "Ma'lumotlar" : s === 2 ? 'Fayllar' : s === 3 ? 'Tekshirish' : 'Yuborish'}
//             </span>
//           </div>
//           {idx < 3 && <div className={`flex-1 h-px mx-2 ${s < step ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>}
//         </React.Fragment>
//       ))}
//     </div>
//   );

//   // Step 1: Ma'lumotlar
//   if (step === 1) {
//     return (
//       <div>
//         <StepIndicator />
//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
//             <div>
//               <div className="text-sm font-semibold text-gray-800">Hisobot ma'lumotlari</div>
//               <div className="text-xs text-gray-500">Asosiy ko'rsatkichlarni kiriting</div>
//             </div>
//             <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600">2025-Q1 · I chorak</span>
//           </div>
//           <div className="p-5">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Hisobot davri</label>
//                 <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={formData.davr} onChange={(e) => updateFormData('davr', e.target.value)}>
//                   <option>2025-Q1 (Yanvar–Mart)</option>
//                   <option>2025-Q2 (Aprel–Iyun)</option>
//                   <option>2024-yillik</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Korxona turi</label>
//                 <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={formData.tur} onChange={(e) => updateFormData('tur', e.target.value)}>
//                   <option>Pudratchi (bosh)</option>
//                   <option>Subpudratchi</option>
//                   <option>Yetkazib beruvchi</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Xodimlar soni (davr oxiri)</label>
//                 <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 47" value={formData.xodim} onChange={(e) => updateFormData('xodim', e.target.value)} />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Oylik ish haqi fondi (so'm)</label>
//                 <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 141000000" value={formData.ihf} onChange={(e) => updateFormData('ihf', e.target.value)} />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Choraklik aylanma (QQSsiz, so'm)</label>
//                 <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 300000000" value={formData.aylanma} onChange={(e) => updateFormData('aylanma', e.target.value)} />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Faol qurilish ob'ektlari soni</label>
//                 <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Masalan: 3" value={formData.obekt} onChange={(e) => updateFormData('obekt', e.target.value)} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Izoh (ixtiyoriy)</label>
//                 <textarea rows="2" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y" placeholder="Qo'shimcha ma'lumotlar..." value={formData.izoh} onChange={(e) => updateFormData('izoh', e.target.value)}></textarea>
//               </div>
//             </div>
//             <div className="flex justify-end">
//               <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(2)}>Davom etish →</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Fayllar
//   if (step === 2) {
//     const handleDrop = (e) => {
//       e.preventDefault();
//       addFiles(e.dataTransfer.files);
//     };
//     const handleDragOver = (e) => e.preventDefault();

//     return (
//       <div>
//         <StepIndicator />
//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200">
//             <div className="text-sm font-semibold text-gray-800">Hujjatlar yuklash</div>
//             <div className="text-xs text-gray-500">Rasmiy hujjatlar va elektron faturalar</div>
//           </div>
//           <div className="p-5">
//             <div 
//               className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-4"
//               onClick={() => document.getElementById('fileInput').click()}
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//             >
//               <div className="text-3xl mb-2">📂</div>
//               <div className="text-sm font-medium text-gray-800">Fayllarni bu yerga tashlang yoki bosing</div>
//               <div className="text-xs text-gray-500">Ish haqi vedomosti, shartnomalar, elektron faturalar</div>
//               <div className="flex gap-1.5 justify-center mt-2">
//                 <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">PDF</span>
//                 <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">XLSX</span>
//                 <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">XML</span>
//                 <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300">JPG</span>
//               </div>
//             </div>
//             <input type="file" id="fileInput" multiple style={{ display: 'none' }} onChange={(e) => addFiles(e.target.files)} />

//             <div className="space-y-2 mb-4">
//               {uploadedFiles.map((f, i) => (
//                 <div key={i} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
//                   <span className="text-lg">{f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.xlsx') ? '📊' : '📎'}</span>
//                   <div className="flex-1">
//                     <div className="text-xs font-medium text-gray-800">{f.name}</div>
//                     <div className="text-[11px] text-gray-500">{(f.size / 1024).toFixed(0)} KB</div>
//                   </div>
//                   <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600">Yuklandi</span>
//                   <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
//               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Talab qilinadigan hujjatlar</div>
//               {reqDocsList.map(doc => (
//                 <div key={doc.key} className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
//                   <span className="text-xs text-gray-700">{doc.label} <span className="text-gray-400">({doc.formats})</span></span>
//                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${uploadedFiles.length > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
//                     {uploadedFiles.length > 0 ? '✓ Yuklandi' : 'Kutilmoqda'}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between">
//               <button className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors" onClick={() => setStep(1)}>← Orqaga</button>
//               <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(3)}>Davom etish →</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Step 3: Tekshirish
//   if (step === 3) {
//     return (
//       <div>
//         <StepIndicator />
//         <div className="bg-white border border-gray-200 rounded-2xl">
//           <div className="px-5 py-3 border-b border-gray-200">
//             <div className="text-sm font-semibold text-gray-800">Ma'lumotlarni tekshirish</div>
//           </div>
//           <div className="p-5">
//             {buildReview()}
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
//               <div className="text-xs font-semibold text-amber-600 mb-1">⚠ Diqqat</div>
//               <div className="text-xs text-gray-600">Yuborilgan ma'lumotlar soliq organlari tomonidan tekshiriladi. Noto'g'ri ma'lumot uchun ma'muriy javobgarlik ko'zda tutilgan.</div>
//             </div>
//             <div className="flex justify-between">
//               <button className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors" onClick={() => setStep(2)}>← Orqaga</button>
//               <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={() => setStep(4)}>Tasdiqlash va yuborish →</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Step 4: Muvaffaqiyat
//   return (
//     <div>
//       <StepIndicator />
//       <div className="bg-white border border-gray-200 rounded-2xl">
//         <div className="p-12 text-center">
//           <div className="text-5xl mb-4">✅</div>
//           <div className="text-xl font-semibold text-gray-800 mb-2">Hisobot muvaffaqiyatli yuborildi!</div>
//           <div className="text-sm text-gray-500 mb-6">Hisobot raqami: <strong className="font-mono text-blue-600">#2026-BQL-0341</strong></div>
//           <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
//             <div className="flex justify-between text-xs py-1.5 border-b border-gray-200"><span className="text-gray-500">Yuborilgan sana</span><span className="font-medium">28.03.2026, 10:14</span></div>
//             <div className="flex justify-between text-xs py-1.5 border-b border-gray-200"><span className="text-gray-500">Davr</span><span className="font-medium">2025-Q1</span></div>
//             <div className="flex justify-between text-xs py-1.5"><span className="text-gray-500">Holat</span><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600">Tekshirilmoqda</span></div>
//           </div>
//           <div className="flex gap-2.5 justify-center">
//             <button onClick={resetForm} className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">Yangi hisobot</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------- XODIMLAR PAGE --------------------
// const XodimlarPage = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [xodimlar, setXodimlar] = useState(xodimlarData);
//   const [newXodim, setNewXodim] = useState({ n: '', lav: '', pinfl: '', ihq: '', sana: '', mut: '' });

//   const addXodim = () => {
//     if (newXodim.n && newXodim.lav) {
//       setXodimlar(prev => [...prev, { ...newXodim, holat: 's-green', ihq: newXodim.ihq + ' so\'m' }]);
//       setNewXodim({ n: '', lav: '', pinfl: '', ihq: '', sana: '', mut: '' });
//       setModalOpen(false);
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white border border-gray-200 rounded-2xl">
//         <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
//           <div>
//             <div className="text-sm font-semibold text-gray-800">Xodimlar ro'yxati</div>
//             <div className="text-xs text-gray-500">Rasmiy bandlik — jami {xodimlar.length} nafar</div>
//           </div>
//           <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ Xodim qo'shish</button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">#</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">F.I.Sh</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Lavozim</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">PINFL</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Ish haqi</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Qabul sanasi</th>
//                 <th className="text-left px-3.5 py-2 text-[10px] font-medium text-gray-500">Holat</th>
//               </tr>
//             </thead>
//             <tbody>
//               {xodimlar.map((x, i) => (
//                 <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                   <td className="px-3.5 py-2.5 text-xs text-gray-500">{i + 1}</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium text-gray-800">{x.n}</td>
//                   <td className="px-3.5 py-2.5 text-xs text-gray-500">{x.lav}</td>
//                   <td className="px-3.5 py-2.5 text-[11px] font-mono text-gray-500">{x.pinfl}</td>
//                   <td className="px-3.5 py-2.5 text-xs font-medium">{x.ihq} so'm</td>
//                   <td className="px-3.5 py-2.5 text-xs text-gray-500">{x.sana}</td>
//                   <td className="px-3.5 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(x.holat)}`}>{x.holat === 's-green' ? 'Faol' : 'Vaqtinchalik'}</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
//           <div className="bg-white rounded-2xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-5">
//               <div className="text-base font-semibold text-gray-800">Yangi xodim qo'shish</div>
//               <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
//             </div>
//             <div className="grid grid-cols-1 gap-3">
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">F.I.Sh</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="Karimov Alisher Bahodir o'g'li" value={newXodim.n} onChange={(e) => setNewXodim({ ...newXodim, n: e.target.value })} /></div>
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Lavozim</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="Usta duvol" value={newXodim.lav} onChange={(e) => setNewXodim({ ...newXodim, lav: e.target.value })} /></div>
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">PINFL</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="12345678901234" maxLength="14" value={newXodim.pinfl} onChange={(e) => setNewXodim({ ...newXodim, pinfl: e.target.value })} /></div>
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Ish haqi (so'm)</label><input className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" placeholder="3000000" value={newXodim.ihq} onChange={(e) => setNewXodim({ ...newXodim, ihq: e.target.value })} /></div>
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Qabul sanasi</label><input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" value={newXodim.sana} onChange={(e) => setNewXodim({ ...newXodim, sana: e.target.value })} /></div>
//               <div><label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Mutaxassislik</label>
//                 <select className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" value={newXodim.mut} onChange={(e) => setNewXodim({ ...newXodim, mut: e.target.value })}>
//                   <option>Qurilishchi</option><option>Elektrik</option><option>Santexnik</option><option>Usta</option><option>Muhandis</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex gap-2 justify-end mt-5">
//               <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">Bekor</button>
//               <button onClick={addXodim} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700">Saqlash</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // -------------------- TEKSHIRUV PAGE --------------------
// const TekshiruvPage = () => {
//   return (
//     <div>
//       <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5">
//         <div className="flex gap-2.5">
//           <span className="text-red-500">🔴</span>
//           <div>
//             <div className="text-xs font-semibold text-red-700">Faol tekshiruv: Soliq inspeksiyasi 2024-yillik hisobotni tekshirmoqda</div>
//             <div className="text-[11px] text-red-600">Ish raqami: TK-2026-0089 · Inspektor: B. Toshmatov · Muddat: 05.04.2026</div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white border border-gray-200 rounded-2xl">
//         <div className="px-5 py-3 border-b border-gray-200">
//           <div className="text-sm font-semibold text-gray-800">Tekshiruv tarixi</div>
//         </div>
//         <div>
//           {tekshiruvlar.map((t, idx) => (
//             <div key={idx} className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
//               <div className="flex-1">
//                 <div className="text-xs font-medium text-gray-800">{t.title}</div>
//                 <div className="text-[11px] text-gray-500">{t.detail}</div>
//               </div>
//               <div className="text-right">
//                 <div className="text-[11px] text-gray-400">{t.date}</div>
//                 <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusClass(t.status)}`}>{t.st}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------- SHARTNOMALAR PAGE (placeholder) --------------------
// const ShartnomalarPage = () => (
//   <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
//     <div className="text-4xl mb-3">📄</div>
//     <div className="text-base font-semibold text-gray-800">Shartnomalar bo'limi</div>
//     <div className="text-sm text-gray-500 mt-1">Tez orada yangi funksiyalar qo'shiladi</div>
//   </div>
// );

// // -------------------- XABARLAR PAGE (placeholder) --------------------
// const XabarlarPage = () => (
//   <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
//     <div className="text-4xl mb-3">🔔</div>
//     <div className="text-base font-semibold text-gray-800">Xabarlar</div>
//     <div className="text-sm text-gray-500 mt-1">Sizda 3 ta yangi xabar mavjud</div>
//   </div>
// );

// // -------------------- MAIN APP --------------------
// const CompanyDashboard = () => {
//   const [activePage, setActivePage] = useState('dashboard');

//   const renderPage = () => {
//     switch (activePage) {
//       case 'dashboard': return <DashboardPage setActivePage={setActivePage} />;
//       case 'hisobot': return <HisobotPage />;
//       case 'xodimlar': return <XodimlarPage />;
//       case 'shartnomalar': return <ShartnomalarPage />;
//       case 'tekshiruv': return <TekshiruvPage />;
//       case 'xabarlar': return <XabarlarPage />;
//       default: return <DashboardPage setActivePage={setActivePage} />;
//     }
//   };

//   const pageTitles = {
//     dashboard: 'Korxona Dashboard',
//     hisobot: 'Hisobot Yuklash',
//     xodimlar: "Xodimlar Ro'yxati",
//     shartnomalar: 'Shartnomalar',
//     tekshiruv: 'Tekshiruv Holati',
//     xabarlar: 'Xabarlar',
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f6fb] text-gray-800">
//       <Sidebar activePage={activePage} setActivePage={setActivePage} />      
//       <div className="ml-[230px] flex flex-col">
//         {/* Top Bar */}
//         <div className="h-14 bg-white border-b border-gray-200 flex items-center px-7 gap-3 sticky top-0 z-40">
//           <div>
//             <div className="text-sm font-semibold font-['Geologica']">{pageTitles[activePage]}</div>
//             <div className="text-xs text-gray-500">Baraka Qurilish LLC · INN 307123456</div>
//           </div>
//           <div className="ml-auto flex items-center gap-2.5">
//             <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 flex items-center gap-1">⚠ 1 ta ogohlantirish</span>
//             <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">2025-Q1 hisoboti kutilmoqda</span>
//             <span className="text-xs text-gray-500">28.03.2026</span>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 md:p-7">
//           {renderPage()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyDashboard;


//=======================================================================================================
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================

import { useEffect, useState, useRef } from 'react';
import api from '../../api.js';
import AppShell from '../../components/AppShell.jsx';
import { downloadBlob } from '../../utils/downloadBlob.js';
import { useAuth } from '../../context/AuthContext.jsx';

// -------------------- MOCK / STATIC DATA --------------------
const fayllar = [
  { icon: '📊', name: '2025-Q4 Ish haqi vedomosti.xlsx', meta: 'XLSX · 245 KB', date: '12.01.2026', status: 's-green', st: 'Qabul qilindi' },
  { icon: '📄', name: '2025-Q4 Shartnoma №4.pdf', meta: 'PDF · 1.2 MB', date: '12.01.2026', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📋', name: '2025-Q3 Hisobot to\'plami.pdf', meta: 'PDF · 3.4 MB', date: '10.10.2025', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📎', name: '2024-yillik yakuniy hisobot.pdf', meta: 'PDF · 5.1 MB', date: '15.01.2025', status: 's-blue', st: 'Arxivda' },
];

const xabarlar = [
  { from: 'Soliq inspeksiyasi', text: '2025-Q4 hisobotingiz tasdiqlandi.', time: 'Bugun 08:30', type: 's-green' },
  { from: 'GASN', text: 'Loyiha-smeta va hisobot ko‘rsatkichlari tekshiruvi rejalashtirildi.', time: 'Kecha 16:45', type: 's-yellow' },
  { from: 'Tizim', text: '2025-Q1 hisobotini topshirish muddati — 10 aprel 2026.', time: '27.03.2026', type: 's-blue' },
];

/** Lavozimlar ro‘yxati (tanlash uchun) */
const LAVOZIMLAR = [
  'Rahbar',
  'Ish boshqaruvchi',
  'Bosh hisobchi',
  'Hisobchi',
  'Haydovchi',
  'Usta',
  'Muhandis',
  'Santexnik',
  'Elektrik',
  'Qoravul',
  'Oshpaz',
  'Boshqa',
];

const xodimlarData = [
  { id: 'x1', n: 'Karimov Alisher', lavozim: 'Usta', pinfl: '12345678901234', ihq: '3 200 000', sana: '2024-03-01', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
  { id: 'x2', n: 'Rahimov Bobur', lavozim: 'Elektrik', pinfl: '23456789012345', ihq: '2 800 000', sana: '2024-06-15', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
  { id: 'x3', n: 'Toshmatov Jasur', lavozim: 'Santexnik', pinfl: '34567890123456', ihq: '2 600 000', sana: '2024-09-01', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
  { id: 'x4', n: 'Mirzayev Sardor', lavozim: 'Muhandis', pinfl: '45678901234567', ihq: '4 500 000', sana: '2025-01-10', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
  { id: 'x5', n: 'Xoliqov Nodir', lavozim: 'Usta', pinfl: '56789012345678', ihq: '2 200 000', sana: '2025-02-01', bandlik: 'yollanma', boshatilgan: '', holat: 's-yellow' },
  { id: 'x6', n: 'Qodirov Ulugbek', lavozim: 'Haydovchi', pinfl: '67890123456789', ihq: '3 800 000', sana: '2025-03-05', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
];

const tekshiruvlar = [
  { title: 'Soliq inspeksiyasi — 2024 yillik', status: 's-yellow', st: 'Jarayonda', date: '20.03.2026', detail: 'Inspektor: B. Toshmatov' },
  { title: 'GASN — smeta va hisobot solishtirish', status: 's-yellow', st: 'Kutilmoqda', date: '18.03.2026', detail: 'Loyiha hujjatlari tahlil qilinmoqda' },
  { title: 'Mehnat inspeksiyasi — 2025-Q3', status: 's-green', st: 'Yopildi', date: '05.01.2026', detail: 'Hech qanday qonunbuzarlik topilmadi' },
  { title: 'Soliq inspeksiyasi — 2025-Q2', status: 's-green', st: 'Yopildi', date: '10.10.2025', detail: 'Tasdiqlandi' },
];

const getStatusClass = (type) => {
  const classes = {
    's-green': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    's-yellow': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    's-red': 'bg-red-500/10 text-red-400 border border-red-500/20',
    's-blue': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    's-gray': 'bg-white/5 text-slate-400 border border-white/10',
  };
  return classes[type] || classes['s-gray'];
};

// -------------------- SIDEBAR --------------------
const NAV_ITEMS = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'hisobot', icon: '📋', label: 'Yakuniy hisobot' },
  { id: 'obekt', icon: '🏗️', label: "Ob'ekt ro'yxatga olish" },
  { id: 'arizalar', icon: '📝', label: 'DAQNI arizalari' },
  { id: 'xodimlar', icon: '👷', label: "Xodimlar ro'yxati" },
  { id: 'shartnomalar', icon: '📄', label: 'Shartnomalar' },
];
const STATUS_ITEMS = [
  { id: 'tekshiruv', icon: '🔍', label: 'Tekshiruv holati', badge: { type: 'danger', text: '1' } },
  { id: 'xabarlar', icon: '🔔', label: 'Xabarlar', badge: { type: 'ok', text: '3' } },
];

const Sidebar = ({ activePage, setActivePage, logout }) => (
  <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 230, background: '#0a0f1a', display: 'flex', flexDirection: 'column', zIndex: 50, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: 0.3 }}>Korxona Kabineti</div>
          <div style={{ fontSize: 10, color: '#4a5568' }}>Qurilish Nazorat Tizimi</div>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Baraka Qurilish LLC</div>
        <div style={{ fontSize: 10, color: '#4a5568', fontFamily: 'monospace' }}>INN: 307 123 456</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
          <span style={{ fontSize: 10, color: '#10b981' }}>Faol korxona</span>
        </div>
      </div>
    </div>

    <div style={{ padding: '12px 8px 4px', flex: 1, overflowY: 'auto' }}>
      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: '#374151', padding: '0 8px', marginBottom: 6 }}>Asosiy</div>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => setActivePage(item.id)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, background: activePage === item.id ? 'rgba(37,99,235,0.15)' : 'transparent', color: activePage === item.id ? '#60a5fa' : '#9ca3af', fontSize: 13, textAlign: 'left', transition: 'all 0.15s' }}>
          <span style={{ width: 18, textAlign: 'center' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: '#374151', padding: '12px 8px 6px' }}>Holat</div>
      {STATUS_ITEMS.map(item => (
        <button key={item.id} onClick={() => setActivePage(item.id)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, background: activePage === item.id ? 'rgba(37,99,235,0.15)' : 'transparent', color: activePage === item.id ? '#60a5fa' : '#9ca3af', fontSize: 13, textAlign: 'left', transition: 'all 0.15s' }}>
          <span style={{ width: 18, textAlign: 'center' }}>{item.icon}</span>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 99, background: item.badge.type === 'danger' ? '#ef4444' : '#10b981', color: '#fff' }}>{item.badge.text}</span>
          )}
        </button>
      ))}
    </div>

    <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={logout} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#9ca3af', fontSize: 12, cursor: 'pointer' }}>Chiqish</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#60a5fa' }}>AK</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>A. Karimov</div>
          <div style={{ fontSize: 10, color: '#4a5568' }}>Bosh buxgalter</div>
        </div>
      </div>
    </div>
  </aside>
);

// -------------------- STAT CARD --------------------
const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const accent = { blue: '#2563eb', green: '#059669', amber: '#d97706' }[color];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderTop: `3px solid ${accent}`, borderRadius: 16, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', right: 14, top: 14, fontSize: 24, opacity: 0.12 }}>{icon}</span>
      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#4b5563', marginTop: 4 }}>{sub}</div>
    </div>
  );
};

// -------------------- DASHBOARD PAGE --------------------
const DashboardPage = ({ setActivePage }) => (
  <div>
    <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ color: '#f59e0b', fontSize: 16 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24' }}>2025-yil I chorak hisobotini topshirish muddati: 10 aprel 2026</div>
        <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>Ish haqi fondi, xodimlar soni va aylanma ma'lumotlarini yuklang</div>
      </div>
      <button onClick={() => setActivePage('hisobot')} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(217,119,6,0.4)', background: 'transparent', color: '#fbbf24', fontSize: 11, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Yuklash →</button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
      <StatCard icon="👷" label="Rasmiy xodimlar soni" value="47" sub="So'nggi hisobot: 15.01.2026" color="blue" />
      <StatCard icon="💰" label="Oylik ish haqi fondi" value="141 mln so'm" sub="O'rtacha: 3,0 mln so'm/kishi" color="green" />
      <StatCard icon="📊" label="Yillik aylanma (2025)" value="1,2 mlrd so'm" sub="QQSsiz, 4 ta shartnoma" color="amber" />
      <StatCard icon="✅" label="Topshirilgan hisobotlar" value="8/9" sub="1 ta kutilmoqda" color="green" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      {/* Hisobot holati */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Hisobot holati</div>
        </div>
        <div style={{ padding: 16 }}>
          {[
            { title: '2024-yil yillik hisobot', status: 'Qabul qilindi', statusClass: 's-green', date: '15.01.2025', done: true },
            { title: '2025-Q3 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '10.10.2025', done: true },
            { title: '2025-Q4 chorak hisoboti', status: 'Tasdiqlandi', statusClass: 's-green', date: '12.01.2026', done: true },
            { title: '2025-Q1 chorak hisoboti', status: 'Kutilmoqda', statusClass: 's-yellow', date: 'Muddat: 10.04.2026', done: false },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.done ? '#10b981' : 'transparent', border: item.done ? '2px solid #10b981' : '2px solid #d97706', flexShrink: 0 }}></div>
                {idx < 3 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', marginTop: 4 }}></div>}
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{item.title}</div>
                <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(item.statusClass)}>{item.status}</span>
                <div style={{ fontSize: 11, color: '#4b5563', marginTop: 4 }}>{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspektordan xabarlar */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Inspektordan xabarlar</div>
          <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>3 yangi</span>
        </div>
        <div>
          {xabarlar.map((x, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{x.from}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{x.text}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#4b5563' }}>{x.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* So'nggi fayllar */}
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>So'nggi yuklangan fayllar</div>
        <button onClick={() => setActivePage('hisobot')} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#9ca3af', fontSize: 11, cursor: 'pointer' }}>+ Yangi</button>
      </div>
      {fayllar.map((f, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{f.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{f.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{f.meta}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#4b5563' }}>{f.date}</div>
            <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(f.status)}>{f.st}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// -------------------- YAKUNIY HISOBOT (REAL API, faylsiz) --------------------
const emptyYakuniyForm = () => ({
  startDate: '',
  endDate: '',
  projectTotal: '',
  vatTax: '',
  payrollFund: '',
  incomeTax: '',
  socialTax: '',
  employeeCount: '',
  objectName: '',
  notes: '',
});

const HisobotPage = () => {
  const [reports, setReports] = useState([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyYakuniyForm);

  async function load() {
    try {
      const r = await api.get('/reports');
      setReports(r.data.reports || []);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    load();
  }, []);

  function buildNotesPayload() {
    const lines = [
      '[Yakuniy hisobot]',
      `Qurilish boshlangan sana: ${form.startDate || '—'}`,
      `Qurilish yakunlangan sana: ${form.endDate || '—'}`,
      `Qo’shimcha qiymat soliqi (QQS) summasi: ${form.vatTax || '—'} so'm`,
      `Daromad soliqi: ${form.incomeTax || '—'} so'm`,
      `Ijtimoiy soliqi: ${form.socialTax || '—'} so'm`,
    ];
    if (form.notes?.trim()) lines.push(`Izoh: ${form.notes.trim()}`);
    return lines.join('\n');
  }

  async function handleSubmit() {
    setMsg('');
    if (!form.startDate || !form.endDate) {
      setMsg('Qurilish boshlangan va yakunlangan sanalarni kiriting');
      setMsgType('error');
      return;
    }
    try {
      const end = new Date(form.endDate);
      const periodYear = end.getFullYear();
      const periodMonth = end.getMonth() + 1;
      const fd = new FormData();
      fd.append('periodYear', String(periodYear));
      fd.append('periodMonth', String(periodMonth));
      fd.append('employeeCount', String(form.employeeCount || 0));
      fd.append('payrollFund', String(form.payrollFund || 0));
      fd.append('contractAmount', String(form.projectTotal || 0));
      fd.append('constructionType', form.objectName?.trim() || 'Yakuniy hisobot');
      fd.append('notes', buildNotesPayload());
      await api.post('/reports', fd);
      setMsg('Yakuniy hisobot saqlandi.');
      setMsgType('success');
      setStep(3);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Xatolik yuz berdi');
      setMsgType('error');
    }
  }

  async function downloadPdf(reportId) {
    try {
      await downloadBlob(api, `/reports/${reportId}/pdf`, 'yakuniy-hisobot.pdf');
    } catch {
      setMsg('PDF yuklab olinmadi');
      setMsgType('error');
    }
  }

  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
      {[
        { n: 1, label: "Ma'lumotlar" },
        { n: 2, label: 'Tekshirish' },
        { n: 3, label: 'Yuborildi' },
      ].map((s, idx) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : 'initial' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                background: s.n < step ? '#10b981' : s.n === step ? '#2563eb' : 'rgba(255,255,255,0.05)',
                border: s.n < step ? '2px solid #10b981' : s.n === step ? '2px solid #2563eb' : '2px solid rgba(255,255,255,0.12)',
                color: s.n <= step ? '#fff' : '#6b7280',
              }}
            >
              {s.n < step ? '✓' : s.n}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: s.n === step ? '#60a5fa' : s.n < step ? '#10b981' : '#6b7280' }}>{s.label}</span>
          </div>
          {idx < 2 && <div style={{ flex: 1, height: 1, background: s.n < step ? '#10b981' : 'rgba(255,255,255,0.08)', margin: '0 12px', minWidth: 24 }} />}
        </div>
      ))}
    </div>
  );

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#0a0f1a', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 500 };
  const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 };

  const resetForm = () => {
    setForm(emptyYakuniyForm());
    setStep(1);
    setMsg('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <section style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Yakuniy hisobot</h2>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 24 }}>
          Obyekt yakunlanganda kiritiladi — qurilish muddati, loyiha qiymati, soliqlar va xodimlar.
        </p>

        <StepIndicator />

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Qurilish boshlangan sana</label>
                <input type="date" required style={inputStyle} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Qurilish yakunlangan sana</label>
                <input type="date" required style={inputStyle} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Loyiha umumiy qiymati (so'mda)</label>
              <input type="number" min={0} style={inputStyle} value={form.projectTotal} onChange={(e) => setForm({ ...form, projectTotal: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Qo&apos;shilgan qiymat soliqi summasi (so'mda)</label>
              <input type="number" min={0} style={inputStyle} value={form.vatTax} onChange={(e) => setForm({ ...form, vatTax: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Ish haqi fondi (so'mda)</label>
              <input type="number" min={0} style={inputStyle} value={form.payrollFund} onChange={(e) => setForm({ ...form, payrollFund: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Daromad soliqi (so'mda)</label>
                <input type="number" min={0} style={inputStyle} value={form.incomeTax} onChange={(e) => setForm({ ...form, incomeTax: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Ijtimoiy soliqi (so'mda)</label>
                <input type="number" min={0} style={inputStyle} value={form.socialTax} onChange={(e) => setForm({ ...form, socialTax: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Xodimlar soni</label>
              <input type="number" min={0} style={inputStyle} value={form.employeeCount} onChange={(e) => setForm({ ...form, employeeCount: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Obyekt nomi / tavsif</label>
              <input style={inputStyle} placeholder="Masalan: 12-maktab yangi binosi" value={form.objectName} onChange={(e) => setForm({ ...form, objectName: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Izoh (ixtiyoriy)</label>
              <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setStep(2)} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Davom etish →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                ['Qurilish boshlangan', form.startDate || '—'],
                ['Qurilish yakunlangan', form.endDate || '—'],
                ['Loyiha umumiy qiymati', form.projectTotal ? Number(form.projectTotal).toLocaleString() + " so'm" : '—'],
                ['QQS summasi', form.vatTax ? Number(form.vatTax).toLocaleString() + " so'm" : '—'],
                ['Ish haqi fondi', form.payrollFund ? Number(form.payrollFund).toLocaleString() + " so'm" : '—'],
                ['Daromad soliqi', form.incomeTax ? Number(form.incomeTax).toLocaleString() + " so'm" : '—'],
                ['Ijtimoiy soliqi', form.socialTax ? Number(form.socialTax).toLocaleString() + " so'm" : '—'],
                ['Xodimlar soni', form.employeeCount || '—'],
                ['Obyekt', form.objectName || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <span style={{ color: '#e5e7eb', fontWeight: 500, textAlign: 'right', maxWidth: '58%' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 11, color: '#fbbf24' }}>
              ⚠ Yuborilgan ma&apos;lumotlar tekshiriladi. Noto&apos;g&apos;ri ma&apos;lumot uchun javobgarlik qonunchilikka muvofiq.
            </div>
            {msg && (
              <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msgType === 'success' ? '#10b981' : '#ef4444' }}>{msg}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
                ← Orqaga
              </button>
              <button type="button" onClick={handleSubmit} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Tasdiqlash va yuborish ✓
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Yakuniy hisobot yuborildi!</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Ma&apos;lumotlar saqlandi</div>
            <button type="button" onClick={resetForm} style={{ padding: '9px 24px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
              Yangi yakuniy hisobot →
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Yuborilgan hisobotlar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map((r) => (
            <div key={r._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                  {r.periodMonth}/{r.periodYear} · {r.constructionType || 'Hisobot'}
                </span>
                <button type="button" onClick={() => downloadPdf(r._id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                  PDF
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Xodimlar: {r.employeeCount}, loyiha: {r.contractAmount?.toLocaleString()} so'm</p>
              {r.notes && (
                <p style={{ color: '#4b5563', fontSize: 11, marginTop: 8, whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>{r.notes.slice(0, 200)}{r.notes.length > 200 ? '…' : ''}</p>
              )}
            </div>
          ))}
          {reports.length === 0 && <p style={{ color: '#4b5563', fontSize: 13 }}>Hali hisobot yo'q.</p>}
        </div>
      </section>
    </div>
  );
};

// -------------------- OB'EKT RO'YXATGA OLISH (5-BOSQICH) --------------------
const ObektPage = () => {
  const [applicationSent, setApplicationSent] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [stepStatus, setStepStatus] = useState({ 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle' });
  const [stepFiles, setStepFiles] = useState({ 2: [], 3: [], 4: [], 5: [] });
  const [appForm, setAppForm] = useState({ name: '', address: '', type: '', area: '', start: '' });
  const [msg, setMsg] = useState('');

  const steps = [
    { n: 1, icon: '📋', title: 'Ariza yuborish', desc: "Ob'ektni ro'yxatdan o'tkazish uchun ariza to'ldiring va yuboring" },
    { n: 2, icon: '📐', title: 'Loyiha-smeta hujjatlari', desc: "Barcha loyiha-smeta hujjatlarini PDF shaklida yuklang" },
    { n: 3, icon: '📊', title: 'Excel jadvallari', desc: "Ilovada ko'rsatilgan 3 ta Excel jadvalini to'ldiring va yuklang" },
    { n: 4, icon: '🔄', title: 'O\'zgartishlar bo\'lganda qayta yuklash', desc: "Ob'ektda o'zgarish bo'lganda barcha hujjatlarni qayta yuklang" },
    { n: 5, icon: '🏁', title: 'Yakunlash dalolanoması', desc: "Ob'ektni foydalanishga topshirish dalolanomasini yuklang" },
  ];

  const handleSendApplication = () => {
    if (!appForm.name || !appForm.address || !appForm.type) {
      setMsg("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }
    setMsg('');
    setStepStatus(s => ({ ...s, 1: 'done' }));
    setApplicationSent(true);
    setActiveStep(2);
  };

  const handleUpload = (stepNum) => {
    if (!stepFiles[stepNum] || stepFiles[stepNum].length === 0) {
      setMsg("Iltimos, hujjat yuklang");
      return;
    }
    setMsg('');
    setStepStatus(s => ({ ...s, [stepNum]: 'done' }));
    if (stepNum < 5) setActiveStep(stepNum + 1);
    else setMsg('Barcha bosqichlar muvaffaqiyatli yakunlandi!');
  };

  const isLocked = (stepNum) => stepNum !== 1 && !applicationSent;

  const getStepColor = (s) => {
    if (stepStatus[s.n] === 'done') return '#10b981';
    if (activeStep === s.n && !isLocked(s.n)) return '#2563eb';
    if (isLocked(s.n)) return '#374151';
    return '#4b5563';
  };

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#0a0f1a', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 500 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
      {/* Steps sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((s, idx) => {
          const locked = isLocked(s.n);
          const done = stepStatus[s.n] === 'done';
          const active = activeStep === s.n && !locked;
          return (
            <button key={s.n} onClick={() => !locked && setActiveStep(s.n)} disabled={locked}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, border: active ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)', background: active ? 'rgba(37,99,235,0.1)' : done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', cursor: locked ? 'not-allowed' : 'pointer', textAlign: 'left', opacity: locked ? 0.4 : 1, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#10b981' : active ? '#2563eb' : 'rgba(255,255,255,0.06)', fontSize: done ? 14 : 16, flexShrink: 0 }}>
                  {done ? '✓' : s.icon}
                </div>
                {idx < 4 && <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.06)', marginTop: 4 }}></div>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: done ? '#10b981' : active ? '#60a5fa' : '#9ca3af', marginBottom: 3 }}>{s.n}. {s.title}</div>
                <div style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
        {/* Step 1: Ariza */}
        {activeStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📋</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Ob'ektni ro'yxatdan o'tkazish uchun ariza</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginTop: 2 }}>Ariza yuborilgandan so'ng qolgan bosqichlar ochiladi</p>
              </div>
            </div>

            {stepStatus[1] === 'done' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>Ariza muvaffaqiyatli yuborildi!</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Ob'ekt: <strong style={{ color: '#e5e7eb' }}>{appForm.name}</strong></div>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: 14, fontSize: 12, color: '#10b981', marginBottom: 20 }}>
                  Endi 2–5-bosqichlar ochildi. Keyingi bosqichga o'ting.
                </div>
                <button onClick={() => setActiveStep(2)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>2-bosqichga o'tish →</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Ob'ekt nomi *</label>
                    <input style={inputStyle} placeholder="Masalan: 5-mavzey 12-uy qurilishi" value={appForm.name} onChange={e => setAppForm({ ...appForm, name: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Manzil *</label>
                    <input style={inputStyle} placeholder="Viloyat, tuman, ko'cha" value={appForm.address} onChange={e => setAppForm({ ...appForm, address: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Qurilish turi *</label>
                    <select style={{ ...inputStyle }} value={appForm.type} onChange={e => setAppForm({ ...appForm, type: e.target.value })}>
                      <option value="">Tanlang...</option>
                      <option>Turar-joy binosi</option>
                      <option>Tijorat binosi</option>
                      <option>Infratuzilma</option>
                      <option>Sanoat ob'ekti</option>
                      <option>Ijtimoiy ob'ekt</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Umumiy maydon (m²)</label>
                    <input type="number" style={inputStyle} placeholder="0" value={appForm.area} onChange={e => setAppForm({ ...appForm, area: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Qurilish boshlanish sanasi</label>
                    <input type="date" style={inputStyle} value={appForm.start} onChange={e => setAppForm({ ...appForm, start: e.target.value })} />
                  </div>
                </div>
                {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{msg}</div>}
                <button onClick={handleSendApplication} style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Ariza yuborish 📤
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Loyiha-smeta */}
        {activeStep === 2 && !isLocked(2) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📐</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Loyiha-smeta hujjatlari</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginTop: 2 }}>Barcha hujjatlarni PDF shaklida yuklang</p>
              </div>
            </div>
            {stepStatus[2] === 'done' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>Hujjatlar yuklandi</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 20 }}>{stepFiles[2].length} ta fayl muvaffaqiyatli qabul qilindi</div>
                <button onClick={() => setActiveStep(3)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>3-bosqichga o'tish →</button>
              </div>
            ) : (
              <div>
                <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12, color: '#93c5fd' }}>
                  📌 Quyidagi hujjatlar talab qilinadi: Loyiha topshirig'i, Arxitektura qismi, Konstruktiv qism, Muhandislik tarmoqlari, Smeta hujjatlar to'plami
                </div>
                <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14 }}>
                  <input type="file" multiple accept=".pdf" onChange={e => setStepFiles(s => ({ ...s, 2: Array.from(e.target.files || []) }))} style={{ display: 'none' }} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>PDF fayllarni yuklang</div>
                </label>
                {stepFiles[2].length > 0 && stepFiles[2].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#e5e7eb' }}>
                    📄 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                  </div>
                ))}
                {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{msg}</div>}
                <button onClick={() => handleUpload(2)} style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
                  Yuklash va davom etish →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Excel jadvallari */}
        {activeStep === 3 && !isLocked(3) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📊</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Excel jadvallari</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginTop: 2 }}>3 ta Excel jadvalini to'ldirgan holda yuklang</p>
              </div>
            </div>
            {stepStatus[3] === 'done' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>Jadvallar yuklandi</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 20 }}>{stepFiles[3].length} ta fayl qabul qilindi</div>
                <button onClick={() => setActiveStep(4)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>4-bosqichga o'tish →</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {['1-jadval: Xodimlar va ish haqi ma\'lumotlari', '2-jadval: Material va resurslar ro\'yxati', '3-jadval: Qurilish bosqichlari va muddatlar'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(5,150,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
                      <div style={{ flex: 1, fontSize: 12, color: '#e5e7eb' }}>{t}</div>
                      <a href="#" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none' }}>Yuklab olish ↓</a>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14 }}>
                  <input type="file" multiple accept=".xlsx,.xls" onChange={e => setStepFiles(s => ({ ...s, 3: Array.from(e.target.files || []) }))} style={{ display: 'none' }} />
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>To'ldirilgan Excel fayllarni yuklang (XLSX)</div>
                </label>
                {stepFiles[3].length > 0 && stepFiles[3].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#e5e7eb' }}>
                    📊 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                  </div>
                ))}
                <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 11, color: '#fbbf24' }}>
                  ⚠ Kamida 3 ta jadval (xodimlar, materiallar, muddatlar) yuklash shart
                </div>
                {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{msg}</div>}
                <button onClick={() => handleUpload(3)} style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Yuklash va davom etish →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: O'zgarishlar */}
        {activeStep === 4 && !isLocked(4) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(217,119,6,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔄</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>O'zgarishlar bo'lganda qayta yuklash</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginTop: 2 }}>Ob'ektda o'zgarish bo'lganda barcha hujjatlarni qayta yuklang</p>
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12, color: '#fbbf24' }}>
              ℹ️ Bu bosqich ixtiyoriy. Agar ob'ektda o'zgarish bo'lmasa, to'g'ridan-to'g'ri 5-bosqichga o'tishingiz mumkin.
            </div>
            {stepStatus[4] === 'done' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>Yangilangan hujjatlar yuklandi</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 20 }}>{stepFiles[4].length} ta fayl qabul qilindi</div>
                <button onClick={() => setActiveStep(5)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>5-bosqichga o'tish →</button>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14 }}>
                  <input type="file" multiple accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png" onChange={e => setStepFiles(s => ({ ...s, 4: Array.from(e.target.files || []) }))} style={{ display: 'none' }} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>Yangilangan hujjatlarni yuklang</div>
                  <div style={{ fontSize: 11, color: '#4b5563', marginTop: 4 }}>PDF, XLSX, JPG formatlarda</div>
                </label>
                {stepFiles[4].length > 0 && stepFiles[4].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#e5e7eb' }}>
                    📎 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setActiveStep(5)} style={{ flex: 1, padding: '11px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>O'tkazib yuborish →</button>
                  <button onClick={() => handleUpload(4)} style={{ flex: 2, padding: '11px', borderRadius: 8, border: 'none', background: '#d97706', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Yuklash →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Yakunlash */}
        {activeStep === 5 && !isLocked(5) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏁</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Yakunlash dalolanoması</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginTop: 2 }}>Ob'ektni foydalanishga topshirish dalolanomasini yuklang</p>
              </div>
            </div>
            {stepStatus[5] === 'done' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>Ob'ekt muvaffaqiyatli yakunlandi!</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Barcha 5 bosqich muvaffaqiyatli o'tdi. Ob'ekt foydalanishga topshirildi.</div>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 16, fontSize: 12, color: '#10b981' }}>
                  ✓ Ro'yxatdan o'tkazish ariza yuborildi<br />
                  ✓ Loyiha-smeta hujjatlari yuklandi<br />
                  ✓ Excel jadvallari yuklandi<br />
                  ✓ Yakunlash dalolanoması yuklandi
                </div>
              </div>
            ) : (
              <div>
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12, color: '#34d399' }}>
                  📌 Talab qilinadigan hujjatlar: Qabul topshirish dalolatnomasi (f.KS-11), Texnik hisobot, Sanitariya-epidemiologiya xulosasi
                </div>
                <label style={{ display: 'block', border: '2px dashed rgba(16,185,129,0.2)', borderRadius: 10, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14 }}>
                  <input type="file" multiple accept=".pdf" onChange={e => setStepFiles(s => ({ ...s, 5: Array.from(e.target.files || []) }))} style={{ display: 'none' }} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>Dalolatnomani PDF shaklda yuklang</div>
                </label>
                {stepFiles[5].length > 0 && stepFiles[5].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, fontSize: 12, color: '#e5e7eb' }}>
                    📄 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                  </div>
                ))}
                {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msgType === 'success' ? '#10b981' : '#ef4444' }}>{msg}</div>}
                <button onClick={() => handleUpload(5)} style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
                  Yuklash va yakunlash 🏁
                </button>
              </div>
            )}
          </div>
        )}

        {/* Locked state */}
        {isLocked(activeStep) && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>Bu bosqich hali ochilmagan</div>
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 24 }}>Avval 1-bosqichda ariza yuboring. Ariza tasdiqlangandan so'ng qolgan bosqichlar avtomatik ochiladi.</div>
            <button onClick={() => setActiveStep(1)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>1-bosqichga o'tish →</button>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------- XODIMLAR PAGE --------------------
const XodimlarPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [xodimlar, setXodimlar] = useState(xodimlarData);
  const [editCell, setEditCell] = useState(null);
  const [newXodim, setNewXodim] = useState({
    n: '',
    lavozim: LAVOZIMLAR[0],
    pinfl: '',
    ihq: '',
    sana: '',
    bandlik: 'doimiy',
    boshatilgan: '',
  });
  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#0a0f1a', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: 10, color: '#9ca3af', display: 'block', marginBottom: 5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 };

  const holatYozuv = (x) => {
    if (x.boshatilgan) return "Bo'shatilgan";
    if (x.bandlik === 'yollanma' || x.holat === 's-yellow') return "Yollanma ishchi";
    return 'Faol';
  };

  const addXodim = () => {
    if (newXodim.n && newXodim.lavozim) {
      const holat = newXodim.bandlik === 'yollanma' ? 's-yellow' : 's-green';
      setXodimlar((prev) => [
        ...prev,
        {
          id: `x${Date.now()}`,
          n: newXodim.n,
          lavozim: newXodim.lavozim,
          pinfl: newXodim.pinfl,
          ihq: newXodim.ihq,
          sana: newXodim.sana,
          bandlik: newXodim.bandlik,
          boshatilgan: newXodim.boshatilgan || '',
          holat,
        },
      ]);
      setNewXodim({ n: '', lavozim: LAVOZIMLAR[0], pinfl: '', ihq: '', sana: '', bandlik: 'doimiy', boshatilgan: '' });
      setModalOpen(false);
    }
  };

  const patchXodim = (id, patch) => {
    setXodimlar((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const next = { ...x, ...patch };
        if (patch.boshatilgan) next.holat = 's-gray';
        else if (patch.boshatilgan === '') next.holat = next.bandlik === 'yollanma' ? 's-yellow' : 's-green';
        else if (patch.bandlik === 'yollanma') next.holat = 's-yellow';
        else if (patch.bandlik === 'doimiy') next.holat = 's-green';
        return next;
      })
    );
    setEditCell(null);
  };

  return (
    <div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Xodimlar ro'yxati</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>F.I.Sh. va lavozimni ustiga bosib tahrirlash mumkin · jami {xodimlar.length} nafar</div>
          </div>
          <button onClick={() => setModalOpen(true)} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Yangi xodim</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['#', 'F.I.Sh', 'Lavozimi', 'PINFL', 'Ish haqi', 'Qabul sanasi', "Bo'shatilgan sana", 'Holat'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xodimlar.map((x, i) => (
                <tr key={x.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#6b7280' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>
                    {editCell?.id === x.id && editCell.field === 'n' ? (
                      <input
                        autoFocus
                        style={{ ...inputStyle, padding: '4px 8px' }}
                        value={editCell.value}
                        onChange={(e) => setEditCell({ ...editCell, value: e.target.value })}
                        onBlur={() => patchXodim(x.id, { n: editCell.value })}
                        onKeyDown={(e) => e.key === 'Enter' && patchXodim(x.id, { n: editCell.value })}
                      />
                    ) : (
                      <button type="button" onClick={() => setEditCell({ id: x.id, field: 'n', value: x.n })} style={{ background: 'none', border: 'none', color: '#e5e7eb', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                        {x.n} ✎
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#9ca3af' }}>
                    {editCell?.id === x.id && editCell.field === 'lavozim' ? (
                      <select
                        autoFocus
                        style={{ ...inputStyle, padding: '4px 8px' }}
                        value={editCell.value}
                        onChange={(e) => setEditCell({ ...editCell, value: e.target.value })}
                        onBlur={() => patchXodim(x.id, { lavozim: editCell.value })}
                      >
                        {LAVOZIMLAR.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button type="button" onClick={() => setEditCell({ id: x.id, field: 'lavozim', value: x.lavozim || x.lav || LAVOZIMLAR[0] })} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>
                        {x.lavozim || x.lav} ✎
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', color: '#6b7280' }}>{x.pinfl}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{x.ihq} so'm</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#6b7280' }}>{x.sana}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#6b7280' }}>
                    <input
                      type="date"
                      style={{ ...inputStyle, padding: '4px 8px', maxWidth: 140 }}
                      value={x.boshatilgan || ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        patchXodim(x.id, v ? { boshatilgan: v } : { boshatilgan: '' });
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(x.holat)}>{holatYozuv(x)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div onClick={(e) => e.target === e.currentTarget && setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, width: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Yangi xodim qo'shish</div>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>F.I.Sh</label>
                <input type="text" style={inputStyle} placeholder="Karimov Alisher Bahodir o'g'li" value={newXodim.n} onChange={(e) => setNewXodim({ ...newXodim, n: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Bandlik turi</label>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#e5e7eb', cursor: 'pointer' }}>
                    <input type="radio" name="bandlik" checked={newXodim.bandlik === 'doimiy'} onChange={() => setNewXodim({ ...newXodim, bandlik: 'doimiy' })} />
                    Doimiy
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#e5e7eb', cursor: 'pointer' }}>
                    <input type="radio" name="bandlik" checked={newXodim.bandlik === 'yollanma'} onChange={() => setNewXodim({ ...newXodim, bandlik: 'yollanma' })} />
                    Yollanma
                  </label>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Lavozimi</label>
                <select style={inputStyle} value={newXodim.lavozim} onChange={(e) => setNewXodim({ ...newXodim, lavozim: e.target.value })}>
                  {LAVOZIMLAR.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>PINFL</label>
                <input type="text" style={inputStyle} placeholder="12345678901234" maxLength={14} value={newXodim.pinfl} onChange={(e) => setNewXodim({ ...newXodim, pinfl: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Ish haqi (so'm)</label>
                <input type="number" style={inputStyle} placeholder="3000000" value={newXodim.ihq} onChange={(e) => setNewXodim({ ...newXodim, ihq: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Qabul sanasi</label>
                <input type="date" style={inputStyle} value={newXodim.sana} onChange={(e) => setNewXodim({ ...newXodim, sana: e.target.value })} />
              </div>
              <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={labelStyle}>Bo'shatilgan sana (agar mavjud bo'lsa)</label>
                <input type="date" style={inputStyle} value={newXodim.boshatilgan} onChange={(e) => setNewXodim({ ...newXodim, boshatilgan: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Bekor</button>
              <button type="button" onClick={addXodim} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- DAQNI ARIZALARI (API) --------------------
const companyAppStatus = (s) => {
  if (s === 'approved') return { text: 'Ma’qullangan', cls: 's-green' };
  if (s === 'rejected') return { text: 'Rad etilgan', cls: 's-red' };
  return { text: 'Kutilmoqda', cls: 's-yellow' };
};

const ArizalarPage = () => {
  const [applications, setApplications] = useState([]);
  const [objectName, setObjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data.applications || []);
    } catch {
      setMsg('Arizalar yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!objectName.trim()) return;
    setSending(true);
    setMsg('');
    try {
      await api.post('/applications', { objectName: objectName.trim(), notes: notes.trim() });
      setObjectName('');
      setNotes('');
      await load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Yuborilmadi');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(15,23,42,0.8)',
    color: '#e5e7eb',
    fontSize: 13,
    outline: 'none',
  };
  const labelStyle = { display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 6 };

  return (
    <div>
      <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#67e8f9' }}>DAQNI ga obyektni ro‘yxatga olish arizasi</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          Ariza yuborilgach, inspektor F.I.Sh. biriktiradi va tasdiqlaydi. Holatni quyidagi jadvaldan kuzating.
        </div>
      </div>

      <form
        onSubmit={submit}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 24 }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Yangi ariza</div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Obyekt nomi / manzili *</label>
          <input
            type="text"
            style={inputStyle}
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="Masalan: 42-maktab yangi binosi"
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Izoh (ixtiyoriy)</label>
          <textarea
            style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Qisqa izoh"
          />
        </div>
        {msg && <div style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>{msg}</div>}
        <button
          type="submit"
          disabled={sending || !objectName.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: sending ? 'rgba(37,99,235,0.5)' : '#2563eb',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: sending ? 'wait' : 'pointer',
          }}
        >
          {sending ? 'Yuborilmoqda…' : 'Arizani yuborish'}
        </button>
      </form>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Mening arizalarim</div>
        </div>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>Yuklanmoqda…</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>Hozircha ariza yo‘q.</div>
        ) : (
          applications.map((a) => {
            const st = companyAppStatus(a.status);
            const dateStr = a.createdAt ? new Date(a.createdAt).toLocaleDateString('uz-UZ') : '—';
            return (
              <div
                key={a._id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>{a.objectName}</div>
                  {a.notes ? <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{a.notes}</div> : null}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{dateStr}</div>
                <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }} className={getStatusClass(st.cls)}>
                  {st.text}
                </span>
                <div style={{ fontSize: 11, color: '#94a3b8', minWidth: 140 }}>
                  DAQNI: {a.gasnInspectorFio || '—'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// -------------------- TEKSHIRUV PAGE --------------------
const TekshiruvPage = () => (
  <div>
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12 }}>
      <span style={{ color: '#ef4444' }}>🔴</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fca5a5' }}>Faol tekshiruv: Soliq inspeksiyasi 2024-yillik hisobotni tekshirmoqda</div>
        <div style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>Ish raqami: TK-2026-0089 · Inspektor: B. Toshmatov · Muddat: 05.04.2026</div>
      </div>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Tekshiruv tarixi</div>
      </div>
      {tekshiruvlar.map((t, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{t.title}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{t.detail}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#4b5563', marginBottom: 4 }}>{t.date}</div>
            <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(t.status)}>{t.st}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ShartnomalarPage = () => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Shartnomalar bo'limi</div>
    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Tez orada yangi funksiyalar qo'shiladi</div>
  </div>
);

const XabarlarPage = () => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Xabarlar</div>
      <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>3 yangi</span>
    </div>
    {xabarlar.map((x, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>{x.from}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{x.text}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#4b5563' }}>{x.time}</div>
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(x.type)}>Yangi</span>
        </div>
      </div>
    ))}
  </div>
);

// -------------------- MAIN --------------------
const PAGE_TITLES = {
  dashboard: 'Korxona Dashboard',
  hisobot: 'Yakuniy hisobot',
  obekt: "Ob'ekt Ro'yxatga Olish",
  arizalar: 'DAQNI arizalari',
  xodimlar: "Xodimlar Ro'yxati",
  shartnomalar: 'Shartnomalar',
  tekshiruv: 'Tekshiruv Holati',
  xabarlar: 'Xabarlar',
};

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const {user, logout} = useAuth();
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} />;
      case 'hisobot': return <HisobotPage />;
      case 'obekt': return <ObektPage />;
      case 'arizalar': return <ArizalarPage />;
      case 'xodimlar': return <XodimlarPage />;
      case 'shartnomalar': return <ShartnomalarPage />;
      case 'tekshiruv': return <TekshiruvPage />;
      case 'xabarlar': return <XabarlarPage />;
      default: return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080d17', color: '#e5e7eb', fontFamily: "'Geologica', system-ui, sans-serif" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} logout={logout} />
      <div style={{ marginLeft: 230, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ height: 56, background: 'rgba(10,15,26,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12, position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{PAGE_TITLES[activePage]}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Baraka Qurilish LLC · INN 307123456</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: 'rgba(217,119,6,0.15)', color: '#fbbf24' }}>⚠ 1 ta ogohlantirish</span>
            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>2025-Q1 hisoboti kutilmoqda</span>
            <span style={{ fontSize: 11, color: '#4b5563' }}>28.03.2026</span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: '28px 28px' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}