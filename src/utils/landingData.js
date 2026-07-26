// Placeholder content for the public marketing site. Once the backend
// exposes public endpoints (/api/jobs, /api/statistics, /api/testimonials),
// swap these out for real axios calls via src/services/.

export const trustedCompanies = [
  'Google', 'Infosys', 'TCS', 'Wipro', 'Microsoft', 'Amazon', 'IBM', 'Accenture',
];

export const platformStats = [
  { label: 'Students Registered', value: 5000, suffix: '+' },
  { label: 'Companies', value: 350, suffix: '+' },
  { label: 'Jobs Posted', value: 1200, suffix: '+' },
  { label: 'Successful Placements', value: 800, suffix: '+' },
];

export const features = [
  { icon: 'brain', title: 'AI Resume Screening', desc: 'Smart matching that surfaces the most relevant candidates for every role.' },
  { icon: 'dashboard', title: 'Smart Dashboard', desc: 'A unified view of applications, jobs, and hiring progress at a glance.' },
  { icon: 'send', title: 'Easy Job Applications', desc: 'One-click apply with a saved profile — no repeated form filling.' },
  { icon: 'shield', title: 'Verified Companies', desc: 'Every recruiter is manually reviewed before jobs go live.' },
  { icon: 'track', title: 'Application Tracking', desc: 'Real-time status updates from Applied to Offered.' },
  { icon: 'mail', title: 'Email Notifications', desc: 'Never miss a shortlist, interview, or offer update.' },
  { icon: 'resume', title: 'Resume Builder', desc: 'Build a polished, recruiter-ready resume in minutes.' },
  { icon: 'role', title: 'Role Based Dashboard', desc: 'Purpose-built views for students, companies, and admins.' },
];

export const studentTestimonials = [
  { name: 'Ananya Iyer', role: 'Software Engineer, TechNova', quote: 'I applied to 4 companies and had 2 offers within three weeks. The tracking dashboard kept me sane during interview season.' },
  { name: 'Rohan Das', role: 'Data Analyst, Insight Analytics', quote: 'The resume builder alone was worth signing up for. Recruiters actually commented on how clean it looked.' },
  { name: 'Priya Sharma', role: 'Product Trainee, Zomato', quote: 'Placify made the whole placement season feel organized instead of chaotic.' },
];

export const companyTestimonials = [
  { name: 'Karan Mehta', role: 'Talent Lead, Global Brands Inc.', quote: 'We cut our screening time in half. The AI shortlisting genuinely surfaces the right profiles first.' },
  { name: 'Divya Nair', role: 'HR Manager, Stellar Cloud Systems', quote: 'Posting a role and managing applicants finally feels like one connected workflow instead of five spreadsheets.' },
];

export const latestJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'TechNova Solutions', location: 'Bengaluru (Remote)', package: '₹15–18 LPA', type: 'Full-Time', experience: '3-5 yrs' },
  { id: 2, title: 'Product Design Intern', company: 'Stellar Cloud Systems', location: 'Mumbai', package: '₹25,000/mo', type: 'Internship', experience: '0-1 yrs' },
  { id: 3, title: 'Data Analyst', company: 'Insight Analytics', location: 'Pune (Hybrid)', package: '₹8–10 LPA', type: 'Full-Time', experience: '1-3 yrs' },
  { id: 4, title: 'Backend Engineer (Node.js)', company: 'Global Brands Inc.', location: 'Hyderabad', package: '₹12–16 LPA', type: 'Full-Time', experience: '2-4 yrs' },
  { id: 5, title: 'Marketing Associate', company: 'Creative Pulse', location: 'Remote', package: '₹6–8 LPA', type: 'Full-Time', experience: '0-2 yrs' },
  { id: 6, title: 'UX Research Intern', company: 'North Star Logistics', location: 'Delhi NCR', package: '₹20,000/mo', type: 'Internship', experience: '0-1 yrs' },
];
