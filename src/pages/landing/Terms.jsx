import React from 'react';
import { Helmet } from 'react-helmet-async';

const SECTIONS = [
  { id: 'eligibility', title: 'Eligibility', text: 'You must be a currently enrolled student, an authorized company representative, or a partner institute administrator to use Placify.' },
  { id: 'accounts', title: 'Accounts', text: 'You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.' },
  { id: 'privacy', title: 'Privacy', text: 'Your use of Placify is also governed by our Privacy Policy, which describes how we collect, use, and protect your data.' },
  { id: 'data', title: 'Data', text: 'Profile, resume, and application data you submit may be shared with the specific companies you apply to, and with your partner institute for placement tracking.' },
  { id: 'recruitment', title: 'Recruitment', text: 'Companies agree to use candidate data solely for legitimate recruitment purposes and not for any other commercial use.' },
  { id: 'company-rules', title: 'Company Rules', text: 'All job postings must be accurate, legally compliant, and free of discriminatory requirements. Placify reserves the right to reject or remove postings that violate this.' },
  { id: 'termination', title: 'Termination', text: 'Placify may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform.' },
  { id: 'disclaimer', title: 'Disclaimer', text: 'Placify facilitates connections between students and companies but does not guarantee employment outcomes or job offers.' },
  { id: 'governing-law', title: 'Governing Law', text: 'These terms are governed by the laws of India, without regard to conflict of law principles.' },
];

function Terms() {
  return (
    <>
      <Helmet><title>Terms & Conditions — Placify</title></Helmet>

      <section className="pt-36 pb-14 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Terms & Conditions</h1>
          <p className="text-slate-400">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <aside className="md:col-span-1">
            <div className="sticky top-28 lp-tile p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">On this page</p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="text-sm text-slate-600 hover:text-[#1D4ED8] py-1.5 transition-colors">{s.title}</a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="md:col-span-3 lp-tile p-8 md:p-10 space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-28">
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

export default Terms;
