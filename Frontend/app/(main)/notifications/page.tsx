'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, CheckCircle, MessageSquare, AlertCircle, Info,
  CheckCheck, Trash2, ChevronLeft, ArrowRight,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';

type Notif = typeof MOCK_NOTIFICATIONS[number] & { read: boolean };

function NotifIcon({ type }: { type?: string }) {
  if (type === 'update')  return <CheckCircle size={16} style={{ color: 'var(--green-400)' }} />;
  if (type === 'comment') return <MessageSquare size={16} style={{ color: 'var(--indigo-400)' }} />;
  if (type === 'alert')   return <AlertCircle size={16} style={{ color: 'var(--amber-400)' }} />;
  return <Info size={16} style={{ color: 'var(--text-muted)' }} />;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 1) return `${d} days ago`;
  if (d === 1) return 'Yesterday';
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

const TYPE_LABELS: Record<string, string> = {
  update: 'Official Update',
  comment: 'New Comment',
  alert: 'Alert',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>(
    MOCK_NOTIFICATIONS.map(n => ({ ...n, read: n.read ?? false }))
  );

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifs([]);

  const handleClick = (n: Notif) => {
    markRead(n.id);
    if (n.caseId) router.push(`/case/${n.caseId}`);
  };

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <Link
        href="/"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: 24 }}
      >
        <ChevronLeft size={14} /> Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-lg)',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={18} style={{ color: 'var(--indigo-400)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Notifications
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={markAllRead}
              style={{ gap: 6 }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          {notifs.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={clearAll}
              style={{ gap: 6, color: 'var(--text-muted)' }}
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {notifs.length === 0 && (
        <div className="empty-state" style={{ marginTop: 48 }}>
          <div className="empty-icon"><Bell size={24} /></div>
          <h3>No notifications</h3>
          <p>You're all caught up. Subscribe to cases to receive updates.</p>
          <Link href="/browse" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            Browse Cases <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Notification list */}
      {notifs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifs.map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '16px 18px',
                background: n.read ? 'rgba(20,20,33,0.5)' : 'rgba(99,102,241,0.05)',
                border: `1px solid ${n.read ? 'var(--border-subtle)' : 'rgba(99,102,241,0.20)'}`,
                borderLeft: n.read ? '1px solid var(--border-subtle)' : '3px solid var(--indigo-500)',
                borderRadius: 'var(--radius-xl)',
                cursor: n.caseId ? 'pointer' : 'default',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onClick={() => handleClick(n)}
            >
              {/* Icon */}
              <div style={{
                width: 38, height: 38, flexShrink: 0,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <NotifIcon type={(n as any).type} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  {(n as any).type && (
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99,102,241,0.10)', color: 'var(--indigo-300)',
                      border: '1px solid rgba(99,102,241,0.15)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {TYPE_LABELS[(n as any).type] || (n as any).type}
                    </span>
                  )}
                  {!n.read && (
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--indigo-500)', display: 'inline-block', boxShadow: '0 0 6px rgba(99,102,241,0.6)' }} />
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                  {n.body}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {timeAgo(n.created_at)}
                  </span>
                  {n.caseId && (
                    <span style={{
                      fontSize: '0.6875rem', fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--indigo-400)', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {n.caseId} <ArrowRight size={10} />
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!n.read && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={e => { e.stopPropagation(); markRead(n.id); }}
                    title="Mark as read"
                    style={{ width: 30, height: 30, padding: 0 }}
                  >
                    <CheckCheck size={13} />
                  </button>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  title="Dismiss"
                  style={{ width: 30, height: 30, padding: 0 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
