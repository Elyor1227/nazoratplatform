import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectDb } from './config/db.js';
import { Report } from './models/Report.js';
import { getJwtSecret } from './config/jwtSecret.js';

import authRoutes from './routes/auth.js';
import reportsRoutes from './routes/reports.js';
import projectsRoutes from './routes/projects.js';
import compareRoutes from './routes/compare.js';
import alertsRoutes from './routes/alerts.js';
import dashboardRoutes from './routes/dashboard.js';
import applicationsRoutes from './routes/applications.js';
import gasnRoutes from './routes/gasn.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token yo\'q'));
  try {
    const payload = jwt.verify(token, getJwtSecret());
    socket.userId = payload.sub;
    socket.userRole = payload.role;
    next();
  } catch {
    next(new Error('Yaroqsiz token'));
  }
});

io.on('connection', (socket) => {
  const role = socket.userRole;
  socket.join(`role:${role}`);
  socket.join(`user:${socket.userId}`);
  socket.on('disconnect', () => {});
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/gasn', gasnRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server xatosi' });
});

const port = Number(process.env.PORT) || 5000;
/** `memory` = mongodb-memory-server (faqat tez sinov; seed alohida ulanmaydi). Aks holda mahalliy/cloud URI. */
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soliqnazorat';

try {
  await connectDb(mongoUri);
  await Report.syncIndexes().catch(() => {});
} catch (err) {
  console.error('\n[!] MongoDB ga ulanib bo\'lmadi:', err.message);
  console.error('\nYechimlar:');
  console.error('  • Docker: loyiha ildizida  docker compose up -d  (port 27017)');
  console.error('  • Yoki MongoDB o\'rnating va ishga tushiring.');
  console.error('  • Yoki .env da MONGODB_URI=... (masalan MongoDB Atlas).');
  console.error('  • Sinov uchun: MONGODB_URI=memory  (npm run seed shu bilan ishlamaydi)\n');
  process.exit(1);
}

server.listen(port, () => {
  console.log(`API: http://localhost:${port}`);
});
