'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home, Search, BookOpen, Bell, Plus, Shield, ChevronRight,
  LogOut, Settings, User, LayoutDashboard
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse Cases', icon: Search },
  { href: '/create', label: 'Create Case', icon: Plus },
  { href: '/my-cases', label: 'My Cases', icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link href="/" className="navbar-brand">
        <div className="navbar-logo">
          <Shield size={16} />
        </div>
        <span className="navbar-name">CaseAtlas</span>
      </Link>

      {/* Desktop nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 16 }}>
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
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }}
            style={{ position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {notifOpen && (
            <div className="dropdown-menu" style={{ right: 0, top: 'calc(100% + 12px)', width: 360, maxHeight: 440, overflowY: 'auto' }}>
              <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--indigo-300)', cursor: 'pointer', fontWeight: 600 }}>
                    Mark all read
                  </span>
                )}
              </div>
              {MOCK_NOTIFICATIONS.map(n => (
                <div
                  key={n.id}
                  className="dropdown-item"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 4,
                    padding: '12px 16px',
                    borderRadius: 0,
                    background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                    borderLeft: n.read ? 'none' : '2px solid var(--indigo-500)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <Bell size={13} style={{ color: 'var(--indigo-400)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{n.title}</span>
                    {!n.read && (
                      <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: 'var(--indigo-500)', flexShrink: 0 }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.body}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{timeAgo(n.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu or Login */}
        <div style={{ position: 'relative' }}>
          {isLoading ? (
            <div style={{ width: 80, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)' }} className="skeleton" />
          ) : user ? (
            <>
              <button
                onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
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
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{user.handle}</span>
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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}
