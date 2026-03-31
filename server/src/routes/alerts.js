import { Router } from 'express';
import { Alert } from '../models/Alert.js';
import { ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, loadUser);

const INSPECTOR_ROLES = [ROLES.GASN, ROLES.TAX_INSPECTION, ROLES.LABOR_INSPECTION];

router.get('/', requireRoles(...INSPECTOR_ROLES), async (req, res) => {
  const { type, companyUserId } = req.query;
  const q = {};
  if (companyUserId) q.companyUserId = companyUserId;

  if (req.user.role === ROLES.TAX_INSPECTION) {
    q.type = type ? type : { $in: ['payroll_vs_contract', 'tax_payroll_anomaly'] };
  } else if (req.user.role === ROLES.LABOR_INSPECTION) {
    q.type = type ? type : { $in: ['zero_employees_suspicious'] };
  } else if (type) {
    q.type = type;
  }

  const alerts = await Alert.find(q).sort({ createdAt: -1 }).limit(300).lean();
  res.json({ alerts });
});

router.patch('/:id/ack', requireRoles(...INSPECTOR_ROLES), async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { acknowledged: true },
    { new: true }
  ).lean();
  if (!alert) return res.status(404).json({ error: 'Alert topilmadi' });
  req.app.get('io')?.emit('alert:ack', { alertId: alert._id });
  res.json({ alert });
});

export default router;
