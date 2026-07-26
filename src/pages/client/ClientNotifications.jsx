import React, { useEffect, useState } from 'react';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';

function ClientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clientAxios.get('/client/notifications', { params: { page: 1, per_page: 30 } });
      setNotifications(asArray(res.data.notifications, res.data.results, res.data));
    } catch (err) {
      setError('Could not load notifications. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unreadCount = notifications.filter((n) => !n.is_read && !n.read).length;

  const markAllRead = async () => {
    try {
      await clientAxios.patch('/client/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
    } catch (err) {
      setError('Could not mark all as read. ' + (err.response?.data?.message || err.message));
    }
  };

  const markOneRead = async (id) => {
    try {
      await clientAxios.patch(`/client/notifications/${id}/mark-read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n)));
    } catch {
      // non-critical
    }
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Notifications" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <div className="cp-page-head" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="cp-metric-icon" style={{ marginBottom: 0 }} aria-hidden="true">🔔</div>
          <div>
            <h1 style={{ fontSize: '19px' }}>System Updates</h1>
            <p>Job approvals, new applicants, and account updates.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {unreadCount > 0 && <span className="pf-pill pf-pill-amber">{unreadCount} new</span>}
          <button onClick={markAllRead} disabled={unreadCount === 0} className="pf-btn pf-btn-ghost pf-btn-sm">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="cp-panel" style={{ padding: notifications.length || loading ? '6px 22px' : '20px 22px' }}>
        {loading && (
          [0, 1, 2].map((i) => (
            <div key={i} className="cp-skel-row">
              <div style={{ flex: 1 }}>
                <div className="pf-skeleton" style={{ width: '28%', height: 13, marginBottom: 7 }} />
                <div className="pf-skeleton" style={{ width: '55%', height: 11 }} />
              </div>
              <div className="pf-skeleton" style={{ width: 70, height: 11 }} />
            </div>
          ))
        )}
        {!loading && notifications.length === 0 && (
          <div className="cp-empty">
            <div className="cp-empty-icon" aria-hidden="true">🔔</div>
            No notifications yet. Updates about your jobs and applicants will land here.
          </div>
        )}
        {!loading && notifications.map((n, idx) => {
          const isRead = n.is_read || n.read;
          return (
            <div
              key={n.id || idx}
              onClick={() => !isRead && markOneRead(n.id)}
              className="cp-list-row"
              style={{
                cursor: isRead ? 'default' : 'pointer',
                background: isRead ? undefined : 'var(--pf-ember-soft)',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p className="cp-list-name" style={{ fontWeight: isRead ? 600 : 700 }}>{n.title}</p>
                <p className="cp-list-sub" style={{ whiteSpace: 'normal' }}>{n.message}</p>
              </div>
              <div className="cp-list-meta">
                <span className="cp-list-date">{n.created_at}</span>
                {!isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pf-ember)', flexShrink: 0 }} aria-label="Unread" />}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default ClientNotifications;
