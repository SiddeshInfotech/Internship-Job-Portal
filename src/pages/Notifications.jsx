import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import TopNavbar from '../components/TopNavbar';

const ICONS = {
  student: '👤', application: '📄', company: '🏢', job: '💼', security: '⚠️', default: '🔔',
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/admin/notifications', { params: { page: 1, per_page: 30 } });
      setNotifications(asArray(res.data.notifications, res.data.results, res.data));
    } catch (err) {
      setError('Could not load notifications. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unreadCount = notifications.filter((n) => !n.read && !n.is_read).length;

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await axiosClient.patch('/admin/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
    } catch (err) {
      setError('Could not mark all as read. ' + (err.response?.data?.message || err.message));
    } finally {
      setMarkingAll(false);
    }
  };

  const markOneRead = async (id) => {
    try {
      await axiosClient.patch(`/admin/notifications/${id}/mark-read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n)));
    } catch {
      // silently ignore — non-critical
    }
  };

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Notifications" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="cp-metric-icon" style={{ marginBottom: 0 }} aria-hidden="true">🔔</div>
          <div>
            <h3 className="pf-display" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--pf-text)' }}>System Updates</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--pf-text-3)' }}>Manage your recent activity and administrative alerts.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {unreadCount > 0 && <span className="pf-pill pf-pill-amber">{unreadCount} new</span>}
          <button onClick={markAllRead} disabled={markingAll || unreadCount === 0} className="pf-btn pf-btn-ghost pf-btn-sm">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="table-data-card" style={{ marginBottom: 0 }}>
        {loading && (
          <div style={{ padding: '20px 22px' }} aria-label="Loading notifications">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                <div className="pf-skeleton" style={{ width: 36, height: 36, borderRadius: 11 }} />
                <div style={{ flex: 1 }}>
                  <div className="pf-skeleton" style={{ width: '26%', height: 13, marginBottom: 7 }} />
                  <div className="pf-skeleton" style={{ width: '55%', height: 11 }} />
                </div>
                <div className="pf-skeleton" style={{ width: 66, height: 11 }} />
              </div>
            ))}
          </div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="cp-empty"><div className="cp-empty-icon" aria-hidden="true">🔔</div>No notifications yet.</div>
        )}
        {!loading && notifications.map((n, idx) => {
          const isRead = n.read ?? n.is_read;
          return (
          <div
            key={n.id || idx}
            onClick={() => !isRead && markOneRead(n.id)}
            style={{
              display: 'flex', gap: '14px', padding: '15px 20px',
              borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid #eef2f8',
              cursor: isRead ? 'default' : 'pointer',
              backgroundColor: isRead ? 'transparent' : 'var(--pf-ember-soft)',
              transition: 'background 150ms ease',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'var(--pf-primary-soft)', border: '1px solid var(--pf-blue-ln)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }} aria-hidden="true">
              {ICONS[n.type] || ICONS.default}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px 0', fontWeight: isRead ? 600 : 700, color: 'var(--pf-text)', fontSize: '13.5px' }}>{n.title}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--pf-text-2)', lineHeight: 1.5 }}>{n.message || n.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', color: 'var(--pf-text-3)', fontVariantNumeric: 'tabular-nums' }}>{n.time_ago || n.created_at || ''}</span>
              {!isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--pf-ember)' }} aria-label="Unread"></span>}
            </div>
          </div>
        );})}
      </div>
    </main>
  );
}

export default Notifications;
