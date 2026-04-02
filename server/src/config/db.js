import mongoose from 'mongoose';

let memoryServer = null;

/**
 * @param {string} uri - To'liq Mongo URI yoki "memory" (mongodb-memory-server, faqat dev)
 */
export async function connectDb(uri) {
  mongoose.set('strictQuery', true);
  let connectUri = uri;

  if (uri === 'memory') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const base = memoryServer.getUri().replace(/\/$/, '');
    connectUri = `${base}/soliqnazorat`;
    console.log('[db] Vaqtinchalik MongoDB (RAM): ma\'lumotlar server jarayoni tugaganda yo\'qoladi; `npm run seed` alohida ishlamaydi.');
    console.log('[db] Doimiy ishlatish: Docker (`docker compose up -d`) yoki .env da MONGODB_URI.');
  }

  await mongoose.connect(connectUri);
}

export async function disconnectDb() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
