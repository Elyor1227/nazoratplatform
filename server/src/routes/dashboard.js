import { Router } from 'express';
import { Report } from '../models/Report.js';
import { Alert } from '../models/Alert.js';
import { User, ROLES } from '../models/User.js';
import { ProjectDocument } from '../models/ProjectDocument.js';
import { authRequired, loadUser } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, loadUser);

router.get('/summary', async (req, res) => {
  const { role, _id } = req.user;

  if (role === ROLES.CONSTRUCTION_COMPANY) {
    const [reportCount, lastReport] = await Promise.all([
      Report.countDocuments({ companyUserId: _id }),
      Report.findOne({ companyUserId: _id }).sort({ periodYear: -1, periodMonth: -1 }).lean(),
    ]);
    const projects = await ProjectDocument.countDocuments({ companyUserId: _id });
    return res.json({
      role,
      stats: { reportCount, projectsLinked: projects, lastReport },
    });
  }

  if (role === ROLES.GASN) {
    const [reportsTotal, projectsTotal, alertsOpen] = await Promise.all([
      Report.countDocuments(),
      ProjectDocument.countDocuments(),
      Alert.countDocuments({ acknowledged: false }),
    ]);
    return res.json({
      role,
      stats: { reportsTotal, projectsTotal, alertsOpen },
    });
  }

  if (role === ROLES.TAX_INSPECTION) {
    const payrollAlerts = await Alert.countDocuments({
      type: { $in: ['payroll_vs_contract', 'tax_payroll_anomaly'] },
      acknowledged: false,
    });
    const recent = await Report.find().sort({ updatedAt: -1 }).limit(5).lean();
    return res.json({ role, stats: { payrollAlerts, recentReportIds: recent.map((r) => r._id) } });
  }

  if (role === ROLES.LABOR_INSPECTION) {
    const zeroAlerts = await Alert.countDocuments({
      type: 'zero_employees_suspicious',
      acknowledged: false,
    });
    const zeroReports = await Report.countDocuments({ employeeCount: 0, contractAmount: { $gt: 0 } });
    return res.json({ role, stats: { zeroAlerts, zeroEmployeeReports: zeroReports } });
  }

  res.json({ role, stats: {} });
});

router.get('/companies', async (req, res) => {
  if (req.user.role === ROLES.CONSTRUCTION_COMPANY) {
    return res.status(403).json({ error: 'Ruxsat yo\'q' });
  }
  const companies = await User.find({ role: ROLES.CONSTRUCTION_COMPANY })
    .select('organizationName email createdAt')
    .sort({ organizationName: 1 })
    .lean();
  res.json({ companies });
});

export default router;
