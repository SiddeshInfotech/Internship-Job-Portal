import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';

const PER_PAGE = 10;

function ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // { studentId, type, name }
  const [actionLoading, setActionLoading] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/admin/students', {
        params: { search: search || undefined, status: status || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.students, data.results, data);
      setStudents(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load students. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadStudents, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const runAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'block') {
        await axiosClient.patch(`/admin/students/${confirmAction.studentId}/block`);
      } else if (confirmAction.type === 'unblock') {
        await axiosClient.patch(`/admin/students/${confirmAction.studentId}/unblock`);
      } else if (confirmAction.type === 'delete') {
        await axiosClient.delete(`/admin/students/${confirmAction.studentId}`);
      }
      setConfirmAction(null);
      loadStudents();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Manage Students" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <div className="ma-action-bar">
        <div className="search-bar-wrapper" style={{ flex: 1, maxWidth: '360px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by student name, college, or email..."
            aria-label="Search students"
            style={{ width: '100%' }}
          />
          <span aria-hidden="true">🔍</span>
        </div>
        <select
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          className="filter-dropdown-box"
          aria-label="Filter students by status"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="table-data-card">
        {loading ? (
          <div style={{ padding: '20px 22px' }} aria-label="Loading students">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <div className="pf-skeleton" style={{ width: 34, height: 34, borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div className="pf-skeleton" style={{ width: '28%', height: 13, marginBottom: 7 }} />
                  <div className="pf-skeleton" style={{ width: '40%', height: 11 }} />
                </div>
                <div className="pf-skeleton" style={{ width: 70, height: 22, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
          <table className="visily-data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>College & Branch</th>
                <th>Email Address</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr><td colSpan={5}><div className="cp-empty"><div className="cp-empty-icon" aria-hidden="true">🎓</div>No students found</div></td></tr>
              )}
              {students.map((s) => {
                const isBlocked = (s.status || '').toLowerCase() === 'blocked';
                return (
                <tr key={s.id}>
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-fake-avatar">{(s.name || '?').charAt(0)}</div>
                      <div>
                        <p className="student-name-txt" style={{ cursor: 'pointer', color: 'var(--pf-primary-deep)' }} onClick={() => navigate(`/admin/students/${s.id}`)}>{s.name}</p>
                        <p className="student-clg-txt">{s.roll_number || s.student_id || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="student-name-txt">{s.college || s.institution}</p>
                    <p className="student-clg-txt">{s.branch || s.department}</p>
                  </td>
                  <td className="email-txt">{s.email}</td>
                  <td><StatusPill status={s.status || 'Active'} /></td>
                  <td>
                    <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                      <button className="action-icon-btn btn-view" title="View" aria-label={`View ${s.name}`} onClick={() => navigate(`/admin/students/${s.id}`)}>👁️</button>
                      <button
                        className={`action-icon-btn ${isBlocked ? 'btn-approve' : 'btn-block'}`}
                        title={isBlocked ? 'Unblock' : 'Block'}
                        aria-label={`${isBlocked ? 'Unblock' : 'Block'} ${s.name}`}
                        onClick={() => setConfirmAction({ studentId: s.id, type: isBlocked ? 'unblock' : 'block', name: s.name })}
                      >
                        {isBlocked ? '🔓' : '🚫'}
                      </button>
                      <button className="action-icon-btn btn-delete" title="Delete" aria-label={`Delete ${s.name}`} onClick={() => setConfirmAction({ studentId: s.id, type: 'delete', name: s.name })}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>

          <div className="ma-table-footer">
            <span className="entries-count">
              Showing {students.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{(page - 1) * PER_PAGE + students.length} of {total} students
            </span>
            <div className="ma-pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="arrow-btn" aria-label="Previous page">‹</button>
              <span className="entries-count" style={{ padding: '0 6px' }}>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="arrow-btn" aria-label="Next page">›</button>
            </div>
          </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction?.type === 'delete' ? 'Delete Student Account' :
          confirmAction?.type === 'block' ? 'Block Student Account' : 'Unblock Student Account'
        }
        message={
          confirmAction?.type === 'delete'
            ? `This will permanently delete ${confirmAction?.name}'s account and all their applications. This cannot be undone.`
            : confirmAction?.type === 'block'
            ? `Are you sure you want to block ${confirmAction?.name}? They will no longer be able to log in or apply for new job posts until unblocked by an administrator.`
            : `${confirmAction?.name} will regain access to log in and apply for job posts.`
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

export default ManageStudents;
