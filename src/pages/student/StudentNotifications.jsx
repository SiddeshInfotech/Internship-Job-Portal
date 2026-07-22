import React, { useEffect, useState } from 'react';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentAxios.get('/student/notifications', { params: { page: 1, per_page: 30 } });
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
      await studentAxios.patch('/student/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
    } catch (err) {
      setError('Could not mark all as read. ' + (err.response?.data?.message || err.message));
    }
  };

  const markOneRead = async (id) => {
    try {
      await studentAxios.patch(`/student/notifications/${id}/mark-read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n)));
    } catch {
      // non-critical
    }
  };

  return (
    <>
      <StudentSubTabs />
      <main style={{ padding: '24px', fontFamily: 'Inter, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>Notifications</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>Application updates from companies you've applied to.</p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            style={{ background: 'none', border: 'none', color: unreadCount === 0 ? '#cbd5e1' : '#F59E0B', fontWeight: 600, fontSize: '13px', cursor: unreadCount === 0 ? 'default' : 'pointer' }}
          >
            Mark all as read
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading notifications...</div>}
          {!loading && notifications.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No notifications yet.</div>
          )}
          {!loading && notifications.map((n, idx) => {
            const isRead = n.is_read || n.read;
            return (
            <div
              key={n.id || idx}
              onClick={() => !isRead && markOneRead(n.id)}
              style={{
                padding: '16px 20px',
                borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid #f1f5f9',
                cursor: isRead ? 'default' : 'pointer',
                backgroundColor: isRead ? '#fff' : '#fffdf7',
                display: 'flex', justifyContent: 'space-between', gap: '14px',
              }}
            >
              <div>
                <p style={{ margin: '0 0 3px 0', fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{n.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{n.message}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{n.created_at}</span>
                {!isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>}
              </div>
            </div>
          );})}
        </div>
      </main>
    </>
  );
}

export default StudentNotifications;
