import {
  findUserByEmail,
  getAlerts,
  getProjects,
  getReports,
  patchAlert,
  pushProject,
  setReports,
  staticUsers,
} from './staticStore.js';

const USER_KEY = 'soliqnazorat_user';

function currentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    organizationName: u.organizationName,
    fullName: u.fullName,
  };
}

function randomId() {
  return `64${Math.random().toString(16).slice(2, 26)}`;
}

/** Axios-compatible success: { data, status, headers } */
export async function handleStaticRequest(method, url, data, config) {
  const path = String(url).replace(/\?.*$/, '');
  const blob = config?.responseType === 'blob';

  if (blob && method === 'get') {
    const pdfMatch = path.match(/^\/reports\/([^/]+)\/pdf$/);
    if (pdfMatch) {
      const text = `Statik demo PDF.\nHisobot ID: ${pdfMatch[1]}\nTo'liq PDF uchun backend ishga tushiring.`;
      return { data: new Blob([text], { type: 'application/pdf' }), status: 200, headers: {} };
    }
    const fileMatch = path.match(/^\/reports\/([^/]+)\/files\/(.+)$/);
    if (fileMatch) {
      const name = decodeURIComponent(fileMatch[2]);
      return {
        data: new Blob([`Statik demo fayl: ${name}`], { type: 'application/octet-stream' }),
        status: 200,
        headers: {},
      };
    }
  }

  if (method === 'post' && path === '/auth/login') {
    const { email, password } = data || {};
    const u = findUserByEmail(email);
    if (!u || u.password !== password) {
      const err = new Error('Login yoki parol noto\'g\'ri');
      err.response = { status: 401, data: { error: err.message } };
      throw err;
    }
    return {
      data: {
        token: 'static-token',
        user: publicUser(u),
      },
      status: 200,
      headers: {},
    };
  }

  if (method === 'get' && path === '/dashboard/summary') {
    const u = currentUser();
    if (!u) return { data: {}, status: 401, headers: {} };
    const role = u.role;
    if (role === 'construction_company') {
      const list = getReports().filter((r) => r.companyUserId === u.id);
      const last = list[0];
      return {
        data: {
          role,
          stats: {
            reportCount: list.length,
            projectsLinked: getProjects().filter((p) => p.companyUserId === u.id).length,
            lastReport: last || null,
          },
        },
        status: 200,
        headers: {},
      };
    }
    if (role === 'gasn') {
      return {
        data: {
          role,
          stats: {
            reportsTotal: getReports().length,
            projectsTotal: getProjects().length,
            alertsOpen: getAlerts().filter((a) => !a.acknowledged).length,
          },
        },
        status: 200,
        headers: {},
      };
    }
    if (role === 'tax_inspection') {
      return {
        data: {
          role,
          stats: {
            payrollAlerts: getAlerts().filter((a) => a.type === 'payroll_vs_contract' && !a.acknowledged)
              .length,
            recentReportIds: getReports().slice(0, 3).map((r) => r._id),
          },
        },
        status: 200,
        headers: {},
      };
    }
    if (role === 'labor_inspection') {
      const zeroRep = getReports().filter((r) => r.employeeCount === 0 && r.contractAmount > 0).length;
      return {
        data: {
          role,
          stats: {
            zeroAlerts: getAlerts().filter((a) => a.type === 'zero_employees_suspicious' && !a.acknowledged)
              .length,
            zeroEmployeeReports: zeroRep,
          },
        },
        status: 200,
        headers: {},
      };
    }
    return { data: { role, stats: {} }, status: 200, headers: {} };
  }

  if (method === 'get' && path === '/dashboard/companies') {
    const companies = staticUsers
      .filter((x) => x.role === 'construction_company')
      .map((c) => ({
        _id: c.id,
        organizationName: c.organizationName,
        email: c.email,
        createdAt: new Date().toISOString(),
      }));
    return { data: { companies }, status: 200, headers: {} };
  }

  if (method === 'get' && path === '/reports') {
    const u = currentUser();
    let list = getReports();
    if (u?.role === 'construction_company') {
      list = list.filter((r) => r.companyUserId === u.id);
    }
    return { data: { reports: list }, status: 200, headers: {} };
  }

  if (method === 'post' && path === '/reports') {
    const u = currentUser();
    if (u?.role !== 'construction_company') {
      const err = new Error('Ruxsat yo\'q');
      err.response = { status: 403, data: { error: err.message } };
      throw err;
    }
    let body = {};
    const files = [];
    if (data instanceof FormData) {
      for (const [k, v] of data.entries()) {
        if (v instanceof File) files.push(v);
        else body[k] = v;
      }
    } else {
      body = data || {};
    }

    const periodYear = Number(body.periodYear);
    const periodMonth = Number(body.periodMonth);
    const dup = getReports().some(
      (r) =>
        r.companyUserId === u.id && r.periodYear === periodYear && r.periodMonth === periodMonth
    );
    if (dup) {
      const err = new Error('Bu davr uchun hisobot allaqachon yuborilgan');
      err.response = { status: 409, data: { error: err.message } };
      throw err;
    }

    const id = randomId();
    const invoices = files.map((file, i) => {
      const storedName = `st-${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      return {
        _id: `inv-${id}-${i}`,
        fileName: file.name,
        storedName,
        fileUrl: `/api/reports/${id}/files/${encodeURIComponent(storedName)}`,
      };
    });

    const report = {
      _id: id,
      companyUserId: u.id,
      periodYear,
      periodMonth,
      employeeCount: Number(body.employeeCount),
      payrollFund: Number(body.payrollFund),
      contractAmount: Number(body.contractAmount),
      constructionType: String(body.constructionType || '').trim(),
      notes: String(body.notes || ''),
      invoices,
    };
    setReports((prev) => [report, ...prev]);
    return { data: { report }, status: 201, headers: {} };
  }

  if (method === 'get' && path === '/projects') {
    const u = currentUser();
    let list = getProjects();
    if (u?.role === 'construction_company') {
      list = list.filter((p) => p.companyUserId === u.id);
    }
    return { data: { projects: list }, status: 200, headers: {} };
  }

  if (method === 'post' && path === '/projects') {
    const u = currentUser();
    const p = {
      _id: randomId(),
      companyUserId: data.companyUserId,
      title: data.title,
      smetaEmployeeCount: Number(data.smetaEmployeeCount) || 0,
      smetaContractSum: Number(data.smetaContractSum) || 0,
      smetaPayrollEstimate: Number(data.smetaPayrollEstimate) || 0,
      notes: data.notes || '',
    };
    pushProject(p);
    return { data: { project: p }, status: 201, headers: {} };
  }

  if (method === 'get' && path.startsWith('/compare/report/')) {
    const reportId = path.replace('/compare/report/', '');
    const report = getReports().find((r) => r._id === reportId);
    if (!report) return { data: { error: 'Hisobot topilmadi' }, status: 404, headers: {} };
    const project = getProjects().find((pr) => pr.companyUserId === report.companyUserId);
    if (!project) {
      return {
        data: {
          report,
          company: { organizationName: 'Demo' },
          project: null,
          diff: null,
          message: 'Bu korxona uchun smeta/loyiha hujjatlari kiritilmagan.',
        },
        status: 200,
        headers: {},
      };
    }
    const smeta = {
      smetaEmployeeCount: project.smetaEmployeeCount,
      smetaContractSum: project.smetaContractSum,
      smetaPayrollEstimate: project.smetaPayrollEstimate,
    };
    const actual = {
      employeeCount: report.employeeCount,
      payrollFund: report.payrollFund,
      contractAmount: report.contractAmount,
      constructionType: report.constructionType,
    };
    const diff = {
      employeeDelta: report.employeeCount - project.smetaEmployeeCount,
      contractDelta: report.contractAmount - project.smetaContractSum,
      payrollVsSmeta: report.payrollFund - project.smetaPayrollEstimate,
    };
    return {
      data: { report, company: { organizationName: 'Demo' }, project, smeta, actual, diff },
      status: 200,
      headers: {},
    };
  }

  if (method === 'get' && path === '/alerts') {
    const u = currentUser();
    let list = getAlerts();
    if (u?.role === 'tax_inspection') {
      list = list.filter((a) => ['payroll_vs_contract', 'tax_payroll_anomaly'].includes(a.type));
    } else if (u?.role === 'labor_inspection') {
      list = list.filter((a) => a.type === 'zero_employees_suspicious');
    }
    return { data: { alerts: list }, status: 200, headers: {} };
  }

  if (method === 'patch' && /^\/alerts\/[^/]+\/ack$/.test(path)) {
    const id = path.match(/^\/alerts\/([^/]+)\/ack$/)[1];
    patchAlert(id, { acknowledged: true });
    const a = getAlerts().find((x) => x._id === id);
    return { data: { alert: a }, status: 200, headers: {} };
  }

  if (method === 'get' && /^\/reports\/[^/]+$/.test(path)) {
    const id = path.replace('/reports/', '');
    const report = getReports().find((r) => r._id === id);
    if (!report) {
      const err = new Error('Hisobot topilmadi');
      err.response = { status: 404, data: { error: err.message } };
      throw err;
    }
    return { data: { report }, status: 200, headers: {} };
  }

  const err = new Error(`Statik rejim: ${method} ${path} aniqlanmadi`);
  err.response = { status: 404, data: { error: err.message } };
  throw err;
}
