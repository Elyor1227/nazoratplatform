import { Router } from 'express';
import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, loadUser);

router.get('/', async (req, res) => {
  const role = req.userRole;

  if (role === ROLES.CONSTRUCTION_COMPANY) {
    const applications = await Application.find({ companyUserId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return res.json({ applications });
  }

  if (role === ROLES.GASN) {
    const list = await Application.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('companyUserId', 'organizationName email')
      .lean();

    const applications = list.map((a) => {
      const c = a.companyUserId;
      const cid = c && typeof c === 'object' ? c._id : a.companyUserId;
      return {
        _id: a._id,
        companyUserId: cid,
        organizationName: c?.organizationName || '',
        companyEmail: c?.email || '',
        objectName: a.objectName,
        notes: a.notes,
        status: a.status,
        gasnInspectorFio: a.gasnInspectorFio || '',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
    return res.json({ applications });
  }

  return res.status(403).json({ error: 'Ruxsat yo\'q' });
});

router.post('/', requireRoles(ROLES.CONSTRUCTION_COMPANY), async (req, res) => {
  const { objectName, notes } = req.body;
  if (objectName == null || !String(objectName).trim()) {
    return res.status(400).json({ error: 'objectName majburiy' });
  }
  const application = await Application.create({
    companyUserId: req.user._id,
    objectName: String(objectName).trim(),
    notes: notes != null ? String(notes).trim() : '',
    status: APPLICATION_STATUS.PENDING,
  });
  res.status(201).json({ application });
});

router.patch('/:id', requireRoles(ROLES.GASN), async (req, res) => {
  const { gasnInspectorFio } = req.body;
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Ariza topilmadi' });
  if (gasnInspectorFio !== undefined) {
    application.gasnInspectorFio = String(gasnInspectorFio).trim();
  }
  await application.save();
  res.json({ application });
});

router.post('/:id/approve', requireRoles(ROLES.GASN), async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Ariza topilmadi' });
  const fio = (req.body?.gasnInspectorFio ?? application.gasnInspectorFio ?? '').trim();
  if (!fio) {
    return res.status(400).json({ error: 'Avval DAQNI xodimi F.I.Sh. kiritilishi kerak' });
  }
  application.gasnInspectorFio = fio;
  application.status = APPLICATION_STATUS.APPROVED;
  application.reviewedByUserId = req.user._id;
  await application.save();
  res.json({ application });
});

router.post('/:id/reject', requireRoles(ROLES.GASN), async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Ariza topilmadi' });
  if (req.body?.gasnInspectorFio != null) {
    application.gasnInspectorFio = String(req.body.gasnInspectorFio).trim();
  }
  application.status = APPLICATION_STATUS.REJECTED;
  application.reviewedByUserId = req.user._id;
  await application.save();
  res.json({ application });
});

export default router;
