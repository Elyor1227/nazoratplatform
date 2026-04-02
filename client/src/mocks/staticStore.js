/** Statik rejimda o‘zgaruvchan mock ma’lumot */

const companyId = '64f0a1b2c3d4e5f6a7b8c9d0';

export const staticUsers = [
  {
    id: companyId,
    email: 'company@demo.uz',
    password: 'demo1234',
    role: 'construction_company',
    organizationName: 'Demo Qurilish MCHJ',
    fullName: '',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d1',
    email: 'gasn@demo.uz',
    password: 'demo1234',
    role: 'gasn',
    organizationName: '',
    fullName: 'GASN inspektor',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d2',
    email: 'soliq@demo.uz',
    password: 'demo1234',
    role: 'tax_inspection',
    organizationName: '',
    fullName: 'Soliq',
  },
  {
    id: '64f0a1b2c3d4e5f6a7b8c9d3',
    email: 'mehnat@demo.uz',
    password: 'demo1234',
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

let applications = [
  {
    _id: '64app01b2c3d4e5f6a7b8c9a1',
    companyUserId: companyId,
    objectName: "42-maktab yangi binosi",
    notes: '',
    status: 'pending',
    gasnInspectorFio: '',
    createdAt: new Date('2025-03-25').toISOString(),
  },
  {
    _id: '64app02b2c3d4e5f6a7b8c9a2',
    companyUserId: companyId,
    objectName: 'Markaziy poliklinika rekonstr.',
    notes: '',
    status: 'pending',
    gasnInspectorFio: 'Karimov A.A.',
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
