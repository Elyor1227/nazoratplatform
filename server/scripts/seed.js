/**
 * Bir martalik test foydalanuvchilari.
 * Har bir email uchun parol: server/.env dagi SEED_PASSWORD_<ROL> (pastda ro‘yxat).
 * Agar alohida kalit bo‘lmasa — SEED_PASSWORD, u ham bo‘lmasa demo1234.
 * Ishga tushirish: npm run seed (rootdan) yoki node server/scripts/seed.js
 */
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });
import mongoose from 'mongoose';
import { User, ROLES } from '../src/models/User.js';
import { Application, APPLICATION_STATUS } from '../src/models/Application.js';
import { WORK_VOLUME_KEYS, LABEL_BY_KEY } from '../src/utils/objectRegistration.js';

function demoWorkVolumes() {
  const units = ['soat', 'kVt·soat', 'litr', 't', 't', 'm3', 'm3', 'm3', 'ming.dona', 'so‘m', 'koef.'];
  return WORK_VOLUME_KEYS.map((key, i) => ({
    key,
    labelUz: LABEL_BY_KEY[key],
    unit: units[i] || '—',
    volume: 10 + i * 3,
    pricePerUnit: 100000 + i * 5000,
  }));
}

const demoReg = {
  registrationSummary: {
    materials: 100000000,
    equipment: 20000000,
    machinery: 15000000,
    wages: 80000000,
    otherExpenses: 5000000,
    vat: 12000000,
  },
  registrationEmployeeCount: 12,
  workVolumes: demoWorkVolumes(),
};

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soliqnazorat';

/** Har bir email uchun .env kaliti (qiymat — parol matni) */
const PASSWORD_ENV_BY_EMAIL = {
  'company@demo.uz': 'SEED_PASSWORD_COMPANY',
  'gasn@demo.uz': 'SEED_PASSWORD_GASN',
  'soliq@demo.uz': 'SEED_PASSWORD_SOLIQ',
  'mehnat@demo.uz': 'SEED_PASSWORD_MEHNAT',
};

function resolvePlainPassword(email) {
  const envKey = PASSWORD_ENV_BY_EMAIL[email];
  const specific = envKey ? process.env[envKey] : '';
  const globalFallback = process.env.SEED_PASSWORD || 'demo1234';
  return (specific && String(specific).trim()) || globalFallback;
}

const users = [
  {
    email: 'company@demo.uz',
    role: ROLES.CONSTRUCTION_COMPANY,
    organizationName: 'Demo Qurilish MCHJ',
  },
  {
    email: 'gasn@demo.uz',
    role: ROLES.GASN,
    fullName: 'DAQNI inspektor',
  },
  {
    email: 'soliq@demo.uz',
    role: ROLES.TAX_INSPECTION,
    fullName: 'Soliq inspektor',
  },
  {
    email: 'mehnat@demo.uz',
    role: ROLES.LABOR_INSPECTION,
    fullName: 'Mehnat inspektor',
  },
];

await mongoose.connect(mongoUri);

for (const u of users) {
  const plain = resolvePlainPassword(u.email);
  const passwordHash = await bcrypt.hash(plain, 10);
  await User.findOneAndUpdate(
    { email: u.email },
    {
      email: u.email,
      passwordHash,
      role: u.role,
      organizationName: u.organizationName || '',
      fullName: u.fullName || '',
    },
    { upsert: true }
  );
  console.log('OK:', u.email);
}

const company = await User.findOne({ email: 'company@demo.uz' });
const gasn = await User.findOne({ email: 'gasn@demo.uz' });
if (company?._id) {
  await Application.deleteMany({ companyUserId: company._id });
  await Application.insertMany([
    {
      companyUserId: company._id,
      objectName: "42-maktab yangi binosi",
      notes: '',
      status: APPLICATION_STATUS.PENDING,
      gasnInspectorFio: '',
      attachments: [],
      ...demoReg,
    },
    {
      companyUserId: company._id,
      objectName: 'Markaziy poliklinika rekonstruksiyasi',
      notes: '',
      status: APPLICATION_STATUS.PENDING,
      gasnInspectorFio: 'Karimov A.A.',
      attachments: [],
      ...demoReg,
    },
    {
      companyUserId: company._id,
      objectName: 'Sport majmuasi',
      notes: 'Namuna',
      status: APPLICATION_STATUS.APPROVED,
      gasnInspectorFio: 'Tursunov B.B.',
      reviewedByUserId: gasn?._id || null,
      attachments: [],
      ...demoReg,
    },
  ]);
  console.log('OK: demo arizalar (3)');
}

await mongoose.disconnect();
console.log('Seed tugadi.');
