import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import { pick } from '../utils/fields';
import TopNavbar from '../components/TopNavbar';
import ConfirmModal from '../components/ConfirmModal';
import './ManageCompanies.css'; // Preserved original import

const PER_PAGE = 10;

function ManageCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Lightweight counts by status for the summary cards
  const [statCounts, setStatCounts] = useState({ total: 0, verified: 0, pending: 0, blocked: 0 });

  const loadStats = async () => {
    try {
      const [allRes, verifiedRes, pendingRes, blockedRes] = await Promise.all([
        axiosClient.get('/admin/companies', { params: { page: 1, per_page: 1 } }),
        axiosClient.get('/admin/companies', { params: { status: 'Approved', page: 1, per_page: 1 } }),
        axiosClient.get('/admin/companies', { params: { status: 'Pending', page: 1, per_page: 1 } }),
        axiosClient.get('/admin/companies', { params: { status: 'Blocked', page: 1, per_page: 1 } }),
      ]);
      setStatCounts({
        total: allRes.data.total ?? 0,
        verified: verifiedRes.data.total ?? 0,
        pending: pendingRes.data.total ?? 0,
        blocked: blockedRes.data.total ?? 0,
      });
    } catch {
      // stats are a nice-to-have; don't block the page on failure
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/admin/companies', {
        params: { search: search || undefined, status: statusFilter || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.companies, data.results, data);
      setCompanies(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load companies. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    const timer = setTimeout(loadCompanies, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { companyId, type } = confirmAction;
      if (type === 'approve') await axiosClient.patch(`/admin/companies/${companyId}/approve`);
      if (type === 'reject') await axiosClient.patch(`/admin/companies/${companyId}/reject`);
      if (type === 'block') await axiosClient.patch(`/admin/companies/${companyId}/block`);
      if (type === 'delete') await axiosClient.delete(`/admin/companies/${companyId}`);
      setConfirmAction(null);
      loadCompanies();
      loadStats();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    approve: { title: 'Approve Company', message: `Approve ${confirmAction?.name} as a verified institutional partner?`, confirmLabel: 'Approve Company', color: '#16a34a' },
    reject: { title: 'Reject Company', message: `Reject ${confirmAction?.name}'s partnership application?`, confirmLabel: 'Reject Company', color: '#dc2626' },
    block: { title: 'Block Company', message: `Block ${confirmAction?.name}? They will no longer be able to post jobs or access the portal.`, confirmLabel: 'Block Company', color: '#dc2626' },
    delete: { title: 'Delete Company', message: `Permanently delete ${confirmAction?.name}? This cannot be undone.`, confirmLabel: 'Delete Company', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  // UI Helper for dynamic status colors
  const getStatusColors = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (['approved', 'verified', 'active'].includes(s)) return { bg: '#dcfce7', text: '#166534' };
    if (s === 'pending') return { bg: '#fef3c7', text: '#92400e' };
    if (['blocked', 'rejected'].includes(s)) return { bg: '#fee2e2', text: '#991b1b' };
    return { bg: '#f1f5f9', text: '#475569' };
  };

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* INLINE STYLES FOR ANIMATIONS & MODERN UI */}
      <style>{`
        @keyframes mcFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mcPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        .mc-animate {
          animation: mcFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .mc-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .mc-hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
        }

        .mc-input {
          padding: 10px 16px 10px 42px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #fff;
          font-size: 14px;
          outline: none;
          width: 100%;
          max-width: 380px;
          transition: all 0.2s;
        }
        .mc-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

        .mc-select {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          outline: none;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mc-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

        .mc-table { width: 100%; border-collapse: collapse; text-align: left; }
        .mc-table th { padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .mc-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .mc-table tbody tr { transition: background-color 0.15s; }
        .mc-table tbody tr:hover { background-color: #f8fafc; }

        .mc-action-btn {
          width: 32px; height: 32px; border-radius: 8px; border: none; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: #f1f5f9; color: #475569; font-size: 14px;
        }
        .mc-action-btn:hover { transform: scale(1.05); }
        .mc-action-btn.view:hover { background: #e2e8f0; color: #0f172a; }
        .mc-action-btn.approve:hover { background: #dcfce7; color: #166534; }
        .mc-action-btn.block:hover { background: #fef3c7; color: #92400e; }
        .mc-action-btn.delete:hover { background: #fee2e2; color: #991b1b; }

        .mc-pill-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid #cbd5e1; background: #fff; color: #334155; cursor: pointer; transition: all 0.2s;
        }
        .mc-pill-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mc-pill-btn:not(:disabled):hover { background: #f1f5f9; border-color: #94a3b8; color: #0f172a; }

        .mc-skeleton { animation: mcPulse 1.5s infinite ease-in-out; background: #e2e8f0; border-radius: 6px; }
      `}</style>

      <TopNavbar title="Manage Companies" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header Intro */}
        <div className="mc-animate" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Partner Companies</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px', maxWidth: '700px', lineHeight: '1.5' }}>
            Review, verify, and manage employer partnerships. Verified companies can post jobs and access the student talent pool.
          </p>
        </div>

        {error && (
          <div className="mc-animate" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>⚠️</span> {error}
          </div>
        )}

        {/* 📊 METRICS ROW */}
        <section className="mc-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px', animationDelay: '0.1s' }}>
          
          <div className="mc-card mc-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>TOTAL PARTNERS</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{statCounts.total}</h2>
            </div>
            <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px', fontSize: '20px' }}>🏢</div>
          </div>

          <div className="mc-card mc-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#059669', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>VERIFIED</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#047857', margin: 0 }}>{statCounts.verified}</h2>
            </div>
            <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '12px', fontSize: '20px' }}>✅</div>
          </div>

          <div className="mc-card mc-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#d97706', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>PENDING APPROVAL</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#b45309', margin: 0 }}>{statCounts.pending}</h2>
            </div>
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '12px', fontSize: '20px' }}>⏳</div>
          </div>

          <div className="mc-card mc-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>BLOCKED</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#b91c1c', margin: 0 }}>{statCounts.blocked}</h2>
            </div>
            <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '12px', fontSize: '20px' }}>🚫</div>
          </div>

        </section>

        {/* 📑 COMPANIES DATA TABLE CARD */}
        <section className="mc-card mc-animate" style={{ padding: '24px', animationDelay: '0.2s', marginBottom: '32px' }}>
          
          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                className="mc-input"
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search by company name, industry, or email..."
              />
            </div>
            <div>
              <select className="mc-select" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table className="mc-table">
              <thead>
                <tr>
                  <th>Company Info</th>
                  <th>Industry</th>
                  <th>Contact Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="mc-skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}></div>
                          <div style={{ width: '100%' }}>
                            <div className="mc-skeleton" style={{ height: '14px', width: '60%', marginBottom: '6px' }}></div>
                            <div className="mc-skeleton" style={{ height: '12px', width: '40%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td><div className="mc-skeleton" style={{ height: '14px', width: '70%' }}></div></td>
                      <td><div className="mc-skeleton" style={{ height: '14px', width: '90%' }}></div></td>
                      <td><div className="mc-skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div></td>
                      <td><div className="mc-skeleton" style={{ height: '32px', width: '120px', margin: '0 auto' }}></div></td>
                    </tr>
                  ))
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏢</div>
                      <p style={{ margin: 0 }}>No companies found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => {
                    const name = pick(company, 'company_name', 'name') || '—';
                    const statusText = pick(company, 'admin_status', 'status', 'account_status') || 'Pending';
                    const st = statusText.toLowerCase().trim();
                    const isApproved = ['approved', 'verified', 'active'].includes(st);
                    const pillColor = getStatusColors(statusText);
                    const avatarInitials = name !== '—' ? name.substring(0, 2).toUpperCase() : '?';
                    
                    return (
                      <tr key={company.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0, border: '1px solid #bfdbfe' }}>
                              {avatarInitials}
                            </div>
                            <div>
                              <p 
                                style={{ margin: 0, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }} 
                                onClick={() => navigate(`/admin/companies/${company.id}`)}
                              >
                                {name}
                              </p>
                              {(company.subtitle || company.description) && (
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                  {company.subtitle || company.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontWeight: 500 }}>{company.industry || '—'}</td>
                        <td style={{ color: '#475569' }}>{company.email}</td>
                        <td>
                          <span style={{ background: pillColor.bg, color: pillColor.text, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {isApproved ? 'Approved' : statusText}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button className="mc-action-btn view" title="View Details" onClick={() => navigate(`/admin/companies/${company.id}`)}>👁️</button>
                            {!isApproved && (
                              <button className="mc-action-btn approve" title="Approve" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'approve' })}>✔️</button>
                            )}
                            {st !== 'blocked' && (
                              <button className="mc-action-btn block" title="Block" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'block' })}>🚫</button>
                            )}
                            <button className="mc-action-btn delete" title="Delete" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'delete' })}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER WITH PAGINATION */}
          {!loading && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Showing <b style={{ color: '#0f172a' }}>{companies.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {(page - 1) * PER_PAGE + companies.length}</b> of <b style={{ color: '#0f172a' }}>{total}</b> companies
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  className="mc-pill-btn" 
                  disabled={page <= 1} 
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500, padding: '0 8px' }}>Page {page} of {totalPages}</span>
                <button 
                  className="mc-pill-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {modalCopy && (
        <ConfirmModal
          open={!!confirmAction}
          title={modalCopy.title}
          message={modalCopy.message}
          confirmLabel={modalCopy.confirmLabel}
          confirmColor={modalCopy.color}
          onConfirm={runAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </main>
  );
}

export default ManageCompanies;