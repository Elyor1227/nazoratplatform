/**
 * Bir martalik test foydalanuvchilari (parol: demo1234).
 * Ishga tushirish: npm run seed (rootdan) yoki node server/scripts/seed.js
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, ROLES } from '../src/models/User.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soliqnazorat';

const users = [
  {
    email: 'company@demo.uz',
    password: 'demo1234',
    role: ROLES.CONSTRUCTION_COMPANY,
    organizationName: 'Demo Qurilish MCHJ',
  },
  {
    email: 'gasn@demo.uz',
    password: 'demo1234',
    role: ROLES.GASN,
    fullName: 'GASN inspektor',
  },
  {
    email: 'soliq@demo.uz',
    password: 'demo1234',
    role: ROLES.TAX_INSPECTION,
    fullName: 'Soliq inspektor',
  },
  {
    email: 'mehnat@demo.uz',
    password: 'demo1234',
    role: ROLES.LABOR_INSPECTION,
    fullName: 'Mehnat inspektor',
  },
];

await mongoose.connect(mongoUri);
const hash = await bcrypt.hash('demo1234', 10);

for (const u of users) {
  await User.findOneAndUpdate(
    { email: u.email },
    {
      email: u.email,
      passwordHash: hash,
      role: u.role,
      organizationName: u.organizationName || '',
      fullName: u.fullName || '',
    },
    { upsert: true }
  );
  console.log('OK:', u.email);
}

await mongoose.disconnect();
console.log('Seed tugadi.');
