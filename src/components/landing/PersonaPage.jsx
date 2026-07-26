import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import AnimatedSection from './AnimatedSection';
import Magnetic from './Magnetic';

/* Shared template for the "For Students" / "For Companies" pages —
   same runway design language as Home, different content per persona. */
function PersonaPage({ meta, hero, checklist, benefits, benefitsTitle, benefitsKicker, cta, accent = '#F59E0B' }) {
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>{meta.title}</title></Helmet>

      {/* ============ HERO ============ */}
      <section className="pt-40 pb-24 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: accent }}>{hero.kicker}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.08]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            {hero.titleStart}{' '}
            <span className="font-serif-accent font-normal" style={{ color: accent }}>{hero.titleAccent}</span>
            {hero.titleEnd ? <> {hero.titleEnd}</> : null}
          </h1>
          <p className="text-slate-300/90 text-lg mb-9 leading-relaxed">{hero.sub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(245,158,11,0.45)' }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate(hero.primary.to)}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold shadow-lift inline-flex items-center justify-center gap-2"
              >
                {hero.primary.label}
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Magnetic>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(hero.secondary.to)}
              className="px-8 py-4 rounded-2xl bg-white/[0.08] border border-white/25 backdrop-blur-md text-white font-bold hover:bg-white/[0.14] transition-colors"
            >
              {hero.secondary.label}
            </motion.button>
          </div>

          {/* proof checklist */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {checklist.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.12 }}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300/85"
              >
                <span className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-[#0B1526]" style={{ background: accent }}>
                  <FiCheck />
                </span>
                {item}
              </motion.span>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: accent }}>{benefitsKicker}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              {benefitsTitle}
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.08}>
                <div className="lp-tile p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] border border-[#cdddfb] text-[#1D4ED8] flex items-center justify-center mb-5">
                    <b.icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-2">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <AnimatedSection className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            {cta.titleStart} <span className="font-serif-accent font-normal" style={{ color: accent }}>{cta.titleAccent}</span>
          </h2>
          <p className="text-slate-300/85 mb-9">{cta.sub}</p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(245,158,11,0.45)' }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate(cta.to)}
            className="px-9 py-4 rounded-2xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold shadow-lift"
          >
            {cta.label}
          </motion.button>
        </AnimatedSection>
      </section>
    </>
  );
}

export default PersonaPage;
