/** DAQN (Davlat arxitektura-qurilish nazorat inspeksiyasi) dashboard mock ma’lumotlar */

export const ORG_FULL_NAME = "Davlat arxitektura-qurilish nazorat inspeksiyasi";
export const ORG_SHORT = "DAQNI";

export const kpiMain = {
  jamiArizalar: 1240,
  maqullangan: 982,
  radEtilgan: 47,
  yakunlanganObyektlar: 412,
  davomEtotgan: 318,
  toxtatilgan: 12,
  umumiyLoyihaQiymati: "12 450 mlrd so‘m",
  umumiyIshHaqiFondi: "3 210 mlrd so‘m",
  umumiyIshchilar: 18420,
  smetaNomuvofiqlik: 37,
};

/** Toifa bo‘yicha obyekt nomlari (grafikda ko‘rinadi) */
export const obyektlarToifaBoYicha = [
  {
    toifa: "Ko‘p qavatli uylar",
    rang: "#22d3ee",
    obyektlar: ["Navro‘z MFY 12-uy", "Yangi hayot turar massivi 3-bino", "Markaziy ko‘cha 45-uy"],
  },
  {
    toifa: "O‘quv obyekti / maktablar",
    rang: "#34d399",
    obyektlar: ["42-maktab yangi binosi", "Xo‘jaobod maktabi", "Musiqa maktabi"],
  },
  {
    toifa: "Bog‘cha",
    rang: "#60a5fa",
    obyektlar: ["MTM Bog‘ishamol", "4-bog‘cha rekonstruksiya"],
  },
  {
    toifa: "Tibbiyot",
    rang: "#f472b6",
    obyektlar: ["Markaziy poliklinika", "Tuman kasalxonasi", "Asaka tibbiyot punkti"],
  },
  {
    toifa: "Sport",
    rang: "#fbbf24",
    obyektlar: ["Sport majmuasi (yangi)", "Yoshlar sport saroyi"],
  },
  {
    toifa: "Boshqa",
    rang: "#a78bfa",
    obyektlar: ["Avtoturargoh", "Administrativ bino"],
  },
];

export const faolObektlar = [
  {
    name: "42-maktab yangi binosi",
    manzil: "Andijon sh., Navro‘z ko‘chasi",
    pudratchi: "Baraka Qurilish LLC",
    inn: "307123456",
    smeta: 2400,
    haqiqiy: 2380,
    ihSmeta: 920,
    ihHaqiqiy: 905,
    xodimSmeta: 40,
    xodimHaqiqiy: 38,
    xodim: 38,
    kamera: true,
    progress: 72,
    holat: "b-blue",
    holatTxt: "Qurilmoqda",
  },
  {
    name: "Markaziy poliklinika rekonstr.",
    manzil: "Asaka t., Mustaqillik ko‘chasi",
    pudratchi: "Sharq Build Group",
    inn: "307654321",
    smeta: 3100,
    haqiqiy: 2890,
    ihSmeta: 1180,
    ihHaqiqiy: 1120,
    xodimSmeta: 55,
    xodimHaqiqiy: 52,
    xodim: 52,
    kamera: true,
    progress: 85,
    holat: "b-green",
    holatTxt: "Yakunlanmoqda",
  },
  {
    name: "Sport majmuasi (yangi)",
    manzil: "Oltinko‘l t., Sport ko‘chasi",
    pudratchi: "Master Stroy UZ",
    inn: "307111222",
    smeta: 1800,
    haqiqiy: 2150,
    ihSmeta: 650,
    ihHaqiqiy: 780,
    xodimSmeta: 25,
    xodimHaqiqiy: 29,
    xodim: 29,
    kamera: false,
    progress: 45,
    holat: "b-red",
    holatTxt: "Tafovut!",
  },
  {
    name: "Maktabgacha ta'lim markazi",
    manzil: "Xo‘jaobod t., Bog‘ishamol",
    pudratchi: "Yangi Bino Servis",
    inn: "307987654",
    smeta: 900,
    haqiqiy: 870,
    ihSmeta: 340,
    ihHaqiqiy: 330,
    xodimSmeta: 14,
    xodimHaqiqiy: 14,
    xodim: 14,
    kamera: true,
    progress: 60,
    holat: "b-blue",
    holatTxt: "Qurilmoqda",
  },
];

export const obektlar = faolObektlar.map((o) => ({
  name: o.name,
  toifa: o.name.includes("maktab")
    ? "Maktab"
    : o.name.includes("poliklinika") || o.name.includes("kasalxona")
      ? "Tibbiyot"
      : o.name.includes("Sport")
        ? "Sport"
        : o.name.includes("ta'lim") || o.name.includes("MTM")
          ? "Bog‘cha"
          : "Boshqa",
  pudratchi: o.pudratchi,
  inn: o.inn,
  smeta: o.smeta,
  haqiqiy: o.haqiqiy,
  ihSmeta: o.ihSmeta,
  ihHaqiqiy: o.ihHaqiqiy,
  xodimSmeta: o.xodimSmeta,
  xodimHaqiqiy: o.xodimHaqiqiy,
  holat: o.holat,
  ht: o.holatTxt,
  kamera: o.kamera,
}));

export const taqqoslashData = [
  {
    name: "Sport majmuasi",
    pudratchi: "Master Stroy UZ",
    smeta: 1800,
    haqiqiy: 2150,
    ihSmeta: 650,
    ihHaqiqiy: 780,
    xodimSmeta: 25,
    xodimHaqiqiy: 29,
    status: "nomo",
    ht: "b-red",
    holatTxt: "Nomuvofiq",
  },
  {
    name: "42-maktab",
    pudratchi: "Baraka Qurilish LLC",
    smeta: 2400,
    haqiqiy: 2380,
    ihSmeta: 920,
    ihHaqiqiy: 905,
    xodimSmeta: 40,
    xodimHaqiqiy: 38,
    status: "ok",
    ht: "b-green",
    holatTxt: "Muvofiq",
  },
  {
    name: "Markaziy poliklinika",
    pudratchi: "Sharq Build Group",
    smeta: 3100,
    haqiqiy: 2890,
    ihSmeta: 1180,
    ihHaqiqiy: 1120,
    xodimSmeta: 55,
    xodimHaqiqiy: 52,
    status: "ok",
    ht: "b-green",
    holatTxt: "Muvofiq",
  },
];

export const hisobotRows = [
  { name: "Baraka Qurilish LLC", inn: "307123456", hisobot: 47, kamera: 38, aylanma: "1.2 mlrd", holat: "b-green", ht: "Muvofiq" },
  { name: "Sharq Build Group", inn: "307654321", hisobot: 52, kamera: 52, aylanma: "890 mln", holat: "b-green", ht: "Muvofiq" },
  { name: "Master Stroy UZ", inn: "307111222", hisobot: 29, kamera: 31, aylanma: "450 mln", holat: "b-yellow", ht: "Tafovut +2" },
];

/** Korxona nomi → hujjatlar ro‘yxati (yuklab olish demo) */
export const korxonaHujjatlari = {
  "Baraka Qurilish LLC": {
    inn: "307123456",
    hujjatlar: [
      { id: "d1", tur: "ariza", nom: "Qurilishga ruxsat arizasi", fayl: "ariza_2025.pdf" },
      { id: "d2", tur: "pdf", nom: "Loyiha-smeta (PDF)", fayl: "loyiha_smeta.pdf" },
      { id: "d3", tur: "ilova", nom: "Texnik hisob-kitob ilovalari", fayl: "ilovalar.zip" },
      { id: "d4", tur: "ozgartirilgan", nom: "O‘zgartirilgan loyiha (2-varaq)", fayl: "loyiha_v2.pdf" },
      { id: "d5", tur: "yakuniy", nom: "Yakuniy bajarish dalolatnomasi", fayl: "yakuniy_akt.pdf" },
    ],
  },
  "Sharq Build Group": {
    inn: "307654321",
    hujjatlar: [
      { id: "d1", tur: "ariza", nom: "Ariza", fayl: "ariza.pdf" },
      { id: "d2", tur: "pdf", nom: "Smeta PDF", fayl: "smeta.pdf" },
      { id: "d3", tur: "yakuniy", nom: "Yakuniy akt (loyiha)", fayl: "akt.pdf" },
    ],
  },
  "Master Stroy UZ": {
    inn: "307111222",
    hujjatlar: [
      { id: "d1", tur: "ariza", nom: "Ariza", fayl: "ariza.pdf" },
      { id: "d2", tur: "pdf", nom: "PDF hujjatlar to‘plami", fayl: "hujjatlar.pdf" },
    ],
  },
  "Yangi Bino Servis": {
    inn: "307987654",
    hujjatlar: [{ id: "d1", tur: "ariza", nom: "Ariza", fayl: "ariza.pdf" }],
  },
};

export const ogohlar = [
  { color: "#f87171", text: "Sport majmuasi — smeta +19%", sub: "Tekshiruv talab etiladi", time: "09:14" },
  { color: "#fbbf24", text: "Master Stroy hujjati ekspertizasiz", sub: "Qisman hujjatlar", time: "08:22" },
];

export const kameraData = [
  { obekt: "42-maktab yangi binosi", soni: 4, signal: "2 daq", aniqlangan: "38 ishchi", holat: "b-green", ht: "Online" },
  { obekt: "Markaziy poliklinika", soni: 6, signal: "5 daq", aniqlangan: "52 ishchi", holat: "b-green", ht: "Online" },
];

export function getBadgeClass(type) {
  const classes = {
    "b-red": "bg-red-500/10 text-red-400",
    "b-yellow": "bg-yellow-500/10 text-yellow-400",
    "b-green": "bg-green-500/10 text-green-400",
    "b-blue": "bg-blue-500/10 text-blue-400",
    "b-cyan": "bg-cyan-500/10 text-cyan-400",
  };
  return classes[type] || "bg-gray-500/10 text-gray-400";
}

export function diffVal(s, h) {
  const d = h - s;
  return { d, pct: s ? Math.round((Math.abs(d) / s) * 100) : 0 };
}
