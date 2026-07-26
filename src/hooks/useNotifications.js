import { useState, useEffect, useCallback } from 'react';
import { asArray } from '../api/asArray';

// Works for any role — pass that role's own axios instance (axiosClient,
// clientAxios, or studentAxios) so the right token/interceptor is used.
// rolePrefix: 'admin' | 'client' | 'student'
export function useNotifications(axiosInstance, rolePrefix) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/${rolePrefix}/notifications`);
      const list = asArray(res.data.notifications, res.data.results, res.data);
      setNotifications(list);
      // Prefer the server's own unread_count; fall back to counting locally
      // in case that field is ever missing, rather than showing nothing.
      setUnreadCount(res.data.unread_count ?? list.filter((n) => !n.is_read && !n.read).length);
    } catch {
      // Notifications are non-critical — fail quietly rather than showing
      // an error banner on every page that has a bell icon.
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, rolePrefix]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await axiosInstance.patch(`/${rolePrefix}/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
      setUnreadCount(0);
    } catch {
      // non-critical, ignore
    }
  };

  const markOneRead = async (id) => {
    try {
      await axiosInstance.patch(`/${rolePrefix}/notifications/${id}/mark-read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // non-critical, ignore
    }
  };

  return { notifications, unreadCount, loading, refetch: fetchNotifications, markAllRead, markOneRead };
}
