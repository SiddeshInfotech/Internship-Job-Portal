import React from 'react';
import { FiCpu, FiClipboard, FiUsers, FiBarChart2 } from 'react-icons/fi';
import PersonaPage from '../../components/landing/PersonaPage';

const BENEFITS = [
  { icon: FiCpu, title: 'AI Screening', desc: 'Let smart matching surface your best-fit candidates first, automatically.' },
  { icon: FiClipboard, title: 'Manage Jobs', desc: 'Post, edit, and track every listing from one clean dashboard.' },
  { icon: FiUsers, title: 'Track Candidates', desc: "See every applicant's full profile, skills, and resume in one view." },
  { icon: FiBarChart2, title: 'Shortlist & Analytics', desc: 'Shortlist top talent and measure your hiring funnel in real time.' },
];

function CompanyLanding() {
  return (
    <PersonaPage
      meta={{ title: 'For Companies — Placify' }}
      hero={{
        kicker: 'For companies',
        titleStart: 'Hire placement-ready talent,',
        titleAccent: 'faster.',
        sub: 'Access a curated pool of pre-verified student profiles and run your whole recruitment funnel — post, screen, shortlist, offer — in one place.',
        primary: { label: 'Register your company', to: '/register' },
        secondary: { label: 'Company login', to: '/company/login' },
      }}
      checklist={['Admin-verified listings', 'Pre-screened profiles', 'One shared pipeline', 'Email every applicant']}
      benefitsKicker="What you get"
      benefitsTitle="Recruitment, without the busywork"
      benefits={BENEFITS}
      cta={{
        titleStart: 'Ready to start',
        titleAccent: 'hiring?',
        sub: 'Your next batch of interns and grads is already on Placify.',
        label: 'Register company',
        to: '/register',
      }}
    />
  );
}

export default CompanyLanding;
