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
    <main className="admin-page-body" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes maFadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes maPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        .ma-animate-entry {
          animation: maFadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ma-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ma-card-interactive:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.06);
        }

        .ma-input {
          padding: 9px 16px 9px 38px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          width: 300px;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          color: #0f172a;
          transition: all 0.2s ease;
        }
        .ma-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .ma-select {
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #334155;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ma-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .ma-table-row {
          transition: background-color 0.15s ease;
          border-bottom: 1px solid #f1f5f9;
        }
        .ma-table-row:hover {
          background-color: #f8fafc;
        }

        .ma-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .ma-action-btn:hover {
          background: #e2e8f0;
          color: #2563eb;
          transform: scale(1.05);
        }

        .ma-pagination-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ma-pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #e2e8f0;
          background: #f8fafc;
        }
        .ma-pagination-btn:not(:disabled):hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .ma-skeleton-box {
          animation: maPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          background: #e2e8f0;
        }
      `}</style>

      <TopNavbar title="Manage Applications" />

      {error && (
        <div className="ma-animate-entry" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
          <span style={{ fontSize: '16px' }}>⚠</span> {error}
        </div>
      )}

      {/* 📊 FOUR METRICS ROW */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <MetricCard label="TOTAL APPLIED" value={stats?.total_applied} bg="#eff6ff" fg="#2563eb" icon="📄" delay="0s" />
        <MetricCard label="PENDING REVIEW" value={stats?.pending_review} bg="#fffbeb" fg="#d97706" icon="🕒" delay="0.05s" />
        <MetricCard label="SHORTLISTED" value={stats?.shortlisted} bg="#f0fdf4" fg="#16a34a" icon="✅" delay="0.1s" />
        <MetricCard label="REJECTED" value={stats?.rejected} bg="#fef2f2" fg="#dc2626" icon="❌" delay="0.15s" />
      </section>

      {/* 📋 TABLE AND FILTER INTERFACE CARD */}
      <div className="ma-card ma-animate-entry" style={{ padding: '26px 28px', animationDelay: '0.2s' }}>
        
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="ma-input"
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search by student or company..."
              />
              <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>🔍</span>
            </div>
            
            <select
              className="ma-select"
              value={statusFilter}
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
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

        {/* Section Title & Subhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Submissions</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Showing {applications.length} entries</span>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div style={{ padding: '12px 0' }} aria-label="Loading applications">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div className="ma-skeleton-box" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="ma-skeleton-box" style={{ width: '28%', height: 14, marginBottom: 8, borderRadius: 6 }} />
                  <div className="ma-skeleton-box" style={{ width: '40%', height: 12, borderRadius: 6 }} />
                </div>
                <div className="ma-skeleton-box" style={{ width: 80, height: 24, borderRadius: 20 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 10px' }}>Student Name</th>
                    <th style={{ padding: '14px 10px' }}>Job Title</th>
                    <th style={{ padding: '14px 10px' }}>Company</th>
                    <th style={{ padding: '14px 10px' }}>Applied Date</th>
                    <th style={{ padding: '14px 10px' }}>Status</th>
                    <th style={{ padding: '14px 10px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No applications match your filter criteria.
                      </td>
                    </tr>
                  )}
                  {applications.map((item) => {
                    const name = item.student_name || item.name || '—';
                    const dept = item.department || item.dept || '';
                    const role = item.job_title || item.role || '—';
                    const company = item.company_name || item.company || '';
                    const date = fmtDate(pick(item, 'applied_date', 'date', 'created_at', 'applied_at', 'application_date'));
                    const initials = name !== '—' ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

                    return (
                      <tr key={item.id} className="ma-table-row">
                        <td style={{ padding: '14px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#1d4ed8', fontSize: '12px', flexShrink: 0 }}>
                              {initials}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', cursor: 'pointer' }} onClick={() => navigate(`/admin/applications/${item.id}`)}>{name}</p>
                              {dept && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{dept}</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 10px', color: '#334155', fontWeight: '500' }}>{role}</td>
                        <td style={{ padding: '14px 10px', color: '#475569', fontWeight: '500' }}>{company}</td>
                        <td style={{ padding: '14px 10px', color: '#64748b', fontSize: '13px' }}>{date}</td>
                        <td style={{ padding: '14px 10px' }}><StatusPill status={item.status} /></td>
                        <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                          <button className="ma-action-btn" title="View details" onClick={() => navigate(`/admin/applications/${item.id}`)}>
                            👁️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', borderTop: '1px solid #f1f5f9', paddingTop: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Showing {applications.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} - {(page - 1) * PER_PAGE + applications.length} of {total} applications
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="ma-pagination-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} title="Previous page">
                  ‹
                </button>
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600, padding: '0 8px' }}>
                  Page {page} of {totalPages}
                </span>
                <button className="ma-pagination-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} title="Next page">
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value, bg, fg, icon, delay }) {
  return (
    <div className="ma-card ma-card-interactive ma-animate-entry" style={{ padding: '22px', animationDelay: delay }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', margin: '0 0 8px 0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {value ?? '—'}
          </h2>
        </div>
        <div style={{ padding: '10px 12px', background: bg, borderRadius: '12px', fontSize: '18px', color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default ManageApplications;