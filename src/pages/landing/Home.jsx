import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import CountUp from '../../utils/safeCountUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiCpu, FiGrid, FiSend, FiShield, FiActivity, FiMail, FiFileText, FiUsers, FiArrowRight, FiCheck } from 'react-icons/fi';

import AnimatedSection from '../../components/landing/AnimatedSection';
import ButterSection from '../../components/landing/ButterSection';
import Magnetic from '../../components/landing/Magnetic';
import JobCard from '../../components/landing/JobCard';
import publicAxios from '../../api/publicAxios';
import { asArray } from '../../api/asArray';
import { trustedCompanies, platformStats, features, studentTestimonials, companyTestimonials } from '../../utils/landingData';

/* Optional hero video layer — renders nothing if the file is missing. */
function HeroVideo() {
  const [videoOk, setVideoOk] = useState(true);
  if (!videoOk) return null;
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
      autoPlay muted loop playsInline
      poster="/images/hero-poster.jpg"
      onError={() => setVideoOk(false)}
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}

const ICON_MAP = { brain: FiCpu, dashboard: FiGrid, send: FiSend, shield: FiShield, track: FiActivity, mail: FiMail, resume: FiFileText, role: FiUsers };

function CompanyBadge({ name }) {
  const [failed, setFailed] = useState(false);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (failed) {
    return <span className="text-2xl font-bold text-slate-400/70 hover:text-[#0F172A] transition-colors">{name}</span>;
  }
  return (
    <img
      src={`/images/companies/${slug}.png`}
      alt={name}
      onError={() => setFailed(true)}
      className="h-8 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all"
    />
  );
}

/* ============================================================
   THE RUNWAY — signature element.
   An ascending blue→amber flight path from campus to career,
   drawn on load, with milestones popping in along the way.
   ============================================================ */
const RUNWAY_PATH = 'M 20 240 C 260 235, 480 205, 660 150 C 840 95, 1010 55, 1170 30';
const MILESTONES = {
  student: [
    { x: 20, y: 240, label: 'Register' },
    { x: 420, y: 216, label: 'Build profile' },
    { x: 780, y: 113, label: 'Apply' },
    { x: 1170, y: 30, label: 'Hired', final: true },
  ],
  company: [
    { x: 20, y: 240, label: 'Register' },
    { x: 420, y: 216, label: 'Get verified' },
    { x: 780, y: 113, label: 'Post jobs' },
    { x: 1170, y: 30, label: 'Hire talent', final: true },
  ],
};

function Runway({ persona }) {
  const points = MILESTONES[persona];
  return (
    <svg viewBox="0 0 1200 300" className="w-full h-auto overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="runway-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="55%" stopColor="#7c8cf8" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* faint full path (the route ahead) */}
      <path d={RUNWAY_PATH} fill="none" stroke="rgba(157,178,201,0.18)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />

      {/* the drawn journey */}
      <motion.path
        d={RUNWAY_PATH}
        fill="none"
        stroke="url(#runway-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        style={{ filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.35))' }}
      />

      <AnimatePresence mode="wait">
        <motion.g key={persona} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {points.map((p, i) => (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.5, type: 'spring', stiffness: 300, damping: 18 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              {p.final && <circle cx={p.x} cy={p.y} r="11" fill="rgba(245,158,11,0.5)" className="lp-pulse-ring" />}
              <circle cx={p.x} cy={p.y} r={p.final ? 8 : 5.5} fill={p.final ? '#f59e0b' : '#0b1526'} stroke={p.final ? '#fff' : '#7c8cf8'} strokeWidth="2.5" />
              <text
                x={p.x + (p.final ? -8 : 0)}
                y={p.y - (p.final ? 22 : 18)}
                textAnchor={i === 0 ? 'start' : p.final ? 'end' : 'middle'}
                className="hidden sm:block"
                fill={p.final ? '#f59e0b' : '#9db2c9'}
                fontSize={p.final ? 17 : 13.5}
                fontWeight={p.final ? 800 : 600}
                fontFamily="Sora, Inter, sans-serif"
                letterSpacing="0.02em"
              >
                {p.label}
              </text>
            </motion.g>
          ))}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

/* Live "now hiring" ticker — real jobs from the API. Hidden when empty. */
function HiringTicker({ jobs }) {
  if (!jobs.length) return null;
  const items = [...jobs, ...jobs, ...jobs];
  return (
    <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-white/[0.04] backdrop-blur-sm py-3 lp-ticker-mask overflow-hidden">
      <div className="lp-ticker-track items-center gap-10 px-6">
        {items.map((job, i) => (
          <span key={i} className="flex items-center gap-2.5 text-[13px] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-white/45 font-semibold uppercase tracking-wider text-[10.5px]">Now hiring</span>
            <span className="text-white/90 font-semibold">{job.title}</span>
            <span className="text-white/40">@ {job.company_name || job.company}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const HERO_COPY = {
  student: {
    sub: 'Verified companies, one-click applications, and live status tracking — every opportunity on campus, in one place.',
    primary: { label: 'Start as a student', to: '/for-students' },
    secondary: { label: 'Browse live jobs', to: '/find-jobs' },
    login: { label: 'Student login', to: '/student/login' },
  },
  company: {
    sub: 'Post roles, screen pre-verified student profiles, and shortlist in days — not weeks of inbox archaeology.',
    primary: { label: 'Start hiring', to: '/for-companies' },
    secondary: { label: 'See how it works', to: '/register' },
    login: { label: 'Company login', to: '/company/login' },
  },
};

function Home() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState('student');
  const [latestJobs, setLatestJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await publicAxios.get('/jobs', { params: { limit: 6 } });
        setLatestJobs(asArray(res.data.jobs, res.data.results, res.data));
      } catch {
        // Public jobs preview is non-critical — fail silently and just show
        // an empty state rather than an error banner on the homepage.
        setLatestJobs([]);
      } finally {
        setJobsLoading(false);
      }
    })();
  }, []);

  const copy = HERO_COPY[persona];

  return (
    <MotionConfig reducedMotion="user">
      <Helmet>
        <title>Placify — India's Smart Internship & Placement Portal</title>
        <meta name="description" content="Connecting students and companies through one intelligent placement platform. AI resume screening, verified companies, real-time application tracking." />
        <meta property="og:title" content="Placify — Launch Your Career" />
        <meta property="og:description" content="India's smart internship & placement portal connecting students and companies." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ============ HERO: THE RUNWAY ============ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden lp-sky">
        <HeroVideo />
        <div className="absolute inset-0 lp-dotgrid" />

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto px-6 pt-32 pb-24">
          {/* Persona switch — the page adapts to who you are */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex justify-center mb-9"
          >
            <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-xl" role="tablist" aria-label="I am a">
              {[
                { key: 'student', label: "I'm a student" },
                { key: 'company', label: "I'm hiring" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  role="tab"
                  aria-selected={persona === opt.key}
                  onClick={() => setPersona(opt.key)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${persona === opt.key ? 'text-[#d97706]' : 'text-[#0B1526] hover:text-[#334155]'}`}
                >
                  {persona === opt.key && (
                    <motion.span
                      layoutId="persona-pill"
                      className="absolute inset-0 rounded-full shadow-sm"
                      style={{ background: 'linear-gradient(180deg, #fff5e6 0%, #ffe8c7 100%)', border: '1px solid #f7c66b' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center text-white font-extrabold leading-[1.06] tracking-tight text-[2.6rem] md:text-7xl mb-6"
            style={{ fontFamily: 'Sora, Inter, sans-serif' }}
          >
            From campus to{' '}
            <span className="font-serif-accent text-[#F59E0B] font-normal">career,</span>
            <br className="hidden md:block" /> without the chaos.
          </motion.h1>

          <div className="min-h-[3.5rem] mb-9">
            <AnimatePresence mode="wait">
              <motion.p
                key={persona}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed"
              >
                {copy.sub}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={persona}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(245,158,11,0.45)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(copy.primary.to)}
                    className="group px-8 py-4 rounded-2xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold text-base shadow-lift inline-flex items-center gap-2"
                  >
                    {copy.primary.label}
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(copy.secondary.to)}
                    className="px-8 py-4 rounded-2xl bg-white/[0.08] border border-white/25 backdrop-blur-md text-white font-bold text-base hover:bg-white/[0.14] transition-colors"
                  >
                    {copy.secondary.label}
                  </motion.button>
                </Magnetic>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-slate-400 mb-10">
            Already on Placify?{' '}
            <button onClick={() => navigate(copy.login.to)} className="text-[#F59E0B] font-semibold hover:underline underline-offset-4">
              {copy.login.label}
            </button>
          </p>

          {/* THE RUNWAY */}
          <div className="max-w-5xl mx-auto w-full px-2">
            <Runway persona={persona} />
          </div>
        </div>

        <HiringTicker jobs={latestJobs} />
      </section>

      {/* ============ BUTTER BAND: press the surface, follow the label ============ */}
      <ButterSection />

      {/* ============ STATS SEAM: glass cards stitched across the fold ============ */}
      <section className="relative bg-white pb-16">
        <div className="max-w-6xl mx-auto px-6 -mt-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -translate-y-10">
            {platformStats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-100 shadow-lift p-6 text-center">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tabular-nums" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                    <CountUp end={s.value} duration={2.2} enableScrollSpy scrollSpyOnce />{s.suffix}
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2 font-semibold">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* ============ TRUSTED COMPANIES ============ */}
        <AnimatedSection className="text-center mb-8">
          <p className="text-xs font-bold text-slate-400 tracking-[0.25em] uppercase">Trusted by teams at</p>
        </AnimatedSection>
        <div className="relative flex overflow-hidden lp-marquee-mask">
          <motion.div
            className="flex gap-16 pr-16 whitespace-nowrap items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          >
            {[...trustedCompanies, ...trustedCompanies].map((name, i) => (
              <CompanyBadge key={i} name={name} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ THE JOURNEY (runway, on the ground) ============ */}
      <section className="py-24 bg-[#F8FAFC] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-4">
            <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-3">The journey</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Four stops. <span className="font-serif-accent font-normal text-[#2563EB]">One runway.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection className="text-center mb-14">
            <p className="text-slate-500 max-w-xl mx-auto">
              {persona === 'student'
                ? 'No spreadsheets, no forwarded PDFs, no "did they see my resume?" Every step lives here.'
                : 'From first post to signed offer — a pipeline your whole team can see.'}
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MILESTONES[persona].map((m, i) => (
              <AnimatedSection key={`${persona}-${m.label}`} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="relative bg-white rounded-2xl p-7 shadow-soft h-full border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${m.final ? 'bg-[#F59E0B] text-white' : 'bg-[#0F172A] text-white'}`}
                      style={{ fontFamily: 'Sora, Inter, sans-serif' }}
                    >
                      {m.final ? <FiCheck /> : i + 1}
                    </span>
                    {i < 3 && <span className="hidden lg:block flex-1 ml-4 border-t-2 border-dashed border-slate-200" />}
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-1.5">{m.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {JOURNEY_COPY[persona][i]}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES: BENTO ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-3">Built in</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Everything you need. <span className="font-serif-accent font-normal text-[#2563EB]">Nothing you don't.</span>
            </h2>
            <p className="text-slate-500">A complete toolkit for both sides of the hiring table.</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:auto-rows-[minmax(150px,auto)]">
            {features.map((f, i) => {
              const Icon = ICON_MAP[f.icon] || FiGrid;
              const isHero = i === 0;
              return (
                <AnimatedSection key={f.title} delay={(i % 4) * 0.07} className={isHero ? 'sm:col-span-2 lg:row-span-2' : ''}>
                  <div className={`lp-tile h-full p-7 flex flex-col ${isHero ? 'justify-between' : ''}`}>
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] border border-[#cdddfb] flex items-center justify-center text-[#1D4ED8] mb-4">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-bold text-[#0F172A] mb-2 text-[15px]">{f.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>

                    {isHero && (
                      <div className="mt-8 space-y-2.5" aria-hidden="true">
                        {[
                          { name: 'Person 1', status: 'Shortlisted', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                          { name: 'Person 2', status: 'Interview', tone: 'bg-blue-50 text-blue-700 border-blue-200' },
                          { name: 'Person 3', status: 'In review', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
                        ].map((row, j) => (
                          <motion.div
                            key={row.name}
                            initial={{ opacity: 0, x: -14 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + j * 0.15 }}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3"
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[11px] font-bold flex items-center justify-center">{row.name.charAt(0)}</span>
                              <span className="text-sm font-semibold text-[#0F172A]">{row.name}</span>
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${row.tone}`}>{row.status}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6 lp-testimonials">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Word on <span className="font-serif-accent font-normal text-[#F59E0B]">campus.</span>
            </h2>
          </AnimatedSection>

          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500 }} pagination={{ clickable: true }} spaceBetween={30} className="pb-12">
            {[...studentTestimonials, ...companyTestimonials].map((t, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-3xl px-8 py-12 md:px-14 text-center shadow-soft border border-slate-100 relative">
                  <span className="font-serif-accent text-7xl text-[#F59E0B]/30 absolute top-4 left-8 leading-none select-none" aria-hidden="true">"</span>
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 relative">{t.quote}</p>
                  <span className="mx-auto mb-3 w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0B1526] text-white font-bold flex items-center justify-center">
                    {t.name.charAt(0)}
                  </span>
                  <p className="font-bold text-[#0F172A]">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ============ LATEST JOBS ============ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-3">Live now</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                Latest openings
              </h2>
            </div>
            <button
              onClick={() => navigate('/find-jobs')}
              className="group inline-flex items-center gap-2 font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors"
            >
              View all jobs <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </AnimatedSection>

          {jobsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading jobs">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-100 p-6">
                  <div className="pf-skeleton" style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 16 }} />
                  <div className="pf-skeleton" style={{ width: '65%', height: 15, marginBottom: 9 }} />
                  <div className="pf-skeleton" style={{ width: '40%', height: 12, marginBottom: 18 }} />
                  <div className="pf-skeleton" style={{ width: '100%', height: 38, borderRadius: 12 }} />
                </div>
              ))}
            </div>
          ) : latestJobs.length === 0 ? (
            <div className="text-center py-14 rounded-2xl border border-dashed border-slate-200 bg-[#F8FAFC]">
              <p className="text-slate-500 font-semibold mb-1">No openings posted yet.</p>
              <p className="text-sm text-slate-400">New roles land here the moment companies publish them — check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job, i) => (
                <AnimatedSection key={job.id} delay={(i % 3) * 0.1}>
                  <JobCard job={job} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ FINAL CTA: the runway completes ============ */}
      <section className="relative py-28 overflow-hidden lp-sky">
        <div className="absolute inset-0 lp-dotgrid" />
        <div className="absolute inset-x-0 bottom-0 opacity-60 pointer-events-none max-w-6xl mx-auto">
          <Runway persona={persona} />
        </div>
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Your runway is <span className="font-serif-accent font-normal text-[#F59E0B]">cleared.</span>
          </h2>
          <p className="text-slate-300/90 mb-10 text-lg">
            Join the students and companies already hiring, applying, and getting placed on Placify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(245,158,11,0.45)' }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/student/register')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold shadow-lift"
              >
                Register as a student
              </motion.button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-2xl bg-white text-[#0F172A] font-bold shadow-lift"
              >
                Register as a company
              </motion.button>
            </Magnetic>
          </div>
        </AnimatedSection>
      </section>
    </MotionConfig>
  );
}

const JOURNEY_COPY = {
  student: [
    'Create your free account with your college email or Google — under a minute.',
    'One profile with your skills, CGPA and resume. Every application reuses it.',
    'One click to apply to verified openings. No forms to refill, ever.',
    'Track every status change live — from "In review" to the offer letter.',
  ],
  company: [
    'Register your company and team in minutes with a guided setup.',
    'Get admin-verified so students know your openings are the real thing.',
    'Publish roles with eligibility criteria that filter applicants for you.',
    'Shortlist, schedule interviews and extend offers from one pipeline.',
  ],
};

export default Home;
