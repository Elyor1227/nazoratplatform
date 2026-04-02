import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, ROLES } from '../models/User.js';
import { authRequired, loadUser } from '../middleware/auth.js';
import { getJwtSecret } from '../config/jwtSecret.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, role, organizationName, fullName } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password, role majburiy' });
  }
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ error: 'Noto\'g\'ri rol' });
  }
  if (role === ROLES.CONSTRUCTION_COMPANY && !organizationName) {
    return res.status(400).json({ error: 'Korxona uchun organizationName kiriting' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    role,
    organizationName: organizationName || '',
    fullName: fullName || '',
  });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: publicUser(user),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email va password majburiy' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.get('/me', authRequired, loadUser, (req, res) => {
  res.json({ user: req.user });
});

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, getJwtSecret(), { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    organizationName: user.organizationName,
    fullName: user.fullName,
  };
}

export default router;
