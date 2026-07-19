import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiClock, FiChevronDown } from 'react-icons/fi';
import AnimatedSection from '../../components/landing/AnimatedSection';
import { useToast } from '../../context/ToastContext';
import publicAxios from '../../api/publicAxios';

const FAQS = [
  { q: 'How soon will I get a response?', a: 'Our team typically replies within 1-2 business days.' },
  { q: 'Can I request a demo for my institute?', a: 'Yes — mention "Institute Demo" in your message and we\'ll reach out to schedule one.' },
];

function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await publicAxios.post('/contact', form);
      showToast("Thanks for reaching out! We'll get back to you soon.", 'success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us — Placify</title></Helmet>

      <section className="pt-40 pb-20 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-4">Contact</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Let's <span className="font-serif-accent font-normal text-[#F59E0B]">talk.</span></h1>
          <p className="text-slate-200/90 text-lg">Questions about Placify? We'd love to hear from you.</p>
        </AnimatedSection>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
          <AnimatedSection className="lg:col-span-3 lp-tile p-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-6" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Send us a message</h2>
            {error && <div className="pf-alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={update('name')} required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow" />
              <input type="email" value={form.email} onChange={update('email')} required placeholder="Your email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow" />
              <textarea value={form.message} onChange={update('message')} required rows={5} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow resize-none" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={submitting} type="submit" className="px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold shadow-lift disabled:opacity-60">
                {submitting ? 'Sending...' : 'Send message'}
              </motion.button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-soft border border-slate-100 h-56">
              <iframe
                title="Placify HQ — Dhule, Maharashtra"
                src="https://www.google.com/maps?q=Dhule,+Maharashtra,+India&z=13&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <ContactInfoRow icon={<FiMapPin />} label="Office" value="4th Floor, Placify HQ, Dhule, Maharashtra, India" />
            <ContactInfoRow icon={<FiPhone />} label="Phone" value="+91 98765 43210" />
            <ContactInfoRow icon={<FiMail />} label="Email" value="hello@placify.com" />
            <ContactInfoRow icon={<FiClock />} label="Working Hours" value="Mon – Sat, 9:00 AM – 6:00 PM IST" />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-10"><h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>Quick Answers</h2></AnimatedSection>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={f.q} className="lp-tile overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#0F172A]">
                  {f.q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }}><FiChevronDown /></motion.span>
                </button>
                <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-slate-600 text-sm">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactInfoRow({ icon, label, value }) {
  return (
    <div className="lp-tile p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#cdddfb] text-[#1D4ED8] flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

export default Contact;
