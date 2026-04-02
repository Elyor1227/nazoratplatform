/** JWT imzo va tekshirish uchun bir xil maxfiy kalit (productionda JWT_SECRET majburiy). */
export function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s && String(s).trim()) return String(s).trim();
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET muhit o\'zgaruvchisi majburiy');
  }
  console.warn('[auth] JWT_SECRET topilmadi — faqat development uchun vaqtinchalik kalit ishlatilmoqda. server/.env ga JWT_SECRET qo\'shing.');
  return '__nazoratplatform_dev_jwt_only__';
}
