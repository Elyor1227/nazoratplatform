import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { getJwtSecret } from '../config/jwtSecret.js';

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Token talab qilinadi' });
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Yaroqsiz token' });
  }
}

export async function loadUser(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('-passwordHash').lean();
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    req.user = user;
    next();
  } catch {
    return res.status(500).json({ error: 'Server xatosi' });
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }
    next();
  };
}
