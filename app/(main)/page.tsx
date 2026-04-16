'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Plus, ArrowRight, Bell, MapPin, Clock, Users,
  MessageSquare, AlertTriangle, Shield, Zap, BookOpen,
  ChevronRight, Star, TrendingUp,
} from 'lucide-react';
import {
  getAllCases, getSubscribedCases, getCategoryLabel,
  formatRelativeTime, getCaseById, Case
} from '@/lib/mockData';

const CATEGORY_ICONS: Record<string, string> = {
  missing_person: '👤',
  crime: '⚠️',
  harassment: '🚨',
  scam: '💸',
  accident: '🚗',
  corruption: '🏛️',
  other: '📋',
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [shake, setShake] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [subscribedCases, setSubscribedCases] = useState<Case[]>([]);

  useEffect(() => {
    setAllCases(getAllCases());
    setSubscribedCases(getSubscribedCases());
  }, []);

  const recentCases = allCases.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) { triggerShake(); return; }

    // Extract case ID from full URL or raw ID
    const match = trimmed.match(/CA-[A-Z0-9]{4}-[A-Z0-9]{4}/i);
    const caseId = match ? match[0].toUpperCase() : trimmed.toUpperCase();

    const found = getCaseById(caseId);
    if (found) {
      router.push(`/case/${found.case_id}`);
    } else {
      setNotFound(true);
      triggerShake();
      setTimeout(() => setNotFound(false), 4000);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={{ padding: '0 32px 48px', position: 'relative', zIndex: 1 }}>

      {/* ─── Hero ─── */}
      <div className="hero">
        <div className="hero-eyebrow">
          <Shield size={12} />
          Case Tracking Registry
        </div>
        <h1>
          Track any case.{' '}
          <span className="text-gradient">Find the truth.</span>
        </h1>
        <p>
          Subscribe to cases with a unique ID, follow moderator-approved updates, and contribute to the public record.
        </p>

        {/* Case ID input */}
        <div className="hero-input-wrapper">
          <form onSubmit={handleSearch}>
            <div
              className="search-bar"
              style={{
                animation: shake ? 'shakeX 0.4s ease' : 'none',
                borderRadius: 'var(--radius-lg)',
                boxShadow: notFound
                  ? '0 0 0 3px rgba(239,68,68,0.25), var(--shadow-card)'
                  : 'var(--shadow-card)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute', left: 16, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none',
                  }}
                />
                <input
                  id="case-id-input"
                  className="input input-hero"
                  placeholder="Enter Case ID  e.g. CA-7M2K-P9QF"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setNotFound(false); }}
                  style={{ paddingLeft: 44, borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)', borderRight: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', gap: 8 }}
              >
                Go <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {notFound && (
            <div style={{
              marginTop: 10,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.20)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'fadeInDown 0.2s ease',
            }}>
              <AlertTriangle size={15} style={{ color: 'var(--red-400)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--red-400)' }}>
                No case found with that ID.{' '}
              </span>
              <Link href="/create" style={{ fontSize: '0.875rem', color: 'var(--indigo-300)', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                Create it →
              </Link>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>or</span>
          <Link href="/create" className="btn btn-secondary">
            <Plus size={15} /> Create a new case
          </Link>
          <Link href="/browse" className="btn btn-ghost">
            <BookOpen size={15} /> Browse all cases
          </Link>
        </div>
      </div>

      {/* ─── Your Subscribed Cases ─── */}
      {subscribedCases.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={18} style={{ color: 'var(--indigo-400)' }} />
              <h2 style={{ fontSize: '1.125rem', margin: 0 }}>Your Subscribed Cases</h2>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.20)',
                color: 'var(--indigo-300)',
              }}>{subscribedCases.length}</span>
            </div>
            <Link href="/my-cases" style={{ fontSize: '0.8125rem', color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subscribedCases.map((c, i) => (
              <CaseCard key={c.id} caseItem={c} animDelay={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Recent Cases ─── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} style={{ color: 'var(--amber-400)' }} />
            <h2 style={{ fontSize: '1.125rem', margin: 0 }}>Recent Cases</h2>
          </div>
          <Link href="/browse" style={{ fontSize: '0.8125rem', color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Browse all <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentCases.map((c, i) => (
            <CaseCard key={c.id} caseItem={c} animDelay={i} />
          ))}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section style={{ marginTop: 56 }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>How CaseAtlas Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { icon: Search, title: 'Enter a Case ID', desc: 'Every case has a unique ID like CA-7M2K-P9QF. Paste it or search directly.' },
            { icon: Bell, title: 'Subscribe', desc: 'Get notified when moderators publish approved official updates.' },
            { icon: MessageSquare, title: 'Discuss', desc: 'Add context, share observations, and help piece together the picture.' },
            { icon: Shield, title: 'Moderated', desc: 'Only moderator-approved updates trigger notifications — signal, not noise.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                background: 'rgba(99,102,241,0.10)',
                border: '1px solid rgba(99,102,241,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--indigo-400)', marginBottom: 14,
              }}>
                <Icon size={18} />
              </div>
              <h4 style={{ marginBottom: 6, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{title}</h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
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

function CaseCard({ caseItem: c, animDelay }: { caseItem: Case; animDelay: number }) {
  const statusColors: Record<string, string> = {
    open: 'badge-open',
    resolved: 'badge-resolved',
    unknown: 'badge-unknown',
    archived: 'badge-archived',
  };

  const categoryEmoji = CATEGORY_ICONS[c.category] || '📋';

  return (
    <Link
      href={`/case/${c.case_id}`}
      className="card interactive animate-in"
      style={{ textDecoration: 'none', animationDelay: `${animDelay * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="case-card">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{categoryEmoji}</span>
            <span className={`badge ${statusColors[c.status]} badge-dot`}>
              {c.status}
            </span>
            {c.visibility === 'unlisted' && (
              <span className="badge" style={{ background: 'rgba(100,100,160,0.10)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', fontSize: '0.6875rem' }}>Unlisted</span>
            )}
          </div>
          <div className="case-card-title">{c.title}</div>
          <div className="case-card-meta" style={{ marginTop: 6 }}>
            <span><MapPin size={12} /> {c.location_text}</span>
            <span><Clock size={12} /> {formatRelativeTime(c.updated_at)}</span>
            <span><Users size={12} /> {c.subscriber_count.toLocaleString()}</span>
            <span><MessageSquare size={12} /> {c.comment_count}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span
            className="case-id-chip"
            onClick={e => { e.preventDefault(); navigator.clipboard.writeText(c.case_id); }}
            title="Copy Case ID"
          >
            {c.case_id}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {c.update_count} update{c.update_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
