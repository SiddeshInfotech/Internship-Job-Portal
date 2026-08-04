import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiArrowRight } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thanks for subscribing! (Newsletter API not connected yet)', 'success');
    setEmail('');
  };

  return (
    <footer className="relative bg-[#0B1526] text-slate-300 pt-16 pb-8 overflow-hidden">
      {/* signature ember line along the top edge */}
      <div className="absolute top-0 inset-x-0 h-[2.5px]" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10 relative">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="w-9 h-9 object-contain" />
            <span className="font-extrabold text-xl text-white tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Placify</span>
          </div>
          <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
            From campus to career — students and companies on one intelligent placement platform.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: FiFacebook, label: 'Facebook' },
              { Icon: FiTwitter, label: 'Twitter' },
              { Icon: FiLinkedin, label: 'LinkedIn' },
              { Icon: FiInstagram, label: 'Instagram' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:-translate-y-0.5 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Company" links={[
          { label: 'About Us', to: '/about' },
          { label: 'For Students', to: '/for-students' },
          { label: 'For Companies', to: '/for-companies' },
          { label: 'Contact', to: '/contact' },
        ]} />

        <FooterCol title="Quick Links" links={[
          { label: 'Find Jobs', to: '/find-jobs' },
          { label: 'Company Login', to: '/company/login' },
          { label: 'Register', to: '/register' },
        ]} />

        <div className="md:col-span-1">
          <FooterCol title="Resources" links={[
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms & Conditions', to: '/terms' },
          ]} />
          <h4 className="text-white font-semibold mb-3 mt-8 text-sm">Newsletter</h4>
          <p className="text-sm text-slate-400 mb-3">Placement tips and updates.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email for newsletter"
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-shadow"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white flex items-center justify-center flex-shrink-0 hover:brightness-110 active:scale-95 transition-all"
            >
              <FiArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Placify. All rights reserved.</span>
        <span className="flex items-center gap-1.5">
          Made with <span className="text-[#F59E0B]">✦</span> for campus placements
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-slate-400 hover:text-[#F59E0B] hover:pl-1 transition-all inline-block">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
