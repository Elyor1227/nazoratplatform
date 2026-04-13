/** Statik rejimda o‘zgaruvchan mock ma’lumot */

const companyId = '64f0a1b2c3d4e5f6a7b8c9d0';

/** Vite: client/.env — har bir email uchun alohida yoki VITE_DEMO_PASSWORD zaxira */
const fall = import.meta.env.VITE_DEMO_PASSWORD || 'demo1234';
const pw = (email) =>
  ({
    'company@demo.uz': import.meta.env.VITE_DEMO_PASSWORD_COMPANY || fall,
    'gasn@demo.uz': import.meta.env.VITE_DEMO_PASSWORD_GASN || fall,
    'soliq@demo.uz': import.meta.env.VITE_DEMO_PASSWORD_SOLIQ || fall,
    'mehnat@demo.uz': import.meta.env.VITE_DEMO_PASSWORD_MEHNAT || fall,
  }[email] || fall);

export const staticUsers = [
  {
    id: companyId,
    email: 'company@demo.uz',
    password: pw('company@demo.uz'),
    role: 'construction_company',
    organizationName: 'Demo Qurilish MCHJ',
    fullName: '',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d1',
    email: 'gasn@demo.uz',
    password: pw('gasn@demo.uz'),
    role: 'gasn',
    organizationName: '',
    fullName: 'GASN inspektor',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d2',
    email: 'soliq@demo.uz',
    password: pw('soliq@demo.uz'),
    role: 'tax_inspection',
    organizationName: '',
    fullName: 'Soliq',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d3',
    email: 'mehnat@demo.uz',
    password: pw('mehnat@demo.uz'),
    role: 'labor_inspection',
    organizationName: '',
    fullName: 'Mehnat',
  },
];

let reports = [
  {
    _id: '64f0a1b2c3d4e5f6a7b8c9e1',
    companyUserId: companyId,
    periodYear: new Date().getFullYear(),
    periodMonth: Math.max(1, new Date().getMonth()),
    employeeCount: 12,
    payrollFund: 45_000_000,
    contractAmount: 120_000_000,
    constructionType: 'Turar-joy',
    notes: 'Statik demo hisobot',
    invoices: [
      {
        _id: 'inv1',
        fileName: 'demo-faktura.pdf',
        storedName: 'demo-faktura.pdf',
        fileUrl: '/api/reports/64f0a1b2c3d4e5f6a7b8c9e1/files/demo-faktura.pdf',
      },
    ],
  },
];

let projects = [
  {
    _id: '64f0p1b2c3d4e5f6a7b8c9d0',
    companyUserId: companyId,
    title: 'Demo loyiha smetasi',
    smetaEmployeeCount: 10,
    smetaContractSum: 100_000_000,
    smetaPayrollEstimate: 40_000_000,
    notes: '',
  },
];

let alerts = [
  {
    _id: '64f0a1b2c3d4e5f6a7b8c9f1',
    type: 'payroll_vs_contract',
    severity: 'warning',
    companyUserId: companyId,
    reportId: '64f0a1b2c3d4e5f6a7b8c9e1',
    message: '[Statik demo] Ish haqi fondi shartnomaga nisbatan past.',
    acknowledged: false,
  },
  {
    _id: '64f0a1b2c3d4e5f6a7b8c9f2',
    type: 'zero_employees_suspicious',
    severity: 'critical',
    companyUserId: companyId,
    reportId: null,
    message: '[Statik demo] Boshqa korxonada “nol” xodim signali.',
    acknowledged: false,
  },
];

const gasnId = '64f0a1b2c3d4e5f6a7b8c9d1';

/** Statik demo: DAQNI arizaga biriktirish uchun */
export const gasnInspectors = [
  { id: 'g1', fio: 'Karimov A.A.', position: 'Bosh inspektor' },
  { id: 'g2', fio: 'Tursunov B.B.', position: 'Inspektor' },
  { id: 'g3', fio: 'Siddiqov J.J.', position: 'Katta inspektor' },
  { id: 'g4', fio: 'Rahimov D.D.', position: 'Inspektor' },
];

/** Namuna: obyekt ro'yxatga olish jadvallari (GASN ko‘rinishi uchun) */
const demoRegPayload = {
  registrationSummary: {
    materials: 850000000,
    equipment: 120000000,
    machinery: 95000000,
    wages: 210000000,
    otherExpenses: 45000000,
    vat: 180000000,
  },
  registrationEmployeeCount: 47,
  workVolumes: [
    { key: 'labor', labelUz: 'Mehnat (ish kuchi) xarajatlari', unit: 'soat', volume: 12000, pricePerUnit: 45000 },
    { key: 'electricity', labelUz: 'Elektr energiyasi', unit: 'kVt·soat', volume: 8500, pricePerUnit: 950 },
    { key: 'fuel_lubricants', labelUz: "Yoqilg‘i-moylash materiallari", unit: 'litr', volume: 2100, pricePerUnit: 12000 },
    { key: 'metal', labelUz: 'Metall', unit: 't', volume: 42, pricePerUnit: 12500000 },
    { key: 'cement', labelUz: 'Sement', unit: 't', volume: 180, pricePerUnit: 980000 },
    { key: 'sand', labelUz: 'Qum', unit: 'm3', volume: 320, pricePerUnit: 85000 },
    { key: 'precast_concrete', labelUz: "Yig‘ma temir-beton mahsulotlari", unit: 'm3', volume: 95, pricePerUnit: 420000 },
    { key: 'wood', labelUz: 'Yog‘och materiallari (pilomaterial)', unit: 'm3', volume: 28, pricePerUnit: 2100000 },
    { key: 'bricks', labelUz: "G‘isht (zavodlar)", unit: 'ming.dona', volume: 420, pricePerUnit: 480000 },
    { key: 'other_materials', labelUz: 'Boshqa materiallar', unit: 'so‘m', volume: 1, pricePerUnit: 35000000 },
    { key: 'risk_coefficient', labelUz: 'Tavakkalchilik koeffitsienti', unit: 'koef.', volume: 1, pricePerUnit: 1.08 },
  ],
};

let applications = [
  {
    _id: '64app01b2c3d4e5f6a7b8c9a1',
    companyUserId: companyId,
    objectName: "42-maktab yangi binosi",
    notes: '',
    status: 'pending',
    gasnInspectorFio: '',
    ...demoRegPayload,
    attachments: [
      {
        _id: '64att01',
        fileName: 'loyiha-smeta-qismi.pdf',
        storedName: 'demo-smeta-qismi.pdf',
        step: 2,
      },
    ],
    createdAt: new Date('2025-03-25').toISOString(),
  },
  {
    _id: '64app02b2c3d4e5f6a7b8c9a2',
    companyUserId: companyId,
    objectName: 'Markaziy poliklinika rekonstr.',
    notes: '',
    status: 'pending',
    gasnInspectorFio: 'Karimov A.A.',
    ...demoRegPayload,
    attachments: [],
    createdAt: new Date('2025-03-26').toISOString(),
  },
  {
    _id: '64app03b2c3d4e5f6a7b8c9a3',
    companyUserId: companyId,
    objectName: 'Sport majmuasi',
    notes: 'Namuna',
    status: 'approved',
    gasnInspectorFio: 'Tursunov B.B.',
    reviewedByUserId: gasnId,
    ...demoRegPayload,
    attachments: [],
    createdAt: new Date('2025-03-20').toISOString(),
  },
];

export function getReports() {
  return reports;
}

export function setReports(next) {
  reports = typeof next === 'function' ? next(reports) : next;
}

export function getProjects() {
  return projects;
}

export function pushProject(p) {
  projects = [...projects, p];
}

export function getAlerts() {
  return alerts;
}

export function patchAlert(id, patch) {
  alerts = alerts.map((a) => (a._id === id ? { ...a, ...patch } : a));
}

export function findUserByEmail(email) {
  return staticUsers.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

export function getApplications() {
  return applications;
}

export function pushApplication(app) {
  applications = [...applications, app];
}

export function patchApplication(id, patch) {
  applications = applications.map((a) => {
    if (a._id !== id) return a;
    const next = { ...a };
    for (const k of Object.keys(patch)) {
      if (patch[k] !== undefined) next[k] = patch[k];
    }
    return next;
  });
}

export function setApplications(next) {
  applications = typeof next === 'function' ? next(applications) : next;
}
