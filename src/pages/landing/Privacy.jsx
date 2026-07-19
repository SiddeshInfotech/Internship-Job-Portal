import React from 'react';
import { Helmet } from 'react-helmet-async';

const SECTIONS = [
  { title: 'Information We Collect', text: 'We collect information you provide directly — profile details, resumes, job postings — as well as usage data like login timestamps and application activity.' },
  { title: 'How We Use Your Information', text: 'Your data is used to match you with relevant opportunities or candidates, to improve the platform, and to communicate important account updates.' },
  { title: 'Data Sharing', text: 'Student data is shared only with companies you explicitly apply to. Company data is visible to students browsing verified job posts.' },
  { title: 'Data Security', text: 'We use industry-standard encryption and access controls to protect your data. Passwords are always stored hashed, never in plaintext.' },
  { title: 'Your Rights', text: 'You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.' },
  { title: 'Cookies', text: 'We use essential cookies to keep you logged in and understand basic usage patterns. We do not sell your data to third parties.' },
  { title: 'Changes to This Policy', text: 'We may update this policy periodically. Continued use of Placify after changes constitutes acceptance of the revised policy.' },
];

function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy — Placify</title></Helmet>

      <section className="pt-36 pb-14 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Privacy Policy</h1>
          <p className="text-slate-400">Last updated: January 2026</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">

          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{s.title}</h2>
                <p className="text-slate-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Privacy;
