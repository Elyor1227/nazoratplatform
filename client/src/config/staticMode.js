/** Statik demo: backend va MongoDBsiz ishlaydi (faqat frontend). */
export function isStaticMode() {
  return import.meta.env.VITE_STATIC === 'true';
}
