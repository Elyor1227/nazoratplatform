import { Router } from 'express';
import { ProjectDocument } from '../models/ProjectDocument.js';
import { User, ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, loadUser);

router.get('/', async (req, res) => {
  if (req.user.role === ROLES.CONSTRUCTION_COMPANY) {
    const list = await ProjectDocument.find({ companyUserId: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ projects: list });
  }
  if (req.user.role === ROLES.GASN) {
    const list = await ProjectDocument.find().sort({ updatedAt: -1 }).limit(500).lean();
    return res.json({ projects: list });
  }
  return res.status(403).json({ error: 'Ruxsat yo\'q' });
});

router.post('/', requireRoles(ROLES.GASN), async (req, res) => {
  const {
    companyUserId,
    title,
    smetaEmployeeCount,
    smetaContractSum,
    smetaPayrollEstimate,
    notes,
  } = req.body;
  if (!companyUserId || !title) {
    return res.status(400).json({ error: 'companyUserId va title majburiy' });
  }
  const company = await User.findById(companyUserId);
  if (!company || company.role !== ROLES.CONSTRUCTION_COMPANY) {
    return res.status(400).json({ error: 'Noto\'g\'ri qurilish korxonasi' });
  }
  const project = await ProjectDocument.create({
    companyUserId,
    createdByUserId: req.user._id,
    title: String(title).trim(),
    smetaEmployeeCount: Number(smetaEmployeeCount) || 0,
    smetaContractSum: Number(smetaContractSum) || 0,
    smetaPayrollEstimate: Number(smetaPayrollEstimate) || 0,
    notes: notes ? String(notes) : '',
  });
  res.status(201).json({ project });
});

export default router;
