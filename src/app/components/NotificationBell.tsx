import React, { useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";

const NOTIFICATIONS_API = "/api/notifications";

function relativeTime(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'all'|'unread'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let timer: any;
    function fetchNotifications() {
      fetch(NOTIFICATIONS_API)
        .then(res => res.json())
        .then(data => {
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.read).length);
        });
    }
    fetchNotifications();
    timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Play sound on new notification
    if (soundEnabled && notifications.some((n: any) => !n.read)) {
      const audio = new Audio('/notification.mp3');
      audio.play();
    }
  }, [notifications, soundEnabled]);

  function markRead(id: string) {
    fetch(`${NOTIFICATIONS_API}/read`, { method: 'PATCH', body: JSON.stringify({ id }) });
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    setUnreadCount(n => n - 1);
  }

  function markAllRead() {
    fetch(`${NOTIFICATIONS_API}/read-all`, { method: 'PATCH' });
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }

  function handleClick(notif: any) {
    markRead(notif.id);
    if (notif.url) window.location.href = notif.url;
  }

  const filtered = tab === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer', position: 'relative' }}>
        <BellOutlined style={{ fontSize: 24 }} />
        {unreadCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: 'red', borderRadius: '50%', width: 10, height: 10 }} />}
      </span>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 32, width: 340, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 8, zIndex: 999 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <button style={{ flex: 1, padding: 8, background: tab==='all'?'#f0f6ff':'#fff', border: 'none' }} onClick={() => setTab('all')}>All</button>
            <button style={{ flex: 1, padding: 8, background: tab==='unread'?'#f0f6ff':'#fff', border: 'none' }} onClick={() => setTab('unread')}>Unread</button>
            <label style={{ marginLeft: 'auto', padding: 8 }}>
              <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />🔊
            </label>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>No notifications</div>
            ) : filtered.map(notif => (
              <div key={notif.id} style={{ display: 'flex', alignItems: 'center', padding: 12, borderBottom: '1px solid #eee', background: notif.read ? '#fff' : '#fef3c7', cursor: 'pointer' }} onClick={() => handleClick(notif)}>
                <span style={{ marginRight: 12 }}>{notif.icon || '🔔'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: notif.read ? 'normal' : 'bold' }}>{notif.title}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{notif.message}</div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>{relativeTime(notif.time)}</div>
                </div>
                {!notif.read && <button style={{ marginLeft: 8, fontSize: 12 }} onClick={e => { e.stopPropagation(); markRead(notif.id); }}>Mark read</button>}
              </div>
            ))}
          </div>
          <div style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>
            <button onClick={markAllRead} style={{ background: '#FF9933', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4 }}>Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}
