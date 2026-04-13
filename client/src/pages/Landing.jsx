// import { Link } from 'react-router-dom';
// import { isStaticMode } from '../config/staticMode.js';

// export default function Landing() {
//   const staticDemo = isStaticMode();

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-slate-950">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950" />
//       <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
//       <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

//       {staticDemo && (
//         <div className="relative z-10 border-b border-amber-500/30 bg-amber-950/40 px-6 py-2 text-center text-sm text-amber-200/90">
//           Statik demo: backend o‘chirilgan — ma’lumotlar faqat brauzerda (yangilansa qayta tiklanadi).
//         </div>
//       )}
//       <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
//         <div className="font-display text-xl font-semibold tracking-tight text-white">QurilishNazorat</div>
//         <Link
//           to="/login"
//           className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
//         >
//           Tizimga kirish
//         </Link>
//       </header>

//       <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
//         <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-brand-400">
//           3 darajali davlat nazorati
//         </p>
//         <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
//           Qurilish korxonalari va nazorat organlari uchun yagona platforma
//         </h1>
//         <p className="mt-6 max-w-2xl text-lg text-slate-400">
//           Korxonalar hisobotlarini yuklaydi; GASN smeta bilan solishtiradi; soliq va mehnat inspeksiyalari
//           real vaqtda signal va monitoring oladi.
//         </p>

//         <div className="mt-14 grid gap-6 md:grid-cols-3">
//           {[
//             {
//               title: 'Qurilish korxonasi',
//               text: 'Xodimlar, ish haqi fondi, shartnoma, fakturalar — bitta hisobotda.',
//             },
//             { title: 'GASN', text: 'Smeta/loyiha va haqiqiy ko‘rsatkichlar taqqoslanadi.' },
//             {
//               title: 'Soliq va mehnat',
//               text: 'Ish haqi va “nol” bandlik bo‘yicha avtomatik ogohlantirishlar.',
//             },
//           ].map((c) => (
//             <div
//               key={c.title}
//               className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-brand-500/30"
//             >
//               <h3 className="font-display text-lg font-semibold text-white">{c.title}</h3>
//               <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.text}</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { isStaticMode } from '../config/staticMode.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const staticDemo = isStaticMode();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Particle animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeHandler = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = `rgba(0, 200, 255, ${Math.random() * 0.3 + 0.1})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP animations for text and cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.fromTo('.hero-title', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-subtitle', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-description', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-badge', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: 'back.out' }
      );

      // Cards stagger animation
      gsap.fromTo('.card-item', 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cards-grid',
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Canvas background — tun rejimida sezilarliroq */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-100"
      />
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-200/50 via-slate-100 to-slate-100 dark:from-brand-900/40 dark:via-slate-950 dark:to-slate-950" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl animate-pulse dark:bg-brand-500/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl animate-pulse delay-1000 dark:bg-cyan-500/10" />

      {staticDemo && (
        <div className="relative z-10 border-b border-amber-400/40 bg-amber-100/90 px-6 py-2 text-center text-sm text-amber-900 backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200/90">
          Statik demo: backend o‘chirilgan — ma’lumotlar faqat brauzerda (yangilansa qayta tiklanadi).
        </div>
      )}
      
      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div className="font-display text-xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
          SOF QURILISH 
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        <Link
          to="/login"
          className="group relative overflow-hidden rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-500 hover:scale-105 dark:shadow-brand-900/30"
        >
          <span className="relative z-10">Tizimga kirish</span>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-brand-500/20 to-brand-400/20" />
        </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
        <div className="hero-badge inline-block rounded-full bg-brand-500/15 px-4 py-1.5 text-sm font-medium text-brand-700 backdrop-blur-sm dark:bg-brand-500/10 dark:text-brand-400">
          ⚡ 3 darajali davlat nazorati
        </div>
        
        <h1 className="hero-title mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
          Qurilish korxonalari va nazorat organlari uchun
          <span className="text-brand-600 dark:text-brand-400"> yagona platforma</span>
        </h1>
        
        <p className="hero-description mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Korxonalar hisobotlarini yuklaydi; Davlat arxitektura-qurilish nazorat inspeksiyasi smeta bilan solishtiradi; soliq va mehnat inspeksiyalari
          real vaqtda signal va monitoring oladi.
        </p>

        <div className="cards-grid mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: '🏗️ Qurilish korxonasi',
              text: 'Xodimlar, ish haqi fondi, shartnoma, fakturalar — bitta hisobotda.',
              gradient: 'from-blue-500/20 to-cyan-500/20',
              icon: '🏗️'
            },
            { 
              title: '📊 Davlat arxitektura-qurilish nazorat inspeksiyasi', 
              text: 'Smeta/loyiha va haqiqiy ko‘rsatkichlar taqqoslanadi.',
              gradient: 'from-emerald-500/20 to-teal-500/20',
              icon: '📊'
            },
            {
              title: '⚖️ Soliq va mehnat',
              text: 'Ish haqi va “nol” bandlik bo‘yicha avtomatik ogohlantirishlar.',
              gradient: 'from-purple-500/20 to-pink-500/20',
              icon: '⚖️'
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className="card-item group relative rounded-2xl border border-slate-200 bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-brand-400/50 hover:shadow-xl dark:border-white/10 dark:hover:border-brand-500/30 dark:hover:shadow-brand-500/10"
              style={{ backgroundImage: `linear-gradient(135deg, ${c.gradient}, transparent)` }}
            >
              <div className="absolute -top-3 -right-3 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                {c.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {c.text}
              </p>
              <div className="mt-4 flex items-center text-xs text-brand-600 opacity-0 transition-all group-hover:opacity-100 dark:text-brand-400">
                <span className="mr-1">→</span> Batafsil
              </div>
            </div>
          ))}
        </div>

        {/* Optional floating elements */}
        <div className="absolute left-10 bottom-20 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute right-20 top-40 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </main>
    </div>
  );
}