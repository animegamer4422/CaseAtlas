'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Plus, ArrowRight, Bell, MapPin, Clock, Users,
  MessageSquare, Shield, BookOpen, ChevronRight, TrendingUp,
  AlertTriangle, CheckCircle, FileText, Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { formatRelativeTime } from '@/lib/mockData';

const CATEGORY_ICONS: Record<string, string> = {
  missing_person: '👤',
  crime: '⚠️',
  harassment: '🚨',
  scam: '💸',
  accident: '🚗',
  corruption: '🏛️',
  other: '📋',
};

const STATUS_CONFIG: Record<string, { cls: string; icon: JSX.Element; label: string }> = {
  open:     { cls: 'badge-open',     icon: <CheckCircle size={10} />, label: 'Open' },
  resolved: { cls: 'badge-resolved', icon: <CheckCircle size={10} />, label: 'Resolved' },
  unknown:  { cls: 'badge-unknown',  icon: <AlertTriangle size={10} />, label: 'Unknown' },
  archived: { cls: 'badge-archived', icon: <FileText size={10} />, label: 'Archived' },
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [shake, setShake] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [allCases, setAllCases] = useState<any[]>([]);
  const [subscribedCaseIds, setSubscribedCaseIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const cases = await api.get('/cases');
        setAllCases(cases);
        if (user) {
          const subs = await api.get('/users/me/subscriptions');
          const ids = subs.map((s: any) => s.caseId?.caseId || s.caseId).filter(Boolean) as string[];
          setSubscribedCaseIds(ids);
        }
      } catch (error) {
        console.error('Failed to fetch cases', error);
      }
    };
    fetchHomeData();
  }, [user]);

  const subscribedCases = allCases.filter(c => subscribedCaseIds.includes(c.caseId));
  const recentCases = allCases.slice(0, 6);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) { triggerShake(); return; }
    const match = trimmed.match(/CA-[A-Z0-9]{4}-[A-Z0-9]{4}/i);
    const caseId = match ? match[0].toUpperCase() : trimmed;
    try {
      const results = await api.get(`/search?query=${caseId}`);
      if (results.length > 0) {
        router.push(`/case/${results[0].caseId}`);
      } else {
        setNotFound(true); triggerShake();
        setTimeout(() => setNotFound(false), 4000);
      }
    } catch {
      setNotFound(true); triggerShake();
      setTimeout(() => setNotFound(false), 4000);
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  return (
    <div style={{ padding: '0 32px 64px', position: 'relative', zIndex: 1 }}>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-eyebrow"><Shield size={12} /> Case Tracking Registry</div>
        <h1>Track any case.{' '}<span className="text-gradient">Find the truth.</span></h1>
        <p>Subscribe to cases with a unique ID, follow moderator-approved updates, and contribute to the public record.</p>

        <div className="hero-input-wrapper">
          <form onSubmit={handleSearch}>
            <div
              className="search-bar"
              style={{
                animation: shake ? 'shakeX 0.4s ease' : 'none',
                borderRadius: 'var(--radius-lg)',
                boxShadow: notFound ? '0 0 0 3px rgba(239,68,68,0.25), var(--shadow-card)' : 'var(--shadow-card)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  id="case-id-input"
                  className="input input-hero"
                  placeholder="Enter Case ID  e.g. CA-7M2K-P9QF"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setNotFound(false); }}
                  style={{ paddingLeft: 44, borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)', borderRight: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                  autoComplete="off" spellCheck={false}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', gap: 8 }}>
                Go <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {notFound && (
            <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeInDown 0.2s ease' }}>
              <AlertTriangle size={15} style={{ color: 'var(--red-400)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--red-400)' }}>No case found.</span>
              <Link href="/create" style={{ fontSize: '0.875rem', color: 'var(--indigo-300)', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>Create it →</Link>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>or</span>
          <Link href="/create" className="btn btn-secondary"><Plus size={15} /> Create a new case</Link>
          <Link href="/browse" className="btn btn-ghost"><BookOpen size={15} /> Browse all cases</Link>
        </div>
      </div>

      {/* ── Subscribed Cases ── */}
      {subscribedCases.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={15} style={{ color: 'var(--indigo-400)' }} />
              </div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Your Subscribed Cases</h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 9px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.20)', color: 'var(--indigo-300)' }}>
                {subscribedCases.length}
              </span>
            </div>
            <Link href="/my-cases" style={{ fontSize: '0.8125rem', color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: subscribedCases.length > 4 ? 440 : 'none', overflowY: subscribedCases.length > 4 ? 'auto' : 'unset' }}>
            {subscribedCases.map((c, i) => <CaseRow key={c._id} c={c} i={i} />)}
          </div>
        </section>
      )}

      {/* ── Recent Cases ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={15} style={{ color: 'var(--amber-400)' }} />
            </div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Recent Cases</h2>
          </div>
          <Link href="/browse" style={{ fontSize: '0.8125rem', color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Browse all <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentCases.map((c, i) => <CaseRow key={c._id} c={c} i={i} />)}
        </div>
      </section>

      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Unified Case Row ────────────────────────────────────────────────────────
function CaseRow({ c, i }: { c: any; i: number }) {
  const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.open;
  const emoji = CATEGORY_ICONS[c.category] || '📋';
  const subCount = Array.isArray(c.subscribers) ? c.subscribers.length : 0;

  return (
    <Link
      href={`/case/${c.caseId}`}
      style={{ textDecoration: 'none', animationDelay: `${i * 50}ms`, animationFillMode: 'both', display: 'block' }}
      className="animate-in"
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        padding: '16px 20px',
        background: 'rgba(20,20,33,0.7)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-dim)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card), var(--glow-sm)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
        }}
      >
        {/* Left: content */}
        <div style={{ minWidth: 0 }}>
          {/* Top row: emoji + status + category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>{emoji}</span>
            <span className={`badge ${sc.cls} badge-dot`}>{sc.label}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {c.category?.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 8,
          }}>
            {c.title}
          </div>

          {/* Meta row — always rendered */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} />
              {c.location || 'Unknown Location'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} />
              {formatRelativeTime(c.updatedAt || c.createdAt) || '—'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={11} />
              {subCount} subscriber{subCount !== 1 ? 's' : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageSquare size={11} />
              {c.commentCount || 0} comment{(c.commentCount || 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Right: case ID + updates */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0, gap: 8 }}>
          <span
            className="case-id-chip"
            onClick={e => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(c.caseId); }}
            title="Copy Case ID"
          >
            {c.caseId}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Zap size={11} style={{ color: c.updateCount > 0 ? 'var(--amber-400)' : 'var(--text-muted)' }} />
            {c.updateCount || 0} update{(c.updateCount || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  );
}
