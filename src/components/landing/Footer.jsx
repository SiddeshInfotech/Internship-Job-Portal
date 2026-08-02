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
    <footer className="relative bg-[#0B1526] text-slate-300 pt-20 pb-8 overflow-hidden z-10">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Signature ember line along the top edge */}
      <div 
        className="absolute top-0 inset-x-0 h-[3px] shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
        style={{ background: 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)' }} 
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 relative">
        
        {/* Column 1: Brand & Socials */}
        <div className="lg:col-span-4 flex flex-col pr-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
              <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Placify
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">
            From campus to career — bridging the gap between ambitious students and forward-thinking companies on one intelligent platform.
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
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Company */}
        <div className="lg:col-span-2">
          <FooterCol title="Company" links={[
            { label: 'About Us', to: '/about' },
            { label: 'For Students', to: '/for-students' },
            { label: 'For Companies', to: '/for-companies' },
            { label: 'Contact', to: '/contact' },
          ]} />
        </div>

        {/* Column 3: Quick Links */}
        <div className="lg:col-span-2">
          <FooterCol title="Quick Links" links={[
            { label: 'Find Jobs', to: '/find-jobs' },
            { label: 'Company Login', to: '/company/login' },
            { label: 'Register', to: '/register' },
          ]} />
        </div>

        {/* Column 4: Resources & Newsletter */}
        <div className="lg:col-span-4 flex flex-col">
          <FooterCol title="Resources" links={[
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms & Conditions', to: '/terms' },
          ]} />
          
         
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} Placify. All rights reserved.</p>
        <p className="flex items-center gap-1.5 bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-800/50">
          Made with <span className="text-[#F59E0B] animate-pulse">✦</span> for campus placements
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-5 text-sm tracking-wide">{title}</h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link 
              to={l.to} 
              className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              <span className="w-0 h-0.5 bg-[#F59E0B] mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300 ease-out" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;