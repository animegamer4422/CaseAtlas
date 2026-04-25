'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Plus, LayoutDashboard,
  Shield, BookOpen, X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

function fmtDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse Cases', icon: Search },
  { href: '/create', label: 'New Case', icon: Plus },
  { href: '/my-cases', label: 'My Cases', icon: LayoutDashboard },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [subscribedCases, setSubscribedCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubs = () => {
      if (user) {
        api.get('/users/me/subscriptions')
          .then(subs => {
            setSubscribedCases(subs.map((s: any) => s.caseId));
          })
          .catch(console.error);
      } else {
        setSubscribedCases([]);
      }
    };

    fetchSubs();

    window.addEventListener('subscription_updated', fetchSubs);
    return () => window.removeEventListener('subscription_updated', fetchSubs);
  }, [user, pathname]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    onClose?.();
  }, [pathname]);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile close button */}
      <button
        className="sidebar-close-btn"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X size={20} />
      </button>

      {/* ── Zone 1: Top nav – always visible ── */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
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

      {/* ── Zone 2: Subscribed cases – scrolls independently ── */}
      {subscribedCases.length > 0 && (
        <div style={{
          flex: 1,
          minHeight: 0, // critical: allows flex child to shrink below content size
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div className="divider" style={{ margin: '12px 0', flexShrink: 0 }} />
          <div className="sidebar-section-label" style={{ flexShrink: 0 }}>Subscribed Cases</div>

          {/* Scrollable list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: 2,
          }}>
            {subscribedCases.filter(c => c).map(c => (
              <Link
                key={c._id}
                href={`/case/${c.caseId}`}
                className={`sidebar-link ${pathname === `/case/${c.caseId}` ? 'active' : ''}`}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3, paddingLeft: 20 }}>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--indigo-400)' }}>{c.caseId}</span>
                  <span style={{ fontSize: '0.6375rem', color: 'var(--text-muted)' }}>
                    Filed {fmtDate(c.createdAt) || '—'}
                  </span>
                  {c.lastUpdateAt && (
                    <span style={{ fontSize: '0.6375rem', color: 'var(--indigo-400)', opacity: 0.7 }}>
                      Updated {fmtDate(c.lastUpdateAt)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Zone 3: Bottom – always visible ── */}
      <div className="sidebar-bottom">
        <Link href="/usage" className={`sidebar-link ${pathname === '/usage' ? 'active' : ''}`}>
          <BookOpen size={18} />
          <span>Platform Guide</span>
        </Link>
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
