/** DAQN dashboard: faqat statistik KPI va namuna diagrammalar (statik demo). */

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

/** Toifa bo‘yicha obyekt nomlari (infografika — statik namuna) */
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
