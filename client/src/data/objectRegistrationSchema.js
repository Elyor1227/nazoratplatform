/** Obyektni ro'yxatdan o'tkazish: xulosa jadvali va ishlar hajmi (backend bilan mos) */

export const emptyRegistrationSummary = () => ({
  materials: '',
  equipment: '',
  machinery: '',
  wages: '',
  otherExpenses: '',
  vat: '',
});

export const SUMMARY_FIELD_META = [
  { key: 'materials', label: 'Qurilish materiallari va konstruksiyalari' },
  { key: 'equipment', label: 'Jihozlar' },
  { key: 'machinery', label: 'Mashina va mexanizmlar' },
  { key: 'wages', label: 'Ish haqi' },
  { key: 'otherExpenses', label: 'Boshqa xarajatlar' },
  { key: 'vat', label: "Qo‘shilgan qiymat soliqi (QQS)" },
];

/** Ишлар ҳажмлари рўйхати — qatorlar (komponent nomi) */
export const WORK_VOLUME_ROWS = [
  { key: 'labor', labelUz: 'Mehnat (ish kuchi) xarajatlari' },
  { key: 'electricity', labelUz: 'Elektr energiyasi' },
  { key: 'fuel_lubricants', labelUz: 'Yoqilg‘i-moylash materiallari' },
  { key: 'metal', labelUz: 'Metall' },
  { key: 'cement', labelUz: 'Sement' },
  { key: 'sand', labelUz: 'Qum' },
  { key: 'precast_concrete', labelUz: 'Yig‘ma temir-beton mahsulotlari' },
  { key: 'wood', labelUz: 'Yog‘och materiallari (pilomaterial)' },
  { key: 'bricks', labelUz: 'G‘isht (zavodlar)' },
  { key: 'other_materials', labelUz: 'Boshqa materiallar' },
  { key: 'risk_coefficient', labelUz: 'Tavakkalchilik koeffitsienti' },
];

export function emptyWorkVolumeRows() {
  return WORK_VOLUME_ROWS.map((r) => ({
    key: r.key,
    labelUz: r.labelUz,
    unit: '',
    volume: '',
    pricePerUnit: '',
  }));
}

function isValidNonNegNumber(v) {
  if (v === '' || v == null) return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
}

/** Barcha majburiy maydonlar to‘ldirilgan va raqamli (≥ 0) bo‘lsa true */
export function isRegistrationFormComplete({
  registrationSummary,
  registrationEmployeeCount,
  workVolumeRows,
}) {
  if (!registrationSummary) return false;
  for (const k of ['materials', 'equipment', 'machinery', 'wages', 'otherExpenses', 'vat']) {
    if (!isValidNonNegNumber(registrationSummary[k])) return false;
  }
  const ec = Number(registrationEmployeeCount);
  if (!Number.isFinite(ec) || ec < 0 || !Number.isInteger(ec)) return false;

  if (!workVolumeRows || workVolumeRows.length !== WORK_VOLUME_ROWS.length) return false;
  for (let i = 0; i < WORK_VOLUME_ROWS.length; i++) {
    const row = workVolumeRows[i];
    if (!row || row.key !== WORK_VOLUME_ROWS[i].key) return false;
    if (!String(row.unit || '').trim()) return false;
    if (!isValidNonNegNumber(row.volume)) return false;
    if (!isValidNonNegNumber(row.pricePerUnit)) return false;
  }
  return true;
}

export function buildRegistrationPayload(registrationSummary, registrationEmployeeCount, workVolumeRows) {
  return {
    registrationSummary: {
      materials: Number(registrationSummary.materials),
      equipment: Number(registrationSummary.equipment),
      machinery: Number(registrationSummary.machinery),
      wages: Number(registrationSummary.wages),
      otherExpenses: Number(registrationSummary.otherExpenses),
      vat: Number(registrationSummary.vat),
    },
    registrationEmployeeCount: Math.round(Number(registrationEmployeeCount)),
    workVolumes: workVolumeRows.map((r) => ({
      key: r.key,
      labelUz: WORK_VOLUME_ROWS.find((w) => w.key === r.key)?.labelUz || r.labelUz,
      unit: String(r.unit).trim(),
      volume: Number(r.volume),
      pricePerUnit: Number(r.pricePerUnit),
    })),
  };
}

/** Statik API va server bilan bir xil tekshiruv (server: `parseRegistrationFromBody`) */
const SERVER_WORK_KEYS = [
  'labor',
  'electricity',
  'fuel_lubricants',
  'metal',
  'cement',
  'sand',
  'precast_concrete',
  'wood',
  'bricks',
  'other_materials',
  'risk_coefficient',
];

export function validateRegistrationForApi(body) {
  const rs = body?.registrationSummary;
  if (!rs || typeof rs !== 'object') {
    return { ok: false, error: "registrationSummary majburiy" };
  }
  const keys = ['materials', 'equipment', 'machinery', 'wages', 'otherExpenses', 'vat'];
  const outSummary = {};
  for (const k of keys) {
    const n = Number(rs[k]);
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, error: `registrationSummary.${k} noto'g'ri (≥ 0 bo'lishi kerak)` };
    }
    outSummary[k] = n;
  }
  const emp = Number(body?.registrationEmployeeCount);
  if (!Number.isFinite(emp) || emp < 0 || !Number.isInteger(emp)) {
    return { ok: false, error: "registrationEmployeeCount butun son bo'lishi kerak (≥ 0)" };
  }
  const wv = body?.workVolumes;
  if (!Array.isArray(wv) || wv.length !== SERVER_WORK_KEYS.length) {
    return { ok: false, error: `workVolumes ${SERVER_WORK_KEYS.length} ta qator bo'lishi kerak` };
  }
  const outVol = [];
  for (let i = 0; i < SERVER_WORK_KEYS.length; i++) {
    const expectedKey = SERVER_WORK_KEYS[i];
    const row = wv[i];
    if (!row || String(row.key) !== expectedKey) {
      return { ok: false, error: `workVolumes[${i}].key "${expectedKey}" bo'lishi kerak` };
    }
    const unit = String(row.unit ?? '').trim();
    if (!unit) {
      return { ok: false, error: `workVolumes[${i}]: o'lchov birligi majburiy` };
    }
    const volume = Number(row.volume);
    const pricePerUnit = Number(row.pricePerUnit);
    if (!Number.isFinite(volume) || volume < 0) {
      return { ok: false, error: `workVolumes[${i}]: ish hajmi noto'g'ri` };
    }
    if (!Number.isFinite(pricePerUnit) || pricePerUnit < 0) {
      return { ok: false, error: `workVolumes[${i}]: birlik narxi noto'g'ri` };
    }
    const labelUz = String(row.labelUz ?? '').trim() || WORK_VOLUME_ROWS.find((w) => w.key === expectedKey)?.labelUz || '';
    outVol.push({
      key: expectedKey,
      labelUz,
      unit,
      volume,
      pricePerUnit,
    });
  }
  return {
    ok: true,
    payload: {
      registrationSummary: outSummary,
      registrationEmployeeCount: emp,
      workVolumes: outVol,
    },
  };
}
