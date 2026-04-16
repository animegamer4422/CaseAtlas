'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Plus, LayoutDashboard, Bell, BookOpen,
  Shield, HelpCircle, ChevronRight,
} from 'lucide-react';
import { getSubscribedCases, MOCK_NOTIFICATIONS, formatRelativeTime } from '@/lib/mockData';

const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse Cases', icon: Search },
  { href: '/create', label: 'New Case', icon: Plus },
  { href: '/my-cases', label: 'My Cases', icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const subscribedCases = getSubscribedCases();
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <aside className="sidebar">
      {/* Main Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mainLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
              {label === 'New Case' && (
                <span style={{
                  marginLeft: 'auto', width: 20, height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-700))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0,
                }}>+</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Subscribed Cases */}
      {subscribedCases.length > 0 && (
        <>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div className="sidebar-section-label">Subscribed Cases</div>
          {subscribedCases.map(c => (
            <Link
              key={c.id}
              href={`/case/${c.case_id}`}
              className={`sidebar-link ${pathname === `/case/${c.case_id}` ? 'active' : ''}`}
              style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <StatusDot status={c.status} />
                <span style={{
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1,
                }}>{c.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, paddingLeft: 20 }}>
                <span style={{ fontSize: '0.6875rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--indigo-400)' }}>{c.case_id}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  • {formatRelativeTime(c.updated_at)}
                </span>
              </div>
            </Link>
          ))}
        </>
      )}

      {/* Bottom items */}
      <div className="sidebar-bottom">
        <button className="sidebar-link">
          <HelpCircle size={18} />
          <span>Help & Guidelines</span>
        </button>
        <button className="sidebar-link">
          <Shield size={18} />
          <span>Admin Panel</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.6875rem', fontWeight: 700,
            padding: '2px 6px', borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.15)',
            color: 'var(--indigo-300)',
            border: '1px solid rgba(99,102,241,0.20)',
          }}>MOD</span>
        </button>
      </div>
    </aside>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'var(--green-400)',
    resolved: 'var(--blue-400)',
    unknown: 'var(--yellow-400)',
    archived: 'var(--text-muted)',
  };
  return (
    <span style={{
      width: 6, height: 6, borderRadius: '50%',
      background: colors[status] || 'var(--text-muted)',
      flexShrink: 0,
    }} />
  );
}
