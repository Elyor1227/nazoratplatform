import { Link } from 'react-router-dom';
import { isStaticMode } from '../config/staticMode.js';

export default function Landing() {
  const staticDemo = isStaticMode();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      {staticDemo && (
        <div className="relative z-10 border-b border-amber-500/30 bg-amber-950/40 px-6 py-2 text-center text-sm text-amber-200/90">
          Statik demo: backend o‘chirilgan — ma’lumotlar faqat brauzerda (yangilansa qayta tiklanadi).
        </div>
      )}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="font-display text-xl font-semibold tracking-tight text-white">QurilishNazorat</div>
        <Link
          to="/login"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
        >
          Tizimga kirish
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-brand-400">
          3 darajali davlat nazorati
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Qurilish korxonalari va nazorat organlari uchun yagona platforma
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Korxonalar hisobotlarini yuklaydi; GASN smeta bilan solishtiradi; soliq va mehnat inspeksiyalari
          real vaqtda signal va monitoring oladi.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Qurilish korxonasi',
              text: 'Xodimlar, ish haqi fondi, shartnoma, fakturalar — bitta hisobotda.',
            },
            { title: 'GASN', text: 'Smeta/loyiha va haqiqiy ko‘rsatkichlar taqqoslanadi.' },
            {
              title: 'Soliq va mehnat',
              text: 'Ish haqi va “nol” bandlik bo‘yicha avtomatik ogohlantirishlar.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-brand-500/30"
            >
              <h3 className="font-display text-lg font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
