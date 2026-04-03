import path from 'path';
import fs from 'fs/promises';
import { Router } from 'express';
import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { ROLES } from '../models/User.js';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';
import { uploadInvoices as uploadFiles } from '../middleware/upload.js';

const router = Router();

const uploadRoot = path.join(process.cwd(), 'uploads');

async function cleanupTempFiles(files) {
  for (const f of files || []) {
    if (f?.path) await fs.unlink(f.path).catch(() => {});
  }
}

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
        attachments: a.attachments || [],
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

router.get('/:id/files/:storedName', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Ariza topilmadi' });
    const decoded = decodeURIComponent(req.params.storedName);
    const att = application.attachments?.find((x) => x.storedName === decoded);
    if (!att) return res.status(404).json({ error: 'Fayl topilmadi' });

    const role = req.userRole;
    const can =
      role === ROLES.GASN ||
      (role === ROLES.CONSTRUCTION_COMPANY && application.companyUserId.equals(req.user._id));
    if (!can) return res.status(403).json({ error: 'Ruxsat yo\'q' });

    const filePath = path.join(uploadRoot, 'applications', application._id.toString(), att.storedName);
    const resolved = path.resolve(filePath);
    const base = path.resolve(path.join(uploadRoot, 'applications', application._id.toString()));
    if (!resolved.startsWith(base)) return res.status(400).json({ error: 'Noto\'g\'ri yo\'l' });

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(att.fileName)}"`);
    res.sendFile(resolved, (err) => {
      if (err) next(err);
    });
  } catch (e) {
    next(e);
  }
});

router.post(
  '/:id/attachments',
  requireRoles(ROLES.CONSTRUCTION_COMPANY),
  uploadFiles.array('files', 20),
  async (req, res) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
      await cleanupTempFiles(req.files);
      return res.status(404).json({ error: 'Ariza topilmadi' });
    }
    if (!application.companyUserId.equals(req.user._id)) {
      await cleanupTempFiles(req.files);
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }
    const step = Number(req.body.step ?? req.query.step);
    if (![2, 3, 4, 5].includes(step)) {
      await cleanupTempFiles(req.files);
      return res.status(400).json({ error: 'step 2–5 bo\'lishi kerak' });
    }
    if (!(req.files || []).length) {
      return res.status(400).json({ error: 'Kamida bitta fayl yuklang' });
    }

    const destDir = path.join(uploadRoot, 'applications', application._id.toString());
    await fs.mkdir(destDir, { recursive: true });
    const newAtt = [];
    try {
      for (const file of req.files || []) {
        const dest = path.join(destDir, file.filename);
        await fs.rename(file.path, dest);
        newAtt.push({
          fileName: file.originalname,
          storedName: file.filename,
          step,
        });
      }
    } catch (e) {
      await cleanupTempFiles(req.files);
      throw e;
    }
    application.attachments = [...(application.attachments || []), ...newAtt];
    await application.save();
    res.json({ application });
  }
);

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
    return res.status(400).json({ error: 'Avval ro\'yxatdan DAQNI xodimini tanlang' });
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
