import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import { pick, fmtDate } from '../utils/fields';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';

const PER_PAGE = 10;

function ManageApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    let base = null;
    try {
      const res = await axiosClient.get('/admin/applications/stats');
      base = res.data.stats || res.data;
    } catch {
      // stats endpoint missing — we'll derive below
    }
    const resolved = {
      total_applied: pick(base || {}, 'total_applied', 'total', 'total_applications'),
      pending_review: pick(base || {}, 'pending_review', 'pending', 'in_review'),
      shortlisted: pick(base || {}, 'shortlisted'),
      rejected: pick(base || {}, 'rejected'),
    };
    // Derive any missing number from the list endpoint's `total` field
    // (per_page=1 keeps these calls cheap).
    const needs = Object.entries(resolved).filter(([, v]) => v === undefined);
    if (needs.length) {
      try {
        const statusFor = { total_applied: undefined, pending_review: 'Applied', shortlisted: 'Shortlisted', rejected: 'Rejected' };
        const results = await Promise.all(needs.map(([key]) =>
          axiosClient.get('/admin/applications', { params: { status: statusFor[key], page: 1, per_page: 1 } })
        ));
        needs.forEach(([key], i) => { resolved[key] = results[i].data.total ?? 0; });
      } catch {
        // leave missing values as undefined — cards will show an em dash
      }
    }
    setStats(resolved);
  };

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/admin/applications', {
        params: { search: search || undefined, status: statusFilter || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.applications, data.results, data);
      setApplications(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load applications. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    const timer = setTimeout(loadApplications, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Manage Applications" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      {/* 📊 FOUR METRICS ROW */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <MetricCard label="TOTAL APPLIED" value={stats?.total_applied} bg="#eff6ff" fg="#3b82f6" icon="📄" />
        <MetricCard label="PENDING REVIEW" value={stats?.pending_review} bg="#fffbeb" fg="#d97706" icon="🕒" />
        <MetricCard label="SHORTLISTED" value={stats?.shortlisted} bg="#f0fdf4" fg="#16a34a" icon="✅" />
        <MetricCard label="REJECTED" value={stats?.rejected} bg="#fef2f2" fg="#dc2626" icon="❌" />
      </section>

      {/* 📋 TABLE AND FILTER INTERFACE CARD */}
      <div className="pf-card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search by student or company..."
                style={{ padding: '8px 16px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px', fontSize: '14px' }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: '14px' }}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="In Review">In Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="pf-display" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--pf-text)', margin: 0 }}>Submissions</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Showing {applications.length} entries</span>
        </div>

        {loading ? (
          <div style={{ padding: '10px 0' }} aria-label="Loading applications">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <div className="pf-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="pf-skeleton" style={{ width: '24%', height: 13, marginBottom: 7 }} />
                  <div className="pf-skeleton" style={{ width: '38%', height: 11 }} />
                </div>
                <div className="pf-skeleton" style={{ width: 74, height: 22, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        ) : (
        <>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '12px 8px' }}>Student Name</th>
              <th style={{ padding: '12px 8px' }}>Job Title</th>
              <th style={{ padding: '12px 8px' }}>Company</th>
              <th style={{ padding: '12px 8px' }}>Applied Date</th>
              <th style={{ padding: '12px 8px' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No applications found</td></tr>
            )}
            {applications.map((item) => {
              const name = item.student_name || item.name || '—';
              const dept = item.department || item.dept || '';
              const role = item.job_title || item.role || '—';
              const company = item.company_name || item.company || '';
              const date = fmtDate(pick(item, 'applied_date', 'date', 'created_at', 'applied_at', 'application_date'));
              return (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#475569', fontSize: '12px' }}>
                      {name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', cursor: 'pointer' }} onClick={() => navigate(`/admin/applications/${item.id}`)}>{name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{dept}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 8px', color: '#334155', fontWeight: '500' }}>{role}</td>
                <td style={{ padding: '16px 8px', color: '#475569', fontWeight: '500' }}>{company}</td>
                <td style={{ padding: '16px 8px', color: '#64748b' }}>{date}</td>
                <td style={{ padding: '16px 8px' }}><StatusPill status={item.status} /></td>
                <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', color: '#64748b', fontSize: '16px' }}>
                    <span style={{ cursor: 'pointer' }} title="View" onClick={() => navigate(`/admin/applications/${item.id}`)}>👁️</span>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {applications.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{(page - 1) * PER_PAGE + applications.length} of {total} applications
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ border: 'none', background: 'none', color: page <= 1 ? '#cbd5e1' : '#64748b', cursor: page <= 1 ? 'default' : 'pointer' }}>‹</button>
            <span style={{ fontSize: '13px', color: '#334155', padding: '0 8px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={{ border: 'none', background: 'none', color: page >= totalPages ? '#cbd5e1' : '#64748b', cursor: page >= totalPages ? 'default' : 'pointer' }}>›</button>
          </div>
        </div>
        </>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value, bg, fg, icon }) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>{label}</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{value ?? '—'}</h2>
        </div>
        <div style={{ padding: '10px', background: bg, borderRadius: '50%', fontSize: '18px', color: fg }}>{icon}</div>
      </div>
    </div>
  );
}

export default ManageApplications;
