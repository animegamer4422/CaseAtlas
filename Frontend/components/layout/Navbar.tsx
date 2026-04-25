'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Home, Search, Bell, Plus, Shield,
  LogOut, Settings, User, LayoutDashboard, Menu,
  CheckCircle, AlertCircle, MessageSquare, Info, X
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse', icon: Search },
  { href: '/create', label: 'Create', icon: Plus },
  { href: '/my-cases', label: 'My Cases', icon: LayoutDashboard },
];

// Map notification type to icon + color
function NotifIcon({ type }: { type?: string }) {
  if (type === 'update') return <CheckCircle size={14} style={{ color: 'var(--green-400)', flexShrink: 0 }} />;
  if (type === 'comment') return <MessageSquare size={14} style={{ color: 'var(--indigo-400)', flexShrink: 0 }} />;
  if (type === 'alert') return <AlertCircle size={14} style={{ color: 'var(--amber-400)', flexShrink: 0 }} />;
  return <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  // Local stateful notifications so mark-read mutations actually reflect in UI
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <nav className="navbar">
      {/* Hamburger – mobile only */}
      <button
        className="btn btn-ghost btn-icon navbar-hamburger"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Brand */}
      <Link href="/" className="navbar-brand">
        <div className="navbar-logo">
          <Shield size={16} />
        </div>
        <span className="navbar-name">CaseAtlas</span>
      </Link>

      {/* Desktop nav links */}
      <div className="navbar-links">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: active ? 'var(--indigo-300)' : 'var(--text-secondary)',
                background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--t-base)',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="navbar-spacer" />

      <div className="navbar-actions">
        {/* ── Notification Bell ── */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => { setNotifOpen(v => !v); setMenuOpen(false); }}
            style={{ position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {notifOpen && (
            <div
              className="notif-dropdown"
              style={{ position: 'absolute', right: 0, top: 'calc(100% + 12px)', zIndex: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel header */}
              <div className="notif-header">
                <div>
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount} new</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {unreadCount > 0 && (
                    <button className="notif-action-link" onClick={markAllRead}>Mark all read</button>
                  )}
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setNotifOpen(false)}
                    style={{ width: 28, height: 28 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'notif-item-unread' : ''}`}
                      onClick={() => {
                        markRead(n.id);
                        if (n.caseId) router.push(`/case/${n.caseId}`);
                        setNotifOpen(false);
                      }}
                      style={{ cursor: n.caseId ? 'pointer' : 'default' }}
                    >
                      <div className="notif-icon-wrap">
                        <NotifIcon type={n.type} />
                      </div>
                      <div className="notif-content">
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-body">{n.body}</div>
                        <div className="notif-item-time">{timeAgo(n.created_at)}</div>
                      </div>
                      {!n.read && <span className="notif-unread-dot" />}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="notif-footer">
                <Link href="/notifications" onClick={() => setNotifOpen(false)} className="notif-action-link">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── User menu or Login ── */}
        <div style={{ position: 'relative' }}>
          {isLoading ? (
            <div style={{ width: 80, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)' }} className="skeleton" />
          ) : user ? (
            <>
              <button
                onClick={() => { setMenuOpen(v => !v); setNotifOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 6px 4px 12px',
                  cursor: 'pointer',
                  transition: 'all var(--t-base)',
                }}
              >
                <span className="navbar-username">{user.handle}</span>
                <div className="avatar avatar-sm" style={{ backgroundColor: user.avatarColor }}>{user.avatarInitials}</div>
              </button>

              {menuOpen && (
                <div className="dropdown-menu" style={{ right: 0, top: 'calc(100% + 8px)', minWidth: 200 }}>
                  <Link href="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}><User size={15} /> Profile</Link>
                  <Link href="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}><Settings size={15} /> Settings</Link>
                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                  <button className="dropdown-item danger" onClick={() => { logout(); setMenuOpen(false); }}><LogOut size={15} /> Sign out</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop to close dropdowns */}
      {(notifOpen || menuOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => { setNotifOpen(false); setMenuOpen(false); }}
        />
      )}
    </nav>
  );
}
