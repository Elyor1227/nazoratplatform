/**
 * Bearer token bilan himoyalangan fayl/PDF ni blob orqali yuklab olish.
 */
export async function downloadBlob(api, relativePath, filename) {
  const res = await api.get(relativePath, { responseType: 'blob' });
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}
