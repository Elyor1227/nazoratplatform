/** Obyekt ro'yxatga olish — xulosa va ishlar hajmi (client `objectRegistrationSchema.js` bilan mos) */

export const WORK_VOLUME_KEYS = [
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

export const LABEL_BY_KEY = {
  labor: 'Mehnat (ish kuchi) xarajatlari',
  electricity: 'Elektr energiyasi',
  fuel_lubricants: "Yoqilg‘i-moylash materiallari",
  metal: 'Metall',
  cement: 'Sement',
  sand: 'Qum',
  precast_concrete: "Yig‘ma temir-beton mahsulotlari",
  wood: 'Yog‘och materiallari (pilomaterial)',
  bricks: "G‘isht (zavodlar)",
  other_materials: 'Boshqa materiallar',
  risk_coefficient: 'Tavakkalchilik koeffitsienti',
};

function isNonNegNum(v) {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0;
}

function isNonNegInt(v) {
  return isNonNegNum(v) && Number.isInteger(v);
}

/**
 * @returns {{ ok: true, payload: object } | { ok: false, error: string }}
 */
export function parseRegistrationFromBody(body) {
  const rs = body?.registrationSummary;
  if (!rs || typeof rs !== 'object') {
    return { ok: false, error: "registrationSummary majburiy" };
  }
  const keys = ['materials', 'equipment', 'machinery', 'wages', 'otherExpenses', 'vat'];
  const outSummary = {};
  for (const k of keys) {
    const n = Number(rs[k]);
    if (!isNonNegNum(n)) {
      return { ok: false, error: `registrationSummary.${k} noto'g'ri (≥ 0 bo'lishi kerak)` };
    }
    outSummary[k] = n;
  }

  const emp = Number(body?.registrationEmployeeCount);
  if (!isNonNegInt(emp)) {
    return { ok: false, error: "registrationEmployeeCount butun son bo'lishi kerak (≥ 0)" };
  }

  const wv = body?.workVolumes;
  if (!Array.isArray(wv) || wv.length !== WORK_VOLUME_KEYS.length) {
    return { ok: false, error: `workVolumes ${WORK_VOLUME_KEYS.length} ta qator bo'lishi kerak` };
  }

  const outVol = [];
  for (let i = 0; i < WORK_VOLUME_KEYS.length; i++) {
    const expectedKey = WORK_VOLUME_KEYS[i];
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
    if (!isNonNegNum(volume)) {
      return { ok: false, error: `workVolumes[${i}]: ish hajmi noto'g'ri` };
    }
    if (!isNonNegNum(pricePerUnit)) {
      return { ok: false, error: `workVolumes[${i}]: birlik narxi noto'g'ri` };
    }
    const labelUz = String(row.labelUz ?? LABEL_BY_KEY[expectedKey] ?? '').trim() || LABEL_BY_KEY[expectedKey];
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
