import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import { pick } from '../utils/fields';
import TopNavbar from '../components/TopNavbar';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import './ManageCompanies.css';

const PER_PAGE = 10;

function ManageCompanies() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Lightweight counts by status for the summary cards — the API doesn't
  // expose a dedicated /companies/stats endpoint, so we derive these from
  // the same list endpoint with per_page=1 (we only need the `total`).
  const [statCounts, setStatCounts] = useState({ total: 0, verified: 0, pending: 0, blocked: 0 });

  const loadStats = async () => {
    try {
      // Pull a big page of companies once and count client-side. This is
      // robust even if the backend ignores the status filter or omits `total`.
      const res = await axiosClient.get('/admin/companies', { params: { page: 1, per_page: 200 } });
      const list = asArray(res.data.companies, res.data.results, res.data);
      const norm = (c) => (pick(c, 'admin_status', 'status', 'account_status') || 'Pending').toLowerCase().trim();
      const isApprovedStatus = (st) => ['approved', 'verified', 'active'].includes(st);
      setStatCounts({
        total: res.data.total ?? list.length,
        verified: list.filter((c) => isApprovedStatus(norm(c))).length,
        pending: list.filter((c) => norm(c) === 'pending').length,
        blocked: list.filter((c) => norm(c) === 'blocked').length,
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
      const msg = { approve: 'Company approved! 🎉', reject: 'Company rejected.', block: 'Company blocked.', delete: 'Company deleted.' }[type];
      showToast(msg, (type === 'approve') ? 'success' : 'info');
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

  return (
    <main className="mc-main-body">
      <TopNavbar title="Manage Companies" />

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
      )}

      {/* METRICS ROW */}
      <section className="mc-metrics-row">
        <div className="mc-metric-card border-blue">
          <div className="mc-card-flex">
            <div>
              <p className="mc-label">TOTAL PARTNERS</p>
              <h2 className="mc-value-num">{statCounts.total}</h2>
            </div>
            <div className="mc-icon-slot icon-blue">🏢</div>
          </div>
        </div>

        <div className="mc-metric-card border-green">
          <div className="mc-card-flex">
            <div>
              <p className="mc-label">VERIFIED</p>
              <h2 className="mc-value-num">{statCounts.verified}</h2>
            </div>
            <div className="mc-icon-slot icon-green">✅</div>
          </div>
        </div>

        <div className="mc-metric-card border-amber">
          <div className="mc-card-flex">
            <div>
              <p className="mc-label">PENDING APPROVAL</p>
              <h2 className="mc-value-num">{statCounts.pending}</h2>
            </div>
            <div className="mc-icon-slot icon-amber">⏳</div>
          </div>
        </div>

        <div className="mc-metric-card border-red">
          <div className="mc-card-flex">
            <div>
              <p className="mc-label">BLOCKED COMPANIES</p>
              <h2 className="mc-value-num">{statCounts.blocked}</h2>
            </div>
            <div className="mc-icon-slot icon-red">🚫</div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mc-action-bar">
        <div className="search-input-box">
          <input
            type="text"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="🔍 Search by company name, industry, or email..."
          />
        </div>
        <div className="filter-dropdown-box">
          <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </section>

      {/* TABLE SYSTEM */}
      <section className="mc-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading companies...</div>
        ) : (
        <>
        <table className="mc-data-table">
          <thead>
            <tr>
              <th>COMPANY NAME</th>
              <th>INDUSTRY</th>
              <th>CONTACT EMAIL</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No companies found</td></tr>
            )}
            {companies.map((company) => {
              const name = pick(company, 'company_name', 'name') || '—';
              const statusText = pick(company, 'admin_status', 'status', 'account_status') || 'Pending';
              const st = statusText.toLowerCase().trim();
              const isApproved = ['approved', 'verified', 'active'].includes(st);
              return (
              <tr key={company.id}>
                <td>
                  <div className="company-info-cell">
                    <div className="company-logo-thumbnail">{name.charAt(0)}</div>
                    <div>
                      <p className="comp-main-name" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/companies/${company.id}`)}>{name}</p>
                      <p className="comp-sub-caption">{company.subtitle || company.description || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="industry-txt">{company.industry}</td>
                <td className="email-txt">{company.email}</td>
                <td>
                  <span className={`status-pill ${isApproved ? 'approved' : st}`}>
                    {statusText}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    <button className="action-icon-btn btn-view" title="View Details" onClick={() => navigate(`/admin/companies/${company.id}`)}>👁️</button>
                    {!isApproved && (
                      <button className="action-icon-btn btn-approve" title="Approve" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'approve' })}>✔️</button>
                    )}
                    {st !== 'blocked' && (
                      <button className="action-icon-btn btn-block" title="Block" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'block' })}>🚫</button>
                    )}
                    <button className="action-icon-btn btn-delete" title="Delete" onClick={() => setConfirmAction({ companyId: company.id, name, type: 'delete' })}>🗑️</button>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {companies.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {(page - 1) * PER_PAGE + companies.length} of {total} results
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ border: 'none', background: 'none', color: page <= 1 ? '#cbd5e1' : '#64748b', cursor: page <= 1 ? 'default' : 'pointer' }}>‹</button>
            <span style={{ fontSize: '13px', color: '#334155', padding: '0 8px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={{ border: 'none', background: 'none', color: page >= totalPages ? '#cbd5e1' : '#64748b', cursor: page >= totalPages ? 'default' : 'pointer' }}>›</button>
          </div>
        </div>
        </>
        )}
      </section>

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
