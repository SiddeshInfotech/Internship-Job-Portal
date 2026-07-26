import React, { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';

// axiosInstance: that role's own axios client (axiosClient/clientAxios/studentAxios)
// rolePrefix: 'admin' | 'client' | 'student'
// onViewAll: optional — called when "View all notifications" is clicked,
// for roles with a dedicated full Notifications page to route to.
function NotificationBell({ axiosInstance, rolePrefix, onViewAll }) {
  const { notifications, unreadCount, loading, markAllRead, markOneRead } = useNotifications(axiosInstance, rolePrefix);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (n) => {
    if (!(n.is_read || n.read)) markOneRead(n.id);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', zIndex: 60 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
        aria-label="Notifications"
      >
        <FiBell size={19} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-6px', minWidth: '16px', height: '16px', padding: '0 3px',
            borderRadius: '9px', background: '#ea580c', color: '#fff', fontSize: '10px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '340px', maxHeight: '420px',
          background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(15,23,42,0.15)',
          zIndex: 1200, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && <p style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading...</p>}
            {!loading && notifications.length === 0 && (
              <p style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No notifications yet.</p>
            )}
            {!loading && notifications.slice(0, 10).map((n) => {
              const isRead = n.is_read || n.read;
              return (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  style={{
                    padding: '12px 16px', borderBottom: '1px solid #f8fafc', cursor: isRead ? 'default' : 'pointer',
                    background: isRead ? '#fff' : '#fffdf7', display: 'flex', gap: '10px',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isRead ? 'transparent' : '#ea580c', marginTop: '6px', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{n.title}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.message}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>{n.created_at}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {onViewAll && (
            <button
              onClick={() => { setOpen(false); onViewAll(); }}
              style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#f8fafc', border: 'none', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
            >
              View all notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
