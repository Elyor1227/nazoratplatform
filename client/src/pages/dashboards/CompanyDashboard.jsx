
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================

import { useEffect, useState, useRef, useMemo } from 'react';
import api from '../../api.js';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import { downloadBlob } from '../../utils/downloadBlob.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  emptyRegistrationSummary,
  emptyWorkVolumeRows,
  SUMMARY_FIELD_META,
  WORK_VOLUME_ROWS,
  isRegistrationFormComplete,
  buildRegistrationPayload,
} from '../../data/objectRegistrationSchema.js';

/** Korxona dashboard inline-stillar uchun kun/tun palitrasi */
function companyPalette(isDark) {
  return {
    text: isDark ? '#e5e7eb' : '#1e293b',
    textStrong: isDark ? '#ffffff' : '#0f172a',
    muted: isDark ? '#6b7280' : '#64748b',
    muted2: isDark ? '#4b5563' : '#64748b',
    label: isDark ? '#9ca3af' : '#475569',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    divider: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    rowBorder: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
    iconBg: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    inputBg: isDark ? '#0a0f1a' : '#ffffff',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1',
    inputColor: isDark ? '#f8fafc' : '#0f172a',
    fileRow: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    fileRowBorder: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    stepLine: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    stepIdle: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    stepIdleBorder: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1',
    stepTextIdle: isDark ? '#9ca3af' : '#64748b',
    ghostBtn: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    modalPanel: isDark ? '#111827' : '#ffffff',
    surfaceMuted: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
    linkBlue: isDark ? '#93c5fd' : '#1d4ed8',
    stepTitleActive: isDark ? '#60a5fa' : '#2563eb',
  };
}

function useCompanyTheme() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return useMemo(() => companyPalette(isDark), [isDark]);
}

// -------------------- MOCK / STATIC DATA --------------------
const fayllar = [
  { icon: '📊', name: '2025-Q4 Ish haqi vedomosti.xlsx', meta: 'XLSX · 245 KB', date: '12.01.2026', status: 's-green', st: 'Qabul qilindi' },
  { icon: '📄', name: '2025-Q4 Shartnoma №4.pdf', meta: 'PDF · 1.2 MB', date: '12.01.2026', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📋', name: '2025-Q3 Hisobot to\'plami.pdf', meta: 'PDF · 3.4 MB', date: '10.10.2025', status: 's-green', st: 'Tasdiqlandi' },
  { icon: '📎', name: '2024-yillik yakuniy hisobot.pdf', meta: 'PDF · 5.1 MB', date: '15.01.2025', status: 's-blue', st: 'Arxivda' },
];

const xabarlar = [
  { from: 'Soliq inspeksiyasi', text: '2025-Q4 hisobotingiz tasdiqlandi.', time: 'Bugun 08:30', type: 's-green' },
  { from: 'DAQNI', text: 'Loyiha-smeta va hisobot ko‘rsatkichlari tekshiruvi rejalashtirildi.', time: 'Kecha 16:45', type: 's-yellow' },
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
  { id: 'x5', n: 'Xoliqov Nodir', lavozim: 'Usta', pinfl: '56789012345678', ihq: '2 200 000', sana: '2025-02-01', bandlik: 'yollanma', boshatilgan: '', holat: 's-green' },
  { id: 'x6', n: 'Qodirov Ulugbek', lavozim: 'Haydovchi', pinfl: '67890123456789', ihq: '3 800 000', sana: '2025-03-05', bandlik: 'doimiy', boshatilgan: '', holat: 's-green' },
];

const getStatusClass = (type) => {
  const classes = {
    's-green': 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 dark:text-emerald-400',
    's-yellow': 'bg-amber-500/10 text-amber-900 border border-amber-500/25 dark:text-amber-400',
    's-red': 'bg-red-500/10 text-red-800 border border-red-500/25 dark:text-red-400',
    's-blue': 'bg-blue-500/10 text-blue-800 border border-blue-500/25 dark:text-blue-400',
    's-gray': 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10',
  };
  return classes[type] || classes['s-gray'];
};

// -------------------- SIDEBAR --------------------
const NAV_ITEMS = [
  { id: 'dashboard', icon: '⊞', label: 'Bosh sahifa' },
  { id: 'obekt', icon: '🏗️', label: "Obyekt Ro'yxatga Olish" },
  { id: 'xodimlar', icon: '👷', label: "Xodimlar ro'yxati" },
  { id: 'hisobot', icon: '📋', label: 'Yakuniy hisobot' },
];

const Sidebar = ({ activePage, setActivePage, logout, isDark }) => {
  const b = {
    asideBg: isDark ? '#0a0f1a' : '#ffffff',
    border: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    title: isDark ? '#fff' : '#0f172a',
    muted: isDark ? '#4a5568' : '#64748b',
    cardBg: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    navIdle: isDark ? '#9ca3af' : '#475569',
    navActive: isDark ? '#60a5fa' : '#2563eb',
    navActiveBg: isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.1)',
  };
  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 230,
        background: b.asideBg,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        borderRight: `1px solid ${b.border}`,
        boxShadow: isDark ? 'none' : '2px 0 12px rgba(15,23,42,0.06)',
      }}
    >
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${b.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, color: b.title, letterSpacing: 0.3 }}>Korxona Kabineti</div>
            <div style={{ fontSize: 10, color: b.muted }}>Qurilish Nazorat Tizimi</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', background: b.cardBg, borderRadius: 8, border: `1px solid ${b.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: b.title }}>Baraka Qurilish LLC</div>
          <div style={{ fontSize: 10, color: b.muted, fontFamily: 'monospace' }}>INN: 307 123 456</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ fontSize: 10, color: '#059669' }}>Faol korxona</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 8px 4px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: b.muted, padding: '0 8px', marginBottom: 6 }}>Asosiy</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 2,
              background: activePage === item.id ? b.navActiveBg : 'transparent',
              color: activePage === item.id ? b.navActive : b.navIdle,
              fontSize: 13,
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ width: 18, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 8px', borderTop: `1px solid ${b.border}` }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: `1px solid ${b.border}`,
            borderRadius: 8,
            color: b.navIdle,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Chiqish
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: b.cardBg, borderRadius: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDark ? 'rgba(37,99,235,0.3)' : 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: b.navActive }}>AK</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: b.title }}>A. Karimov</div>
            <div style={{ fontSize: 10, color: b.muted }}>Bosh buxgalter</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// -------------------- STAT CARD --------------------
const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const c = useCompanyTheme();
  const accent = { blue: '#2563eb', green: '#059669', amber: '#d97706' }[color];
  return (
    <div
      style={{
        background: c.cardBg,
        border: `1px solid ${c.cardBorder}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 16,
        padding: '16px 18px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'absolute', right: 14, top: 14, fontSize: 24, opacity: 0.12 }}>{icon}</span>
      <div style={{ fontSize: 11, color: c.muted, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: c.textStrong }}>{value}</div>
      <div style={{ fontSize: 11, color: c.muted2, marginTop: 4 }}>{sub}</div>
    </div>
  );
};

// -------------------- DASHBOARD PAGE --------------------
const DashboardPage = ({ setActivePage }) => {
  const c = useCompanyTheme();
  return (
    <div>
      <div
        style={{
          background: 'rgba(217,119,6,0.08)',
          border: '1px solid rgba(217,119,6,0.2)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <span style={{ color: '#f59e0b', fontSize: 16 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#b45309' }} className="dark:text-amber-300">
            2025-yil I chorak hisobotini topshirish muddati: 10 aprel 2026
          </div>
          <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }} className="dark:text-amber-500">
            Ish haqi fondi, xodimlar soni va aylanma ma'lumotlarini yuklang
          </div>
        </div>
        <button
          onClick={() => setActivePage('hisobot')}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid rgba(217,119,6,0.4)',
            background: 'transparent',
            color: '#b45309',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          className="dark:text-amber-300"
        >
          Yuklash →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="👷" label="Rasmiy xodimlar soni" value="47" sub="So'nggi hisobot: 15.01.2026" color="blue" />
        <StatCard icon="💰" label="Oylik ish haqi fondi" value="141 mln so'm" sub="O'rtacha: 3,0 mln so'm/kishi" color="green" />
        <StatCard icon="📊" label="Yillik aylanma (2025)" value="1,2 mlrd so'm" sub="QQSsiz, 4 ta shartnoma" color="amber" />
        <StatCard icon="✅" label="Topshirilgan hisobotlar" value="8/9" sub="1 ta kutilmoqda" color="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.divider}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong }}>Hisobot holati</div>
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
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: item.done ? '#10b981' : 'transparent',
                      border: item.done ? '2px solid #10b981' : '2px solid #d97706',
                      flexShrink: 0,
                    }}
                  />
                  {idx < 3 && <div style={{ width: 1, height: 28, background: c.stepLine, marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{item.title}</div>
                  <span
                    style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }}
                    className={getStatusClass(item.statusClass)}
                  >
                    {item.status}
                  </span>
                  <div style={{ fontSize: 11, color: c.muted2, marginTop: 4 }}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16 }}>
          <div
            style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${c.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong }}>Inspektordan xabarlar</div>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 500,
                background: 'rgba(37,99,235,0.12)',
                color: '#1d4ed8',
              }}
              className="dark:bg-blue-500/15 dark:text-blue-300"
            >
              3 yangi
            </span>
          </div>
          <div>
            {xabarlar.map((x, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom: `1px solid ${c.rowBorder}`,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: c.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  💬
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{x.from}</div>
                  <div style={{ fontSize: 11, color: c.muted }}>{x.text}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: c.muted2 }}>{x.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16 }}>
        <div
          style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${c.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong }}>So'nggi yuklangan fayllar</div>
          <button
            onClick={() => setActivePage('hisobot')}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              border: `1px solid ${c.stepIdleBorder}`,
              background: 'transparent',
              color: c.stepTextIdle,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            + Yangi
          </button>
        </div>
        {fayllar.map((f, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: `1px solid ${c.rowBorder}`,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: c.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {f.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{f.name}</div>
              <div style={{ fontSize: 11, color: c.muted }}>{f.meta}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: c.muted2 }}>{f.date}</div>
              <span
                style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 500 }}
                className={getStatusClass(f.status)}
              >
                {f.st}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------- YAKUNIY HISOBOT (API + ilova fayllar: invoices) --------------------
const emptyYakuniyForm = () => ({
  startDate: '',
  endDate: '',
  periodYear: String(new Date().getFullYear()),
  periodMonth: String(new Date().getMonth() + 1),
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
  const c = useCompanyTheme();
  const [reports, setReports] = useState([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyYakuniyForm);
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const [fileHint, setFileHint] = useState('');

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
    const periodYear = Number(form.periodYear);
    const periodMonth = Number(form.periodMonth);
    if (!Number.isFinite(periodYear) || periodYear < 2000 || periodYear > 2100) {
      setMsg('Hisobot yilini to‘g‘ri kiriting');
      setMsgType('error');
      return;
    }
    if (!Number.isFinite(periodMonth) || periodMonth < 1 || periodMonth > 12) {
      setMsg('Hisobot oyi 1–12 orasida bo‘lishi kerak');
      setMsgType('error');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('periodYear', String(periodYear));
      fd.append('periodMonth', String(periodMonth));
      fd.append('employeeCount', String(form.employeeCount || 0));
      fd.append('payrollFund', String(form.payrollFund || 0));
      fd.append('contractAmount', String(form.projectTotal || 0));
      fd.append('constructionType', form.objectName?.trim() || 'Yakuniy hisobot');
      fd.append('notes', buildNotesPayload());
      invoiceFiles.forEach((file) => {
        fd.append('invoices', file);
      });
      await api.post('/reports', fd);
      setMsg('Yakuniy hisobot saqlandi.');
      setMsgType('success');
      setStep(3);
      setInvoiceFiles([]);
      setFileHint('');
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

  async function downloadInvoiceFile(reportId, inv) {
    try {
      await downloadBlob(api, `/reports/${reportId}/files/${encodeURIComponent(inv.storedName)}`, inv.fileName || 'fayl');
    } catch {
      setMsg('Fayl yuklab olinmadi');
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
                background: s.n < step ? '#10b981' : s.n === step ? '#2563eb' : c.stepIdle,
                border:
                  s.n < step ? '2px solid #10b981' : s.n === step ? '2px solid #2563eb' : `2px solid ${c.stepIdleBorder}`,
                color: s.n <= step ? '#fff' : c.stepTextIdle,
              }}
            >
              {s.n < step ? '✓' : s.n}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: s.n === step ? c.stepTitleActive : s.n < step ? '#059669' : c.stepTextIdle,
              }}
            >
              {s.label}
            </span>
          </div>
          {idx < 2 && (
            <div
              style={{
                flex: 1,
                height: 1,
                background: s.n < step ? '#10b981' : c.stepLine,
                margin: '0 12px',
                minWidth: 24,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1px solid ${c.inputBorder}`,
    background: c.inputBg,
    color: c.inputColor,
    fontSize: 13,
    boxSizing: 'border-box',
    outline: 'none',
  };
  const labelStyle = { fontSize: 11, color: c.label, display: 'block', marginBottom: 6, fontWeight: 500 };
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: 24 };

  const resetForm = () => {
    setForm(emptyYakuniyForm());
    setInvoiceFiles([]);
    setFileHint('');
    setStep(1);
    setMsg('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <section style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: c.textStrong, marginBottom: 4 }}>Yakuniy hisobot</h2>
        <p style={{ fontSize: 12, color: c.muted, marginBottom: 24 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Hisobot davri — yil</label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  style={inputStyle}
                  value={form.periodYear}
                  onChange={(e) => setForm({ ...form, periodYear: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>Hisobot davri — oy</label>
                <select
                  style={inputStyle}
                  value={form.periodMonth}
                  onChange={(e) => setForm({ ...form, periodMonth: e.target.value })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}-oy
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p style={{ fontSize: 11, color: c.muted, margin: '-8px 0 16px' }}>
              Hisobot qaysi yil va oy uchun ekanini mustaqil tanlashingiz mumkin; bir xil davr uchun bir nechta yuborish mumkin.
            </p>
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
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Izoh (ixtiyoriy)</label>
              <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Ilova fayllar (PDF, Excel, rasm, ZIP — 15 tagacha, har biri max. 10 MB)</label>
              <p style={{ fontSize: 11, color: c.muted2, margin: '0 0 8px' }}>Hisob-faktura, dalolatnoma yoki boshqa hujjatlarni biriktiring.</p>
              <input
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.doc,.docx,.zip,.jpg,.jpeg,.png,.webp"
                style={{ width: '100%', fontSize: 12, color: c.muted }}
                onChange={(e) => {
                  const add = Array.from(e.target.files || []);
                  const MAX = 10 * 1024 * 1024;
                  const ok = add.filter((f) => f.size <= MAX);
                  setFileHint(ok.length < add.length ? "10 MB dan katta fayllar qo'shilmadi." : '');
                  setInvoiceFiles((prev) => [...prev, ...ok].slice(0, 15));
                  e.target.value = '';
                }}
              />
              {fileHint && <p style={{ fontSize: 11, color: '#f87171', margin: '8px 0 0' }}>{fileHint}</p>}
              {invoiceFiles.length > 0 && (
                <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                  {invoiceFiles.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '8px 12px',
                        marginBottom: 6,
                        background: c.fileRow,
                        borderRadius: 8,
                        fontSize: 12,
                        border: `1px solid ${c.fileRowBorder}`,
                      }}
                    >
                      <span style={{ color: c.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setInvoiceFiles((p) => p.filter((_, j) => j !== i))}
                        style={{ flexShrink: 0, border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                        aria-label="Olib tashlash"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
            <div
              style={{
                background: c.cardBg,
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                border: `1px solid ${c.divider}`,
              }}
            >
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
                ['Ilova fayllar', invoiceFiles.length ? `${invoiceFiles.length} ta` : '—'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom: `1px solid ${c.rowBorder}`,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: c.muted }}>{k}</span>
                  <span style={{ color: c.text, fontWeight: 500, textAlign: 'right', maxWidth: '58%' }}>{v}</span>
                </div>
              ))}
            </div>
            {invoiceFiles.length > 0 && (
              <div style={{ marginBottom: 14, fontSize: 11, color: c.muted }}>
                <strong style={{ color: c.textStrong }}>Fayllar:</strong>{' '}
                {invoiceFiles.map((f) => f.name).join(', ')}
              </div>
            )}
            <div
              style={{
                background: 'rgba(217,119,6,0.08)',
                border: '1px solid rgba(217,119,6,0.2)',
                borderRadius: 10,
                padding: 12,
                marginBottom: 20,
                fontSize: 11,
                color: '#b45309',
              }}
              className="dark:text-amber-300"
            >
              ⚠ Yuborilgan ma&apos;lumotlar tekshiriladi. Noto&apos;g&apos;ri ma&apos;lumot uchun javobgarlik qonunchilikka muvofiq.
            </div>
            {msg && (
              <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msgType === 'success' ? '#10b981' : '#ef4444' }}>{msg}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: `1px solid ${c.inputBorder}`,
                  background: 'transparent',
                  color: c.stepTextIdle,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ← Orqaga
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Tasdiqlash va yuborish ✓
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c.textStrong, marginBottom: 8 }}>Yakuniy hisobot yuborildi!</div>
            <div style={{ fontSize: 13, color: c.muted, marginBottom: 24 }}>Ma&apos;lumotlar saqlandi</div>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '9px 24px',
                borderRadius: 8,
                border: `1px solid ${c.stepIdleBorder}`,
                background: 'transparent',
                color: c.stepTextIdle,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Yangi yakuniy hisobot →
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: c.textStrong, marginBottom: 16 }}>Yuborilgan hisobotlar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map((r) => (
            <div
              key={r._id}
              style={{
                background: c.cardBg,
                border: `1px solid ${c.cardBorder}`,
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 13,
                color: c.text,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: c.textStrong, fontWeight: 600 }}>
                  {r.periodMonth}/{r.periodYear} · {r.constructionType || 'Hisobot'}
                </span>
                <button
                  type="button"
                  onClick={() => downloadPdf(r._id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: c.ghostBtn,
                    color: c.textStrong,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  PDF
                </button>
              </div>
              <p style={{ color: c.muted, fontSize: 12, margin: 0 }}>Xodimlar: {r.employeeCount}, loyiha: {r.contractAmount?.toLocaleString()} so'm</p>
              {r.invoices?.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.invoices.map((inv) => (
                    <button
                      key={inv.storedName || inv.fileName}
                      type="button"
                      onClick={() => downloadInvoiceFile(r._id, inv)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(37,99,235,0.35)',
                        background: 'rgba(37,99,235,0.12)',
                        color: c.linkBlue,
                        fontSize: 11,
                        cursor: 'pointer',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={inv.fileName}
                    >
                      📎 {inv.fileName}
                    </button>
                  ))}
                </div>
              )}
              {r.notes && (
                <p style={{ color: c.muted2, fontSize: 11, marginTop: 8, whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>{r.notes.slice(0, 200)}{r.notes.length > 200 ? '…' : ''}</p>
              )}
            </div>
          ))}
          {reports.length === 0 && <p style={{ color: c.muted2, fontSize: 13 }}>Hali hisobot yo'q.</p>}
        </div>
      </section>
    </div>
  );
};

// -------------------- OB'EKT / DAQNI ARIZASI (bitta oqim) --------------------
const companyAppStatus = (s) => {
  if (s === 'approved') return { text: 'Ma’qullangan', cls: 's-green' };
  if (s === 'rejected') return { text: 'Rad etilgan', cls: 's-red' };
  return { text: 'Kutilmoqda', cls: 's-yellow' };
};

const MAX_STEP_FILES = 25;
function mergeUploadedFiles(existing, fileList) {
  const merged = [...(existing || []), ...Array.from(fileList || [])];
  const seen = new Set();
  const out = [];
  for (const f of merged) {
    const key = `${f.name}-${f.size}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out.slice(0, MAX_STEP_FILES);
}

const ObektPage = () => {
  const c = useCompanyTheme();
  const [applications, setApplications] = useState([]);
  const [objectName, setObjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [stepStatus, setStepStatus] = useState({ 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle' });
  const [stepFiles, setStepFiles] = useState({ 2: [], 3: [], 4: [], 5: [] });
  const [submittedObjectName, setSubmittedObjectName] = useState('');
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [uploadingStep, setUploadingStep] = useState(false);
  const [registrationSummary, setRegistrationSummary] = useState(emptyRegistrationSummary);
  const [registrationEmployeeCount, setRegistrationEmployeeCount] = useState('');
  const [workVolumeRows, setWorkVolumeRows] = useState(() => emptyWorkVolumeRows());

  const step1FormReady =
    Boolean(objectName.trim()) &&
    isRegistrationFormComplete({
      registrationSummary,
      registrationEmployeeCount,
      workVolumeRows,
    });

  const subtotalNoVat = useMemo(() => {
    const s = registrationSummary;
    const keys = ['materials', 'equipment', 'machinery', 'wages'];
    let sum = 0;
    for (const k of keys) {
      const n = Number(s[k]);
      if (!Number.isFinite(n) || n < 0) return null;
      sum += n;
    }
    return sum;
  }, [registrationSummary]);

  const grandConstructionTotal = useMemo(() => {
    const o = Number(registrationSummary.otherExpenses);
    const v = Number(registrationSummary.vat);
    if (subtotalNoVat == null || !Number.isFinite(o) || o < 0 || !Number.isFinite(v) || v < 0) return null;
    return subtotalNoVat + o + v;
  }, [registrationSummary, subtotalNoVat]);

  const load = async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data.applications || []);
    } catch {
      setMsg('Ma’lumotlar yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const steps = [
    { n: 1, icon: '📋', title: 'Ariza yuborish', desc: "Ob'ektni ro'yxatdan o'tkazish uchun ariza yuboring" },
    { n: 2, icon: '📐', title: 'Loyiha-smeta hujjatlari', desc: "Loyiha-smeta hujjatlarini PDF shaklida yuklang" },
    { n: 3, icon: '📊', title: 'Excel jadvallari', desc: "3 ta Excel jadvalni to'ldirib yuklang" },
    { n: 4, icon: '🔄', title: "O'zgarishlar bo'lganda qayta yuklash", desc: "O'zgarish bo'lsa hujjatlarni qayta yuklang" },
    { n: 5, icon: '🏁', title: 'Yakunlash dalolanoması', desc: "Ob'ektni foydalanishga topshirish dalolanomasini yuklang" },
  ];

  const isLocked = (stepNum) => stepNum !== 1 && !applicationSent;

  const handleSendApplication = async () => {
    if (!objectName.trim()) {
      setMsg('Iltimos, ob\'ekt nomi / manzilni to\'ldiring');
      return;
    }
    if (
      !isRegistrationFormComplete({
        registrationSummary,
        registrationEmployeeCount,
        workVolumeRows,
      })
    ) {
      setMsg(
        "Barcha majburiy maydonlarni to‘ldiring: xulosa jadvali (so‘mdagi qiymatlar), ishchilar soni, ishlar hajmi jadvalidagi o‘lchov birligi, ish hajmi va birlik narxi."
      );
      return;
    }
    setMsg('');
    setSending(true);
    try {
      const regPayload = buildRegistrationPayload(registrationSummary, registrationEmployeeCount, workVolumeRows);
      const res = await api.post('/applications', {
        objectName: objectName.trim(),
        notes: notes.trim(),
        ...regPayload,
      });
      const created = res.data?.application ?? res.data;
      const newId = created?._id ?? created?.id;
      setCurrentApplicationId(newId != null ? String(newId) : null);
      setSubmittedObjectName(objectName.trim());
      setStepStatus((s) => ({ ...s, 1: 'done' }));
      setApplicationSent(true);
      setActiveStep(2);
      setObjectName('');
      setNotes('');
      setRegistrationSummary(emptyRegistrationSummary());
      setRegistrationEmployeeCount('');
      setWorkVolumeRows(emptyWorkVolumeRows());
      await load();
      if (!newId) {
        const { data: d2 } = await api.get('/applications');
        const first = (d2.applications || [])[0];
        const fallback = first?._id ?? first?.id;
        if (fallback != null) setCurrentApplicationId(String(fallback));
      }
    } catch (err) {
      setMsg(err.response?.data?.error || 'Yuborilmadi');
    } finally {
      setSending(false);
    }
  };

  const handleUpload = async (stepNum) => {
    if (!stepFiles[stepNum] || stepFiles[stepNum].length === 0) {
      setMsg('Iltimos, hujjat(lar) yuklang');
      return;
    }
    if (!currentApplicationId) {
      setMsg('Ariza ID topilmadi — sahifani yangilab, qaytadan ariza yuboring.');
      return;
    }
    setMsg('');
    setUploadingStep(true);
    try {
      const fd = new FormData();
      fd.append('step', String(stepNum));
      for (const f of stepFiles[stepNum]) {
        fd.append('files', f);
      }
      const q = encodeURIComponent(String(stepNum));
      await api.post(`/applications/${currentApplicationId}/attachments?step=${q}`, fd);
      setStepStatus((s) => ({ ...s, [stepNum]: 'done' }));
      if (stepNum < 5) setActiveStep(stepNum + 1);
      else setMsg("Barcha bosqichlar muvaffaqiyatli yakunlandi!");
    } catch (err) {
      setMsg(err.response?.data?.error || 'Fayllar yuklanmadi');
    } finally {
      setUploadingStep(false);
    }
  };

  const approved = applications.filter((a) => a.status === 'approved');
  const inProgress = applications.filter((a) => a.status !== 'approved');

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${c.inputBorder}`,
    background: c.inputBg,
    color: c.inputColor,
    fontSize: 13,
    outline: 'none',
  };
  const labelStyle = { display: 'block', fontSize: 11, color: c.label, marginBottom: 6 };

  return (
    <div>
      <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#0e7490' }} className="dark:text-cyan-300">
          Obyekt Ro'yxatga Olish
        </div>
        <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>
          Bitta ariza orqali yuboring. DAQNI ko‘rib chiqadi, xodimga bog‘laydi va tasdiqlaydi. Tasdiqlangan obyektlar pastda ro‘yxatda ko‘rinadi.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map((s, idx) => {
            const locked = isLocked(s.n);
            const done = stepStatus[s.n] === 'done';
            const active = activeStep === s.n && !locked;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => !locked && setActiveStep(s.n)}
                disabled={locked}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: active ? '1px solid rgba(37,99,235,0.4)' : `1px solid ${c.divider}`,
                  background: active ? 'rgba(37,99,235,0.1)' : done ? 'rgba(16,185,129,0.08)' : c.surfaceMuted,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  opacity: locked ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: done ? '#10b981' : active ? '#2563eb' : c.stepIdle,
                      fontSize: done ? 14 : 16,
                      flexShrink: 0,
                      color: done ? '#022c22' : c.text,
                      fontWeight: 800,
                    }}
                  >
                    {done ? '✓' : s.icon}
                  </div>
                  {idx < 4 && <div style={{ width: 1, height: 16, background: c.divider, marginTop: 4 }} />}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: done ? '#10b981' : active ? c.stepTitleActive : c.stepTextIdle,
                      marginBottom: 3,
                    }}
                  >
                    {s.n}. {s.title}
                  </div>
                  <div style={{ fontSize: 10, color: c.muted2, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: 28 }}>
          {activeStep === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  📋
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textStrong, margin: 0 }}>Ariza yuborish</h3>
                  <p style={{ fontSize: 12, color: c.muted, margin: 0, marginTop: 2 }}>Ariza yuborilgach 2–5-bosqichlar ochiladi</p>
                </div>
              </div>

              {stepStatus[1] === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>Ariza yuborildi</div>
                  <div style={{ fontSize: 13, color: c.muted, marginBottom: 18 }}>
                    Obyekt: <strong style={{ color: c.textStrong }}>{submittedObjectName}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    2-bosqichga o'tish →
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Obyekt nomi / manzili *</label>
                      <input
                        type="text"
                        style={inputStyle}
                        value={objectName}
                        onChange={(e) => setObjectName(e.target.value)}
                        placeholder="Masalan: 42-maktab yangi binosi"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong, marginBottom: 10 }}>Xulosa jadval (narxlar — joriy narxlarda, so‘mda)</div>
                    <div style={{ overflowX: 'auto', border: `1px solid ${c.divider}`, borderRadius: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: c.surfaceMuted, borderBottom: `1px solid ${c.divider}` }}>
                            <th style={{ textAlign: 'left', padding: '8px 10px', color: c.muted, width: 36 }}>№</th>
                            <th style={{ textAlign: 'left', padding: '8px 10px', color: c.muted }}>Harajatlar nomi</th>
                            <th style={{ textAlign: 'right', padding: '8px 10px', color: c.muted, minWidth: 140 }}>So‘mda</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SUMMARY_FIELD_META.slice(0, 4).map((row, idx) => (
                            <tr key={row.key} style={{ borderBottom: `1px solid ${c.rowBorder}` }}>
                              <td style={{ padding: '8px 10px', color: c.muted }}>{idx + 1}</td>
                              <td style={{ padding: '8px 10px', color: c.text }}>{row.label}</td>
                              <td style={{ padding: '8px 10px' }}>
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  style={{ ...inputStyle, maxWidth: '100%' }}
                                  value={registrationSummary[row.key]}
                                  onChange={(e) => setRegistrationSummary((p) => ({ ...p, [row.key]: e.target.value }))}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr style={{ borderBottom: `1px solid ${c.divider}`, background: c.surfaceMuted }}>
                            <td colSpan={2} style={{ padding: '8px 10px', fontWeight: 600, color: c.textStrong }}>
                              Jami (QQSsiz, 1–4-qatorlar yig‘indisi)
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: c.textStrong }}>
                              {subtotalNoVat != null ? subtotalNoVat.toLocaleString('uz-UZ') : '—'}
                            </td>
                          </tr>
                          {SUMMARY_FIELD_META.slice(4).map((row, idx) => (
                            <tr key={row.key} style={{ borderBottom: `1px solid ${c.rowBorder}` }}>
                              <td style={{ padding: '8px 10px', color: c.muted }}>{idx + 5}</td>
                              <td style={{ padding: '8px 10px', color: c.text }}>{row.label}</td>
                              <td style={{ padding: '8px 10px' }}>
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  style={{ ...inputStyle, maxWidth: '100%' }}
                                  value={registrationSummary[row.key]}
                                  onChange={(e) => setRegistrationSummary((p) => ({ ...p, [row.key]: e.target.value }))}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: c.surfaceMuted }}>
                            <td colSpan={2} style={{ padding: '8px 10px', fontWeight: 700, color: c.textStrong }}>
                              Jami qurilish-montaj ishlar qiymati
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: c.textStrong }}>
                              {grandConstructionTotal != null ? grandConstructionTotal.toLocaleString('uz-UZ') : '—'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Ishchi-xodimlar soni (nafar) *</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      style={{ ...inputStyle, maxWidth: 200 }}
                      value={registrationEmployeeCount}
                      onChange={(e) => setRegistrationEmployeeCount(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong, marginBottom: 10 }}>Ishlar hajmlari ro‘yxati</div>
                    <div style={{ overflowX: 'auto', border: `1px solid ${c.divider}`, borderRadius: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                        <thead>
                          <tr style={{ background: c.surfaceMuted, borderBottom: `1px solid ${c.divider}` }}>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'left' }}>№</th>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'left', minWidth: 160 }}>Komponent</th>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'left' }}>O‘lchov</th>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'right' }}>Ish hajmi</th>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'right' }}>Birlik narxi</th>
                            <th style={{ padding: '6px 8px', color: c.muted, textAlign: 'right' }}>Summa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workVolumeRows.map((row, i) => {
                            const vol = Number(row.volume);
                            const pr = Number(row.pricePerUnit);
                            const lineSum =
                              Number.isFinite(vol) && Number.isFinite(pr) && vol >= 0 && pr >= 0 ? vol * pr : null;
                            return (
                              <tr key={row.key} style={{ borderBottom: `1px solid ${c.rowBorder}` }}>
                                <td style={{ padding: '6px 8px', color: c.muted, verticalAlign: 'middle' }}>{i + 1}</td>
                                <td style={{ padding: '6px 8px', color: c.text, verticalAlign: 'middle' }}>{WORK_VOLUME_ROWS[i]?.labelUz}</td>
                                <td style={{ padding: '6px 8px' }}>
                                  <input
                                    type="text"
                                    style={{ ...inputStyle, minWidth: 72, fontSize: 11 }}
                                    value={row.unit}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setWorkVolumeRows((prev) => prev.map((r, j) => (j === i ? { ...r, unit: v } : r)));
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                  <input
                                    type="number"
                                    min={0}
                                    step="any"
                                    style={{ ...inputStyle, minWidth: 88, fontSize: 11 }}
                                    value={row.volume}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setWorkVolumeRows((prev) => prev.map((r, j) => (j === i ? { ...r, volume: v } : r)));
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                  <input
                                    type="number"
                                    min={0}
                                    step="any"
                                    style={{ ...inputStyle, minWidth: 88, fontSize: 11 }}
                                    value={row.pricePerUnit}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setWorkVolumeRows((prev) => prev.map((r, j) => (j === i ? { ...r, pricePerUnit: v } : r)));
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', color: c.text, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                  {lineSum != null ? lineSum.toLocaleString('uz-UZ', { maximumFractionDigits: 2 }) : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>Izoh (ixtiyoriy)</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Qisqa izoh"
                    />
                  </div>

                  {msg && <div style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>{msg}</div>}
                  {!step1FormReady && (
                    <p style={{ fontSize: 11, color: c.muted, margin: '0 0 12px' }}>
                      Arizani yuborish uchun yuqoridagi barcha majburiy maydonlar (xulosa, xodimlar soni, ishlar hajmi jadvali) to‘liq va to‘g‘ri to‘ldirilishi kerak.
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={sending || !step1FormReady}
                    onClick={handleSendApplication}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: 8,
                      border: 'none',
                      background: sending || !step1FormReady ? 'rgba(37,99,235,0.35)' : '#2563eb',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: sending || !step1FormReady ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? 'Yuborilmoqda…' : 'Arizani yuborish 📤'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeStep === 2 && !isLocked(2) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  📐
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textStrong, margin: 0 }}>Loyiha-smeta hujjatlari</h3>
                  <p style={{ fontSize: 12, color: c.muted, margin: 0, marginTop: 2 }}>PDF fayllarni yuklang</p>
                </div>
              </div>

              {stepStatus[2] === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>Hujjatlar yuklandi</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 6, marginBottom: 20 }}>{stepFiles[2].length} ta fayl</div>
                  <button type="button" onClick={() => setActiveStep(3)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    3-bosqichga o'tish →
                  </button>
                </div>
              ) : (
                <div>
                  <label
                    style={{
                      display: 'block',
                      border: `2px dashed ${c.inputBorder}`,
                      borderRadius: 10,
                      padding: '28px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: 14,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => {
                        const add = Array.from(e.target.files || []);
                        e.target.value = '';
                        setStepFiles((s) => ({ ...s, 2: mergeUploadedFiles(s[2], add) }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: 13, color: c.label }}>PDF fayllarni tanlang (bir nechta marta qo‘shishingiz mumkin)</div>
                  </label>

                  {stepFiles[2].length > 0 && stepFiles[2].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c.fileRow, borderRadius: 8, marginBottom: 6, fontSize: 12, color: c.text, border: `1px solid ${c.fileRowBorder}` }}>
                      📄 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                    </div>
                  ))}

                  {msg && <div style={{ fontSize: 12, color: '#f87171', marginBottom: 14, marginTop: 10 }}>{msg}</div>}
                  <button
                    type="button"
                    disabled={uploadingStep}
                    onClick={() => handleUpload(2)}
                    style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: uploadingStep ? 'rgba(37,99,235,0.5)' : '#2563eb', color: '#fff', fontWeight: 800, fontSize: 14, cursor: uploadingStep ? 'wait' : 'pointer', marginTop: 8 }}
                  >
                    {uploadingStep ? 'Yuklanmoqda…' : 'Yuklash va davom etish →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeStep === 3 && !isLocked(3) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  📊
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textStrong, margin: 0 }}>Excel jadvallari</h3>
                  <p style={{ fontSize: 12, color: c.muted, margin: 0, marginTop: 2 }}>XLSX/XLS fayllarni yuklang</p>
                </div>
              </div>

              {stepStatus[3] === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>Jadvallar yuklandi</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 6, marginBottom: 20 }}>{stepFiles[3].length} ta fayl</div>
                  <button type="button" onClick={() => setActiveStep(4)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    4-bosqichga o'tish →
                  </button>
                </div>
              ) : (
                <div>
                  <label
                    style={{
                      display: 'block',
                      border: `2px dashed ${c.inputBorder}`,
                      borderRadius: 10,
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: 14,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        const add = Array.from(e.target.files || []);
                        e.target.value = '';
                        setStepFiles((s) => ({ ...s, 3: mergeUploadedFiles(s[3], add) }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
                    <div style={{ fontSize: 13, color: c.label }}>Excel fayllarni yuklang (bir nechta bosqichda qo‘shing)</div>
                  </label>

                  {stepFiles[3].length > 0 && stepFiles[3].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c.fileRow, borderRadius: 8, marginBottom: 6, fontSize: 12, color: c.text, border: `1px solid ${c.fileRowBorder}` }}>
                      📊 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                    </div>
                  ))}

                  {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, marginTop: 10, fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{msg}</div>}
                  <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 11, color: '#fbbf24' }}>
                    ⚠ Kamida 1 ta Excel fayl yuklang (3 ta talab qilinadi)
                  </div>
                  <button
                    type="button"
                    disabled={uploadingStep}
                    onClick={() => handleUpload(3)}
                    style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: uploadingStep ? 'rgba(37,99,235,0.5)' : '#2563eb', color: '#fff', fontWeight: 800, fontSize: 14, cursor: uploadingStep ? 'wait' : 'pointer' }}
                  >
                    {uploadingStep ? 'Yuklanmoqda…' : 'Yuklash va davom etish →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeStep === 4 && !isLocked(4) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(217,119,6,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  🔄
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textStrong, margin: 0 }}>O'zgarishlar bo'lganda qayta yuklash</h3>
                  <p style={{ fontSize: 12, color: c.muted, margin: 0, marginTop: 2 }}>Agar o'zgarish bo'lmasa, o‘tkazib yuboring</p>
                </div>
              </div>

              {stepStatus[4] === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>Yangilangan hujjatlar yuklandi</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 6, marginBottom: 20 }}>{stepFiles[4].length} ta fayl</div>
                  <button type="button" onClick={() => setActiveStep(5)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    5-bosqichga o'tish →
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12, color: '#fbbf24' }}>
                    ℹ️ Bu bosqich ixtiyoriy. O'zgarish bo'lmasa, to'g'ridan-to'g'ri 5-bosqichga o'ting.
                  </div>
                  <label
                    style={{
                      display: 'block',
                      border: `2px dashed ${c.inputBorder}`,
                      borderRadius: 10,
                      padding: '28px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: 14,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const add = Array.from(e.target.files || []);
                        e.target.value = '';
                        setStepFiles((s) => ({ ...s, 4: mergeUploadedFiles(s[4], add) }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: 13, color: c.label }}>Yangilangan hujjatlarni yuklang</div>
                  </label>

                  {stepFiles[4].length > 0 && stepFiles[4].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c.fileRow, borderRadius: 8, marginBottom: 6, fontSize: 12, color: c.text, border: `1px solid ${c.fileRowBorder}` }}>
                      📎 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setStepStatus((s) => ({ ...s, 4: 'done' }));
                        setActiveStep(5);
                      }}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 8,
                        border: `1px solid ${c.inputBorder}`,
                        background: 'transparent',
                        color: c.stepTextIdle,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      O'tkazib yuborish →
                    </button>
                    <button
                      type="button"
                      disabled={uploadingStep}
                      onClick={() => handleUpload(4)}
                      style={{ flex: 2, padding: '11px', borderRadius: 8, border: 'none', background: uploadingStep ? 'rgba(217,119,6,0.5)' : '#d97706', color: '#fff', fontWeight: 900, fontSize: 13, cursor: uploadingStep ? 'wait' : 'pointer' }}
                    >
                      {uploadingStep ? 'Yuklanmoqda…' : 'Yuklash →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeStep === 5 && !isLocked(5) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  🏁
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textStrong, margin: 0 }}>Yakunlash dalolanoması</h3>
                  <p style={{ fontSize: 12, color: c.muted, margin: 0, marginTop: 2 }}>Dalolatnomani PDF shaklda yuklang</p>
                </div>
              </div>

              {stepStatus[5] === 'done' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 54, marginBottom: 10 }}>🎉</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981', marginBottom: 8 }}>Jarayon yakunlandi</div>
                  <div style={{ fontSize: 13, color: c.muted, marginBottom: 18 }}>
                    DAQNI arizani ko'rib chiqadi. Tasdiqlangan obyektlar pastdagi ro‘yxatda paydo bo'ladi.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setApplicationSent(false);
                      setActiveStep(1);
                      setStepStatus({ 1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle' });
                      setStepFiles({ 2: [], 3: [], 4: [], 5: [] });
                      setSubmittedObjectName('');
                      setCurrentApplicationId(null);
                      setMsg('');
                    }}
                    style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                  >
                    Yangi ariza
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 12, color: '#34d399' }}>
                    📌 Dalolatnoma: qabul topshirish dalolatnomasi va texnik hisobot (misol)
                  </div>
                  <label
                    style={{
                      display: 'block',
                      border: '2px dashed rgba(16,185,129,0.2)',
                      borderRadius: 10,
                      padding: '28px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: 14,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => {
                        const add = Array.from(e.target.files || []);
                        e.target.value = '';
                        setStepFiles((s) => ({ ...s, 5: mergeUploadedFiles(s[5], add) }));
                      }}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: 13, color: c.label }}>Dalolatnomani PDF shaklda yuklang</div>
                  </label>

                  {stepFiles[5].length > 0 && stepFiles[5].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c.fileRow, borderRadius: 8, marginBottom: 6, fontSize: 12, color: c.text, border: `1px solid ${c.fileRowBorder}` }}>
                      📄 {f.name} <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 10 }}>✓</span>
                    </div>
                  ))}

                  {msg && <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{msg}</div>}
                  <button
                    type="button"
                    disabled={uploadingStep}
                    onClick={() => handleUpload(5)}
                    style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: uploadingStep ? 'rgba(5,150,105,0.5)' : '#059669', color: '#fff', fontWeight: 900, fontSize: 14, cursor: uploadingStep ? 'wait' : 'pointer', marginTop: 8 }}
                  >
                    {uploadingStep ? 'Yuklanmoqda…' : 'Yuklash va yakunlash 🏁'}
                  </button>
                </div>
              )}
            </div>
          )}

          {isLocked(activeStep) && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.muted, marginBottom: 8 }}>Bu bosqich hali ochilmagan</div>
              <div style={{ fontSize: 13, color: c.muted2, marginBottom: 24 }}>Avval 1-bosqichda ariza yuboring.</div>
              <button type="button" onClick={() => setActiveStep(1)} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                1-bosqichga o'tish →
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, marginBottom: 24 }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.divider}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong }}>Jarayondagi arizalar</div>
          <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>Tasdiqlanishini kutilayotgan yoki rad etilgan</div>
        </div>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: c.muted, fontSize: 13 }}>Yuklanmoqda…</div>
        ) : inProgress.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: c.muted, fontSize: 13 }}>Jarayonda ariza yo‘q.</div>
        ) : (
          inProgress.map((a) => {
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
                  borderBottom: `1px solid ${c.rowBorder}`,
                }}
              >
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{a.objectName}</div>
                  {a.notes ? <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{a.notes}</div> : null}
                </div>
                <div style={{ fontSize: 11, color: c.muted }}>{dateStr}</div>
                <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }} className={getStatusClass(st.cls)}>
                  {st.text}
                </span>
                <div style={{ fontSize: 11, color: c.muted, minWidth: 140 }}>
                  DAQNI: {a.gasnInspectorFio || '—'}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.divider}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.textStrong }}>Tasdiqlangan obyektlar</div>
          <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>DAQNI tomonidan ma’qullangan ro‘yxatga olingan obyektlar</div>
        </div>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: c.muted, fontSize: 13 }}>Yuklanmoqda…</div>
        ) : approved.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: c.muted, fontSize: 13 }}>Hozircha tasdiqlangan obyekt yo‘q.</div>
        ) : (
          approved.map((a) => {
            const raw = a.updatedAt || a.createdAt;
            const dateStr = raw ? new Date(raw).toLocaleDateString('uz-UZ') : '—';
            return (
              <div
                key={a._id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 20px',
                  borderBottom: `1px solid ${c.rowBorder}`,
                }}
              >
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{a.objectName}</div>
                  {a.notes ? <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{a.notes}</div> : null}
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500 }} className={getStatusClass('s-green')}>
                  Ro‘yxatda
                </span>
                <div style={{ fontSize: 11, color: c.muted, minWidth: 160 }}>
                  Mas’ul: {a.gasnInspectorFio || '—'}
                </div>
                <div style={{ fontSize: 11, color: c.muted }}>{dateStr}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// -------------------- XODIMLAR PAGE --------------------
const XodimlarPage = () => {
  const c = useCompanyTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [xodimlar, setXodimlar] = useState(xodimlarData);
  const [editCell, setEditCell] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editXodimId, setEditXodimId] = useState(null);
  const [editForm, setEditForm] = useState({
    n: '',
    lavozim: LAVOZIMLAR[0],
    pinfl: '',
    ihq: '',
    sana: '',
    bandlik: 'doimiy',
    boshatilgan: '',
  });
  const [newXodim, setNewXodim] = useState({
    n: '',
    lavozim: LAVOZIMLAR[0],
    pinfl: '',
    ihq: '',
    sana: '',
    bandlik: 'doimiy',
    boshatilgan: '',
  });
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${c.inputBorder}`,
    background: c.inputBg,
    color: c.inputColor,
    fontSize: 13,
    boxSizing: 'border-box',
    outline: 'none',
  };
  const labelStyle = {
    fontSize: 10,
    color: c.label,
    display: 'block',
    marginBottom: 5,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const bandlikYozuv = (b) => (b === 'yollanma' ? 'Yollanma' : 'Doimiy');

  const holatYozuv = (x) => (x.boshatilgan ? "Bo'shatilgan" : 'Faol');

  const holatClass = (x) => (x.boshatilgan ? 's-gray' : 's-green');

  const openEditModal = (x) => {
    setEditXodimId(x.id);
    setEditForm({
      n: x.n || '',
      lavozim: x.lavozim || x.lav || LAVOZIMLAR[0],
      pinfl: x.pinfl || '',
      ihq: x.ihq || '',
      sana: x.sana || '',
      bandlik: x.bandlik || 'doimiy',
      boshatilgan: x.boshatilgan || '',
    });
    setEditModalOpen(true);
  };

  const getTodayYMD = () => {
    // Local time YYYY-MM-DD
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const addXodim = () => {
    if (newXodim.n && newXodim.lavozim) {
      const holat = newXodim.boshatilgan ? 's-gray' : 's-green';
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
        next.holat = next.boshatilgan ? 's-gray' : 's-green';
        return next;
      })
    );
    setEditCell(null);
  };

  return (
    <div>
      <div style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.textStrong }}>Xodimlar ro'yxati</div>
            <div style={{ fontSize: 11, color: c.muted }}>F.I.Sh., lavozim va bandlik turini ustiga bosib tahrirlash mumkin · jami {xodimlar.length} nafar</div>
          </div>
          <button onClick={() => setModalOpen(true)} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Yangi xodim</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr style={{ background: c.surfaceMuted }}>
                {['#', 'F.I.Sh', 'Lavozimi', 'Bandlik turi', 'PINFL', 'Ish haqi', 'Qabul sanasi', "Bo'shatilgan sana", 'Holat'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: c.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${c.divider}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xodimlar.map((x, i) => (
                <tr
                  key={x.id || i}
                  onClick={() => openEditModal(x)}
                  style={{ borderBottom: `1px solid ${c.rowBorder}`, cursor: 'pointer' }}
                >
                  <td style={{ padding: '10px 14px', fontSize: 12, color: c.muted }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: c.text }}>
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
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditCell({ id: x.id, field: 'n', value: x.n }); }}
                        style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer', textAlign: 'left', padding: 0 }}
                      >
                        {x.n} ✎
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: c.label }}>
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
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditCell({ id: x.id, field: 'lavozim', value: x.lavozim || x.lav || LAVOZIMLAR[0] }); }}
                        style={{ background: 'none', border: 'none', color: c.label, cursor: 'pointer', padding: 0 }}
                      >
                        {x.lavozim || x.lav} ✎
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: c.label }}>
                    {editCell?.id === x.id && editCell.field === 'bandlik' ? (
                      <select
                        autoFocus
                        style={{ ...inputStyle, padding: '4px 8px' }}
                        value={editCell.value}
                        onChange={(e) => setEditCell({ ...editCell, value: e.target.value })}
                        onBlur={() => patchXodim(x.id, { bandlik: editCell.value })}
                      >
                        <option value="doimiy">Doimiy</option>
                        <option value="yollanma">Yollanma</option>
                      </select>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditCell({
                            id: x.id,
                            field: 'bandlik',
                            value: x.bandlik === 'yollanma' ? 'yollanma' : 'doimiy',
                          });
                        }}
                        style={{ background: 'none', border: 'none', color: c.label, cursor: 'pointer', padding: 0 }}
                      >
                        {bandlikYozuv(x.bandlik || 'doimiy')} ✎
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', color: c.muted }}>{x.pinfl}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500, color: c.text }}>{x.ihq} so'm</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: c.muted }}>{x.sana}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: c.muted }}>
                    <input
                      type="date"
                      style={{ ...inputStyle, padding: '4px 8px', maxWidth: 140 }}
                      value={x.boshatilgan || ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const v = e.target.value;
                        patchXodim(x.id, v ? { boshatilgan: v } : { boshatilgan: '' });
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500 }} className={getStatusClass(holatClass(x))}>{holatYozuv(x)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div onClick={(e) => e.target === e.currentTarget && setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: c.modalPanel, border: `1px solid ${c.inputBorder}`, borderRadius: 16, padding: 28, width: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.textStrong }}>Yangi xodim qo'shish</div>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: c.muted, fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>F.I.Sh</label>
                <input type="text" style={inputStyle} placeholder="Karimov Alisher Bahodir o'g'li" value={newXodim.n} onChange={(e) => setNewXodim({ ...newXodim, n: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Bandlik turi</label>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
                    <input type="radio" name="bandlik" checked={newXodim.bandlik === 'doimiy'} onChange={() => setNewXodim({ ...newXodim, bandlik: 'doimiy' })} />
                    Doimiy
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
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
              <div style={{ paddingTop: 8, borderTop: `1px solid ${c.divider}` }}>
                <label style={labelStyle}>Bo'shatilgan sana (agar mavjud bo'lsa)</label>
                <input type="date" style={inputStyle} value={newXodim.boshatilgan} onChange={(e) => setNewXodim({ ...newXodim, boshatilgan: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: `1px solid ${c.inputBorder}`,
                  background: 'transparent',
                  color: c.stepTextIdle,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Bekor
              </button>
              <button type="button" onClick={addXodim} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setEditModalOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}
        >
          <div style={{ background: c.modalPanel, border: `1px solid ${c.inputBorder}`, borderRadius: 16, padding: 28, width: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.textStrong }}>Xodimni tahrirlash</div>
              <button type="button" onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', color: c.muted, fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>F.I.Sh</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="Ism Familiya"
                  value={editForm.n}
                  onChange={(e) => setEditForm({ ...editForm, n: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Bandlik turi</label>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
                    <input type="radio" name="edit-bandlik" checked={editForm.bandlik === 'doimiy'} onChange={() => setEditForm({ ...editForm, bandlik: 'doimiy' })} />
                    Doimiy
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
                    <input type="radio" name="edit-bandlik" checked={editForm.bandlik === 'yollanma'} onChange={() => setEditForm({ ...editForm, bandlik: 'yollanma' })} />
                    Yollanma
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Lavozimi</label>
                <select style={inputStyle} value={editForm.lavozim} onChange={(e) => setEditForm({ ...editForm, lavozim: e.target.value })}>
                  {LAVOZIMLAR.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>PINFL</label>
                <input type="text" style={inputStyle} placeholder="12345678901234" maxLength={14} value={editForm.pinfl} onChange={(e) => setEditForm({ ...editForm, pinfl: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Ish haqi (so'm)</label>
                <input type="number" style={inputStyle} placeholder="3000000" value={editForm.ihq} onChange={(e) => setEditForm({ ...editForm, ihq: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Qabul sanasi</label>
                <input type="date" style={inputStyle} value={editForm.sana} onChange={(e) => setEditForm({ ...editForm, sana: e.target.value })} />
              </div>

              <div style={{ paddingTop: 8 }}>
                <label style={labelStyle}>Holat</label>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit-holat"
                      checked={!editForm.boshatilgan}
                      onChange={() => setEditForm({ ...editForm, boshatilgan: '' })}
                    />
                    Faol
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.text, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="edit-holat"
                      checked={!!editForm.boshatilgan}
                      onChange={() => setEditForm({ ...editForm, boshatilgan: editForm.boshatilgan || getTodayYMD() })}
                    />
                    Bo'shatilgan
                  </label>
                </div>
              </div>

              <div style={{ paddingTop: 8, borderTop: `1px solid ${c.divider}` }}>
                <label style={labelStyle}>Bo'shatilgan sana</label>
                <input
                  type="date"
                  style={{ ...inputStyle, opacity: editForm.boshatilgan ? 1 : 0.6 }}
                  disabled={!editForm.boshatilgan}
                  value={editForm.boshatilgan}
                  onChange={(e) => setEditForm({ ...editForm, boshatilgan: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: `1px solid ${c.inputBorder}`,
                  background: 'transparent',
                  color: c.stepTextIdle,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Bekor
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editXodimId) return;
                  patchXodim(editXodimId, editForm);
                  setEditModalOpen(false);
                }}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- MAIN --------------------
const PAGE_TITLES = {
  dashboard: 'Korxona Dashboard',
  hisobot: 'Yakuniy hisobot',
  obekt: "Obyekt Ro'yxatga Olish",
  xodimlar: "Xodimlar Ro'yxati",
};

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} />;
      case 'hisobot': return <HisobotPage />;
      case 'obekt': return <ObektPage />;
      case 'xodimlar': return <XodimlarPage />;
      default: return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#080d17' : '#f1f5f9',
        color: isDark ? '#e5e7eb' : '#1e293b',
        fontFamily: "'Geologica', system-ui, sans-serif",
      }}
    >
      <Sidebar activePage={activePage} setActivePage={setActivePage} logout={logout} isDark={isDark} />
      <div style={{ marginLeft: 230, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            background: isDark ? 'rgba(10,15,26,0.9)' : 'rgba(255,255,255,0.92)',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#fff' : '#0f172a' }}>{PAGE_TITLES[activePage] ?? PAGE_TITLES.dashboard}</div>
            <div style={{ fontSize: 11, color: isDark ? '#6b7280' : '#64748b' }}>Baraka Qurilish LLC · INN 307123456</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: isDark ? 'rgba(217,119,6,0.15)' : 'rgba(217,119,6,0.12)', color: isDark ? '#fbbf24' : '#b45309' }}>⚠ 1 ta ogohlantirish</span>
            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 500, background: isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.12)', color: isDark ? '#60a5fa' : '#1d4ed8' }}>2025-Q1 hisoboti kutilmoqda</span>
            <span style={{ fontSize: 11, color: isDark ? '#4b5563' : '#64748b' }}>28.03.2026</span>
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