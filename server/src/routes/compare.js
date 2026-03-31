import { Router } from 'express';
import { Report } from '../models/Report.js';
import { ProjectDocument } from '../models/ProjectDocument.js';
import { User, ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, loadUser);
router.use(requireRoles(ROLES.GASN));

router.get('/report/:reportId', async (req, res) => {
  const report = await Report.findById(req.params.reportId).lean();
  if (!report) return res.status(404).json({ error: 'Hisobot topilmadi' });

  const project = await ProjectDocument.findOne({ companyUserId: report.companyUserId })
    .sort({ updatedAt: -1 })
    .lean();

  const company = await User.findById(report.companyUserId).select('organizationName email').lean();

  const actual = {
    employeeCount: report.employeeCount,
    payrollFund: report.payrollFund,
    contractAmount: report.contractAmount,
    constructionType: report.constructionType,
  };

  if (!project) {
    return res.json({
      report,
      company,
      project: null,
      diff: null,
      message: 'Bu korxona uchun smeta/loyiha hujjatlari kiritilmagan.',
    });
  }

  const smeta = {
    smetaEmployeeCount: project.smetaEmployeeCount,
    smetaContractSum: project.smetaContractSum,
    smetaPayrollEstimate: project.smetaPayrollEstimate,
  };

  const diff = {
    employeeDelta: report.employeeCount - project.smetaEmployeeCount,
    contractDelta: report.contractAmount - project.smetaContractSum,
    payrollVsSmeta: report.payrollFund - project.smetaPayrollEstimate,
    employeePercent:
      project.smetaEmployeeCount > 0
        ? ((report.employeeCount - project.smetaEmployeeCount) / project.smetaEmployeeCount) * 100
        : null,
    contractPercent:
      project.smetaContractSum > 0
        ? ((report.contractAmount - project.smetaContractSum) / project.smetaContractSum) * 100
        : null,
  };

  res.json({ report, company, project, smeta, actual, diff });
});

export default router;
