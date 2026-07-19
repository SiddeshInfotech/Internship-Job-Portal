import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import { pick, fmtDate } from '../utils/fields';
import { normalizeApplicant } from '../utils/drive';

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin/students/${id}`);
      const data = normalizeApplicant(res.data.student || res.data, pick);
      data.college = data.institution;
      data.branch = data.department;
      setStudent(data);
    } catch (err) {
      setError('Could not load student. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const isBlocked = (student?.status || '').toLowerCase() === 'blocked';

  const runAction = async () => {
    setActionLoading(true);
    try {
      if (confirmAction.type === 'block') await axiosClient.patch(`/admin/students/${id}/block`);
      if (confirmAction.type === 'unblock') await axiosClient.patch(`/admin/students/${id}/unblock`);
      if (confirmAction.type === 'delete') {
        await axiosClient.delete(`/admin/students/${id}`);
        navigate('/admin/students');
        return;
      }
      setConfirmAction(null);
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Student Profile" />

      <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: 'var(--pf-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px', fontWeight: 600 }}>
        <Link to="/admin/students" style={{ color: 'var(--pf-text-3)', textDecoration: 'none' }}>Manage Students</Link>
        {' › '}
        <span style={{ color: 'var(--pf-text)', fontWeight: 700 }}>{student?.name || '...'}</span>
      </nav>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div className="cp-dash-grid" aria-label="Loading student">
          <div className="pf-card" style={{ padding: 24 }}>
            <div className="pf-skeleton" style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 14px' }} />
            <div className="pf-skeleton" style={{ width: '55%', height: 16, margin: '0 auto 10px' }} />
            <div className="pf-skeleton" style={{ width: '35%', height: 12, margin: '0 auto' }} />
          </div>
          <div className="pf-card" style={{ padding: 24 }}>
            <div className="pf-skeleton" style={{ width: '30%', height: 15, marginBottom: 16 }} />
            <div className="pf-skeleton" style={{ width: '100%', height: 70, marginBottom: 12 }} />
            <div className="pf-skeleton" style={{ width: '100%', height: 70 }} />
          </div>
        </div>
      )}

      {!loading && student && (
        <div className="cp-dash-grid" style={{ gridTemplateColumns: undefined }}>
          {/* LEFT PROFILE CARD */}
          <div className="pf-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '90px', background: 'radial-gradient(240px 120px at 85% -20%, rgba(245,158,11,0.25), transparent 60%), linear-gradient(165deg, var(--pf-ink-2) 0%, var(--pf-ink) 100%)' }}>
              <div className="pf-ember-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: 0 }} />
            </div>
            <div style={{ textAlign: 'center', padding: '0 20px 20px', marginTop: '-45px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(140deg, #2563eb, #0b1526)', border: '4px solid #fff', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700, color: '#fff', fontFamily: 'var(--pf-display)', boxShadow: 'var(--pf-shadow-md)' }}>
                {(student.name || '?').charAt(0)}
              </div>
              <h3 className="pf-display" style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: 'var(--pf-text)' }}>{student.name}</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8' }}>{student.roll_number || student.student_id}</p>
              <StatusPill status={student.status || 'Active'} />

              <div style={{ textAlign: 'left', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>EMAIL</p>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: 'var(--pf-text)' }}>{student.email}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>COLLEGE</p>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: 'var(--pf-text)' }}>{student.college || student.institution}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>BRANCH</p>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: 'var(--pf-text)' }}>{student.branch || student.department}</p>
                </div>
                {student.phone && (
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>PHONE</p>
                    <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: 'var(--pf-text)' }}>{student.phone}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setConfirmAction({ type: isBlocked ? 'unblock' : 'block' })}
                  className={`pf-btn ${isBlocked ? 'pf-btn-primary' : 'pf-btn-ember'}`}
                  style={{ width: '100%' }}
                >
                  {isBlocked ? 'Unblock Student' : 'Block Student'}
                </button>
                <button
                  onClick={() => setConfirmAction({ type: 'delete' })}
                  className="pf-btn pf-btn-ghost"
                  style={{ width: '100%', color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: APPLICATIONS */}
          <div className="pf-card" style={{ padding: '22px 24px' }}>
            <h3 className="pf-display" style={{ margin: '0 0 16px 0', fontSize: '15.5px', fontWeight: 700, color: 'var(--pf-text)' }}>Applications</h3>
            {(!student.applications || student.applications.length === 0) && (
              <div className="cp-empty"><div className="cp-empty-icon" aria-hidden="true">📄</div>No applications submitted by this student yet.</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {(student.applications || []).map((app, idx) => (
                <div key={app.id || idx} className="pf-card pf-card-hover" style={{ padding: '14px 16px', boxShadow: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--pf-text-3)', fontWeight: 600 }}>{app.company_name || app.company}</span>
                    <StatusPill status={app.status} />
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--pf-text)', fontSize: '14px' }}>{app.job_title || app.role}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--pf-text-3)', fontVariantNumeric: 'tabular-nums' }}>Applied: {fmtDate(pick(app, 'applied_date', 'date', 'created_at'))}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.type === 'delete' ? 'Delete Student Account' : confirmAction?.type === 'block' ? 'Block Student Account' : 'Unblock Student Account'}
        message={
          confirmAction?.type === 'delete'
            ? `This will permanently delete ${student?.name}'s account and all their applications. This cannot be undone.`
            : confirmAction?.type === 'block'
            ? `Are you sure you want to block ${student?.name}? They will no longer be able to log in or apply for new job posts until unblocked by an administrator.`
            : `${student?.name} will regain access to log in and apply for job posts.`
        }
        confirmLabel={confirmAction?.type === 'delete' ? 'Delete Student' : confirmAction?.type === 'block' ? 'Block Student' : 'Unblock Student'}
        confirmColor={confirmAction?.type === 'unblock' ? '#16a34a' : '#dc2626'}
        onConfirm={runAction}
        onCancel={() => setConfirmAction(null)}
        loading={actionLoading}
      />
    </main>
  );
}

export default StudentProfile;
