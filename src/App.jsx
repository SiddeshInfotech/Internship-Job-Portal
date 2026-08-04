import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';

// Public marketing site
import PublicLayout from './layouts/PublicLayout';
const Home = lazy(() => import('./pages/landing/Home'));
const About = lazy(() => import('./pages/landing/About'));
const FindJobs = lazy(() => import('./pages/landing/FindJobs'));
const PublicJobDetail = lazy(() => import('./pages/landing/PublicJobDetail'));
const StudentLanding = lazy(() => import('./pages/landing/StudentLanding'));
const CompanyLanding = lazy(() => import('./pages/landing/CompanyLanding'));
const Contact = lazy(() => import('./pages/landing/Contact'));
const Terms = lazy(() => import('./pages/landing/Terms'));
const Privacy = lazy(() => import('./pages/landing/Privacy'));
const NotFound = lazy(() => import('./pages/landing/NotFound'));

const CompanyLogin = lazy(() => import('./pages/CompanyLogin'));
const CompanyRegister = lazy(() => import('./pages/CompanyRegister'));
const CompanyForgotPassword = lazy(() => import('./pages/CompanyForgotPassword'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const ManageStudents = lazy(() => import('./pages/ManageStudents'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const ManageCompanies = lazy(() => import('./pages/ManageCompanies'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const ManageJobPosts = lazy(() => import('./pages/ManageJobPosts'));
const JobPostDetail = lazy(() => import('./pages/JobPostDetail'));
const ManageApplications = lazy(() => import('./pages/ManageApplications'));
const ApplicationDetail = lazy(() => import('./pages/ApplicationDetail'));
const ReportsAnalytics = lazy(() => import('./pages/ReportsAnalytics'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

// Client (Company) side
import ProtectedClientRoute from './components/ProtectedClientRoute';
const ClientLayout = lazy(() => import('./pages/client/ClientLayout'));
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const ApplicantsLanding = lazy(() => import('./pages/client/ApplicantsLanding'));
const PostJob = lazy(() => import('./pages/client/PostJob'));
const JobsPosted = lazy(() => import('./pages/client/JobsPosted'));
const JobApplicants = lazy(() => import('./pages/client/JobApplicants'));
const ApplicantProfile = lazy(() => import('./pages/client/ApplicantProfile'));
const CompanyProfileOverview = lazy(() => import('./pages/client/CompanyProfileOverview'));
const CompanyProfileWizard = lazy(() => import('./pages/client/CompanyProfileWizard'));
const ClientSettings = lazy(() => import('./pages/client/ClientSettings'));
const ClientNotifications = lazy(() => import('./pages/client/ClientNotifications'));

// Student side
import ProtectedStudentRoute from './components/ProtectedStudentRoute';
const StudentLayout = lazy(() => import('./pages/student/StudentLayout'));
const StudentLogin = lazy(() => import('./pages/student/StudentLogin'));
const StudentRegister = lazy(() => import('./pages/student/StudentRegister'));
const StudentVerifyOtp = lazy(() => import('./pages/student/StudentVerifyOtp'));
const StudentForgotPassword = lazy(() => import('./pages/student/StudentForgotPassword'));
const StudentResetPassword = lazy(() => import('./pages/student/StudentResetPassword'));
const BrowseJobs = lazy(() => import('./pages/student/BrowseJobs'));
const JobDetail = lazy(() => import('./pages/student/JobDetail'));
const ApplyJob = lazy(() => import('./pages/student/ApplyJob'));
const AppliedStatus = lazy(() => import('./pages/student/AppliedStatus'));
const MyProfile = lazy(() => import('./pages/student/MyProfile'));
const Resumes = lazy(() => import('./pages/student/Resumes'));
const StudentSettings = lazy(() => import('./pages/student/StudentSettings'));
const StudentNotifications = lazy(() => import('./pages/student/StudentNotifications'));
const ProfileWizard = lazy(() => import('./pages/student/ProfileWizard'));
const StudentProfileOverview = lazy(() => import('./pages/student/StudentProfileOverview'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={40} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* 🌐 Public Marketing Site — "/" is now the real Home page */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/jobs/:id" element={<PublicJobDetail />} />
              <Route path="/for-students" element={<StudentLanding />} />
              <Route path="/for-companies" element={<CompanyLanding />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

            {/* Company Auth Routes — moved off "/" */}
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/register" element={<CompanyRegister />} />
            <Route path="/forgot" element={<CompanyForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student Auth */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/verify-otp" element={<StudentVerifyOtp />} />
            <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
            <Route path="/student/reset-password" element={<StudentResetPassword />} />

            {/* 🎓 Student Workspace Cluster — every page behind ProtectedStudentRoute */}
            <Route
              element={
                <ProtectedStudentRoute>
                  <StudentLayout />
                </ProtectedStudentRoute>
              }
            >
              <Route path="/student/browse-jobs" element={<BrowseJobs />} />
              <Route path="/student/jobs/:id" element={<JobDetail />} />
              <Route path="/student/jobs/:jobId/apply" element={<ApplyJob />} />
              <Route path="/student/applications" element={<AppliedStatus />} />
              <Route path="/student/profile" element={<MyProfile />} />
              <Route path="/student/profile-overview" element={<StudentProfileOverview />} />
              <Route path="/student/resumes" element={<Resumes />} />
              <Route path="/student/settings" element={<StudentSettings />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
            </Route>

            {/* Profile wizard has its own header, so it sits outside StudentLayout
                (still protected, just not double-wrapped in the top nav) */}
            <Route
              path="/student/profile-wizard/:step"
              element={
                <ProtectedStudentRoute>
                  <ProfileWizard />
                </ProtectedStudentRoute>
              }
            />

            {/* 🏢 Company Workspace Cluster — every page behind ProtectedClientRoute */}
            <Route
              element={
                <ProtectedClientRoute>
                  <ClientLayout />
                </ProtectedClientRoute>
              }
            >
              <Route path="/dashboard" element={<ClientDashboard />} />

              <Route path="/jobs" element={<JobsPosted />} />
              <Route path="/jobs/new" element={<PostJob />} />
              <Route path="/jobs/:id/edit" element={<PostJob />} />
              <Route path="/jobs/:jobId/applicants" element={<JobApplicants />} />

              <Route path="/applicants" element={<ApplicantsLanding />} />
              <Route path="/applicants/:id" element={<ApplicantProfile />} />

              <Route path="/company-profile" element={<CompanyProfileOverview />} />
              <Route path="/company-profile/wizard/:step" element={<CompanyProfileWizard />} />

              <Route path="/settings" element={<ClientSettings />} />
              <Route path="/notifications" element={<ClientNotifications />} />
            </Route>

            {/* 🔐 Admin Workspace Cluster — every page behind ProtectedAdminRoute */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<DashboardOverview />} />

              <Route path="students" element={<ManageStudents />} />
              <Route path="students/:id" element={<StudentProfile />} />

              <Route path="companies" element={<ManageCompanies />} />
              <Route path="companies/:id" element={<CompanyProfile />} />

              <Route path="jobs" element={<ManageJobPosts />} />
              <Route path="jobs/:id" element={<JobPostDetail />} />

              <Route path="applications" element={<ManageApplications />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />

              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="password" element={<ChangePassword />} />
            </Route>

            {/* Catch-all — real 404 page, not a redirect */}
            <Route path="*" element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
