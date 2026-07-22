import React from 'react';
import { FiFileText, FiActivity, FiTarget, FiUser } from 'react-icons/fi';
import PersonaPage from '../../components/landing/PersonaPage';

const BENEFITS = [
  { icon: FiFileText, title: 'Resume Builder', desc: 'Create a polished, recruiter-ready resume in minutes with guided templates.' },
  { icon: FiActivity, title: 'Track Applications', desc: "See every application's status in real time — no more guessing games." },
  { icon: FiTarget, title: 'Get Recommendations', desc: 'AI-matched job suggestions based on your skills and interests.' },
  { icon: FiUser, title: 'Profile Completion', desc: 'A guided profile wizard that makes sure recruiters see your best self.' },
];

function StudentLanding() {
  return (
    <PersonaPage
      meta={{ title: 'For Students — Placify' }}
      hero={{
        kicker: 'For students',
        titleStart: 'Your career,',
        titleAccent: 'one platform',
        titleEnd: 'away.',
        sub: 'Build your profile once, apply to verified companies in one click, and track every step from "Applied" to the offer letter.',
        primary: { label: 'Register as a student', to: '/student/register' },
        secondary: { label: 'Student login', to: '/student/login' },
      }}
      checklist={['Free forever', 'Google sign-in', 'Verified companies only', 'Live status tracking']}
      benefitsKicker="What you get"
      benefitsTitle="Everything you need to get placed"
      benefits={BENEFITS}
      cta={{
        titleStart: 'Ready to build your',
        titleAccent: 'profile?',
        sub: 'It takes less time than refreshing your email for a reply that never comes.',
        label: 'Register now',
        to: '/student/register',
      }}
    />
  );
}

export default StudentLanding;
