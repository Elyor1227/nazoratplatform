import { Router } from 'express';
import { authRequired, loadUser, requireRoles } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';

const router = Router();

router.use(authRequired, loadUser);

/** Test/demo: DAQNI xodimlari ro‘yxati — arizaga biriktirish uchun */
export const GASN_INSPECTORS = [
  { id: '1', fio: 'Karimov A.A.', position: 'Bosh inspektor' },
  { id: '2', fio: 'Tursunov B.B.', position: 'Inspektor' },
  { id: '3', fio: 'Siddiqov J.J.', position: 'Katta inspektor' },
  { id: '4', fio: 'Rahimov D.D.', position: 'Inspektor' },
];

router.get('/inspectors', requireRoles(ROLES.GASN), (_req, res) => {
  res.json({ inspectors: GASN_INSPECTORS });
});

export default router;
