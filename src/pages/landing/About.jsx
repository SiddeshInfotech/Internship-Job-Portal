import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import CountUp from '../../utils/safeCountUp';
import { FiTarget, FiEye, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import AnimatedSection from '../../components/landing/AnimatedSection';
import ScrollGlider from '../../components/landing/ScrollGlider';

const IMPACT_STATS = [
  { label: 'Student Success Rate', value: 92, suffix: '%' },
  { label: 'Total Placements', value: 800, suffix: '+' },
  { label: 'Active Recruiters', value: 350, suffix: '+' },
  { label: 'Partner Institutes', value: 60, suffix: '+' },
];

const TIMELINE = [
  { year: '2023', text: 'Placify founded with a mission to modernize campus placements.' },
  { year: '2024', text: 'Crossed 1,000 students placed across 100+ partner companies.' },
  { year: '2025', text: 'Launched AI-powered resume screening and shortlisting.' },
  { year: '2026', text: 'Expanded to 60+ institutes with a fully integrated placement suite.' },
];

const TEAM = [
  { name: 'Lazymoon (Suher)' },
  { name: 'Zakariya Shaikh' },
  { name: 'Abhijit Patil' },
  { name: 'Neeraj Sonawane' },
  { name: 'Sami Ansari' },
];

const FAQS = [
  { q: 'Is Placify free for students?', a: 'Yes — creating a profile, building your resume, and applying to jobs is completely free for students.' },
  { q: 'How are companies verified?', a: 'Every company undergoes manual review by our admin team before their job posts go live to students.' },
  { q: 'Can institutes partner with Placify?', a: 'Yes, reach out via our Contact page and our partnerships team will walk you through onboarding.' },
];

function TeamPhoto({ name }) {
  const [failed, setFailed] = useState(false);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (failed) {
    return <div className="w-20 h-20 mx-auto lp-avatar-spin rounded-full bg-gradient-to-br from-[#2563EB] to-[#0B1526] flex items-center justify-center text-2xl font-bold text-white mb-4">{name.charAt(0)}</div>;
  }
  return (
    <img
      src={`/images/team/${slug}.jpg`}
      alt={name}
      onError={() => setFailed(true)}
      className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
    />
  );
}

function About() {
  const [openFaq, setOpenFaq] = useState(null);

  // Cursor spotlight: track the pointer inside any hovered tile and expose
  // its position as CSS vars the ::before gradient follows.
  const handleSpot = (e) => {
    const tile = e.target.closest('.lp-tile');
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    tile.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="lp-spot-scope" onPointerMove={handleSpot}>
      <ScrollGlider />
      <Helmet><title>About Us — Placify</title></Helmet>

      <section className="relative pt-40 pb-24 lp-sky overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-4">About Placify</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight leading-[1.08]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Built to modernize <span className="font-serif-accent font-normal text-[#F59E0B]">campus placements.</span>
          </h1>
          <p className="text-slate-300/90 text-lg">We're on a mission to close the gap between talented students and the companies that need them.</p>
        </AnimatedSection>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <AnimatedSection className="lp-tile p-10">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center mb-5"><FiTarget size={22} /></div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">To give every student a fair, transparent shot at their dream role, and every company a faster path to the right talent — powered by intelligent matching, not spreadsheets.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="lp-tile p-10">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center mb-5"><FiEye size={22} /></div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">A placement season that feels organized, data-driven, and genuinely exciting — for students, recruiters, and institutes alike.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>The runway so <span className="font-serif-accent font-normal text-[#2563EB]">far.</span></h2>
          </AnimatedSection>
          <div className="relative space-y-9 pl-9">
            {/* the runway rail — blue at takeoff, amber at today */}
            <div className="absolute left-[7px] top-1 bottom-1 w-[3px] rounded-full" style={{ background: 'linear-gradient(180deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)' }} />
            {TIMELINE.map((t, i) => {
              const isLast = i === TIMELINE.length - 1;
              return (
                <AnimatedSection key={t.year} delay={i * 0.1} className="relative">
                  <div
                    className="absolute -left-[35px] top-1 w-[17px] h-[17px] rounded-full border-[3px] border-white shadow-md"
                    style={{ background: isLast ? '#f59e0b' : '#0b1526', boxShadow: isLast ? '0 0 0 4px rgba(245,158,11,0.2)' : undefined }}
                  />
                  <p className="text-sm font-extrabold text-[#F59E0B] mb-1 tabular-nums" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{t.year}</p>
                  <p className="text-slate-600 leading-relaxed">{t.text}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Our Impact</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {IMPACT_STATS.map((s) => (
              <div key={s.label} className="text-center lp-tile p-6">
                <h3 className="text-3xl font-extrabold text-[#0F172A] tabular-nums" style={{ fontFamily: 'Sora, Inter, sans-serif' }}><CountUp end={s.value} duration={2} enableScrollSpy scrollSpyOnce />{s.suffix}</h3>
                <p className="text-sm text-slate-500 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Meet the Team</h2></AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {TEAM.map((m, i) => (
              <AnimatedSection key={m.name} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6 }} className="lp-tile p-6 text-center">
                  <TeamPhoto name={m.name} />
                  <h3 className="font-bold text-[#0F172A]">{m.name}</h3>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Frequently Asked Questions</h2></AnimatedSection>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={f.q} className="lp-tile overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#0F172A]">
                  {f.q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }}><FiChevronDown /></motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-slate-600 text-sm">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lp-sky text-center relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <AnimatedSection className="relative z-10 max-w-2xl mx-auto px-6">
          <FiCheckCircle className="text-[#F59E0B] mx-auto mb-4" size={36} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Join the <span className="font-serif-accent font-normal text-[#F59E0B]">movement.</span></h2>
          <p className="text-slate-200/90">Be part of a smarter placement season, starting today.</p>
        </AnimatedSection>
      </section>
    </div>
  );
}

export default About;
