import { Alert, ALERT_TYPES } from '../models/Alert.js';
import { ProjectDocument } from '../models/ProjectDocument.js';
import { ROLES } from '../models/User.js';

function emitAlert(io, alertDoc) {
  if (!io) return;
  const a = alertDoc.toObject ? alertDoc.toObject() : alertDoc;
  const payload = { alert: a };
  switch (a.type) {
    case ALERT_TYPES.ZERO_EMPLOYEES:
      io.to(`role:${ROLES.LABOR_INSPECTION}`).emit('alert:new', payload);
      io.to(`role:${ROLES.GASN}`).emit('alert:new', payload);
      break;
    case ALERT_TYPES.PAYROLL_VS_CONTRACT:
    case ALERT_TYPES.TAX_PAYROLL_LOW:
      io.to(`role:${ROLES.TAX_INSPECTION}`).emit('alert:new', payload);
      break;
    case ALERT_TYPES.GASN_DEVIATION:
      io.to(`role:${ROLES.GASN}`).emit('alert:new', payload);
      break;
    default:
      io.emit('alert:new', payload);
  }
}

const CONTRACT_WITH_ZERO_EMP_THRESHOLD = 1;
const PAYROLL_RATIO_WARN = 0.05;

/**
 * Hisobot yaratilgandan keyin qoidalar bo'yicha alertlar yaratadi va socket orqali uzatiladi.
 */
export async function runAlertRules({ report, io }) {
  const companyId = report.companyUserId;
  const alerts = [];

  if (report.employeeCount === 0 && report.contractAmount >= CONTRACT_WITH_ZERO_EMP_THRESHOLD) {
    const a = await Alert.create({
      type: ALERT_TYPES.ZERO_EMPLOYEES,
      severity: 'critical',
      companyUserId: companyId,
      reportId: report._id,
      message:
        'Korxona "nol" xodim ko\'rsatdi, lekin shartnoma summasi mavjud — mehnat nazorati uchun tekshiruv tavsiya etiladi.',
      meta: { contractAmount: report.contractAmount },
    });
    alerts.push(a);
  }

  if (report.contractAmount > 0 && report.payrollFund / report.contractAmount < PAYROLL_RATIO_WARN) {
    const a = await Alert.create({
      type: ALERT_TYPES.PAYROLL_VS_CONTRACT,
      severity: 'warning',
      companyUserId: companyId,
      reportId: report._id,
      message:
        'Ish haqi fondi shartnoma summasiga nisbatan juda past — soliq nazorati uchun signal.',
      meta: {
        payrollFund: report.payrollFund,
        contractAmount: report.contractAmount,
        ratio: report.payrollFund / report.contractAmount,
      },
    });
    alerts.push(a);
  }

  const project = await ProjectDocument.findOne({ companyUserId: companyId })
    .sort({ updatedAt: -1 })
    .lean();

  if (project) {
    const empDiff = Math.abs(report.employeeCount - project.smetaEmployeeCount);
    const contractDiffRatio =
      project.smetaContractSum > 0
        ? Math.abs(report.contractAmount - project.smetaContractSum) / project.smetaContractSum
        : 0;
    if (empDiff > 2 || contractDiffRatio > 0.15) {
      const a = await Alert.create({
        type: ALERT_TYPES.GASN_DEVIATION,
        severity: contractDiffRatio > 0.3 ? 'critical' : 'warning',
        companyUserId: companyId,
        reportId: report._id,
        message: `Smeta/loyiha bilan tafovut: xodimlar ${report.employeeCount} vs smeta ${project.smetaEmployeeCount}; shartnoma ${report.contractAmount} vs smeta ${project.smetaContractSum}.`,
        meta: {
          report: {
            employeeCount: report.employeeCount,
            contractAmount: report.contractAmount,
          },
          smeta: {
            smetaEmployeeCount: project.smetaEmployeeCount,
            smetaContractSum: project.smetaContractSum,
          },
        },
      });
      alerts.push(a);
    }
  }

  for (const a of alerts) {
    emitAlert(io, a);
  }

  return alerts;
}
