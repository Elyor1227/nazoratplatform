import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { Report } from '../models/Report.js';
import { User, ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';
import { runAlertRules } from '../utils/alertEngine.js';
import { uploadInvoices } from '../middleware/upload.js';
import { pipeReportPdf } from '../utils/pdfReport.js';

const router = Router();

const uploadRoot = path.join(process.cwd(), 'uploads');

router.use(authRequired, loadUser);

function canAccessReport(user, report) {
  if (user.role === ROLES.CONSTRUCTION_COMPANY) {
    return report.companyUserId.equals(user._id);
  }
  return [ROLES.GASN, ROLES.TAX_INSPECTION, ROLES.LABOR_INSPECTION].includes(user.role);
}

router.get('/', async (req, res) => {
  const { role, _id } = req.user;
  let q = {};
  if (role === ROLES.CONSTRUCTION_COMPANY) {
    q = { companyUserId: _id };
  }
  const reports = await Report.find(q).sort({ periodYear: -1, periodMonth: -1 }).limit(200).lean();
  res.json({ reports });
});

router.get('/:id/pdf', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Hisobot topilmadi' });
    if (!canAccessReport(req.user, report)) {
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }
    const company = await User.findById(report.companyUserId).select('organizationName email').lean();
    const companyLabel = company?.organizationName || company?.email || '';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="hisobot-${report.periodYear}-${String(report.periodMonth).padStart(2, '0')}.pdf"`
    );
    pipeReportPdf(res, report, companyLabel);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/files/:storedName', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Hisobot topilmadi' });
    if (!canAccessReport(req.user, report)) {
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }
    const decoded = decodeURIComponent(req.params.storedName);
    const inv = report.invoices.find((i) => i.storedName === decoded);
    if (!inv) return res.status(404).json({ error: 'Fayl topilmadi' });

    const filePath = path.join(uploadRoot, 'reports', report._id.toString(), inv.storedName);
    const resolved = path.resolve(filePath);
    const base = path.resolve(path.join(uploadRoot, 'reports', report._id.toString()));
    if (!resolved.startsWith(base)) {
      return res.status(400).json({ error: 'Noto\'g\'ri yo\'l' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(inv.fileName)}"`);
    res.sendFile(resolved, (err) => {
      if (err) next(err);
    });
  } catch (e) {
    next(e);
  }
});

router.post('/', requireRoles(ROLES.CONSTRUCTION_COMPANY), uploadInvoices.array('invoices', 15), async (req, res) => {
  const {
    periodYear,
    periodMonth,
    employeeCount,
    payrollFund,
    contractAmount,
    constructionType,
    notes,
  } = req.body;

  if (
    periodYear == null ||
    periodMonth == null ||
    employeeCount == null ||
    payrollFund == null ||
    contractAmount == null ||
    !constructionType
  ) {
    await cleanupTempFiles(req.files);
    return res.status(400).json({
      error:
        'periodYear, periodMonth, employeeCount, payrollFund, contractAmount, constructionType majburiy',
    });
  }

  let report;
  try {
    report = await Report.create({
      companyUserId: req.user._id,
      periodYear: Number(periodYear),
      periodMonth: Number(periodMonth),
      employeeCount: Number(employeeCount),
      payrollFund: Number(payrollFund),
      contractAmount: Number(contractAmount),
      constructionType: String(constructionType).trim(),
      invoices: [],
      notes: notes ? String(notes) : '',
    });
  } catch (e) {
    await cleanupTempFiles(req.files);
    if (e.code === 11000) {
      return res.status(409).json({ error: 'Bu davr uchun hisobot allaqachon yuborilgan' });
    }
    throw e;
  }

  const destDir = path.join(uploadRoot, 'reports', report._id.toString());
  await fs.mkdir(destDir, { recursive: true });

  const invoices = [];
  try {
    for (const file of req.files || []) {
      const dest = path.join(destDir, file.filename);
      await fs.rename(file.path, dest);
      invoices.push({
        fileName: file.originalname,
        storedName: file.filename,
        fileUrl: `/api/reports/${report._id}/files/${encodeURIComponent(file.filename)}`,
      });
    }
  } catch (e) {
    await fs.rm(destDir, { recursive: true, force: true }).catch(() => {});
    await Report.deleteOne({ _id: report._id });
    await cleanupTempFiles(req.files);
    throw e;
  }

  report.invoices = invoices;
  await report.save();

  await runAlertRules({ report, io: req.app.get('io') });
  res.status(201).json({ report });
});

router.get('/:id', async (req, res) => {
  const report = await Report.findById(req.params.id).lean();
  if (!report) return res.status(404).json({ error: 'Hisobot topilmadi' });
  if (!canAccessReport(req.user, report)) {
    return res.status(403).json({ error: 'Ruxsat yo\'q' });
  }
  res.json({ report });
});

async function cleanupTempFiles(files) {
  for (const f of files || []) {
    if (f?.path) await fs.unlink(f.path).catch(() => {});
  }
}

export default router;
