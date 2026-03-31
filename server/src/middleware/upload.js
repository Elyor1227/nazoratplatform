import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tmpDir = path.join(process.cwd(), 'uploads', 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tmpDir),
  filename: (_req, file, cb) => {
    const safe = String(file.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safe}`);
  },
});

export const uploadInvoices = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 15 },
});
