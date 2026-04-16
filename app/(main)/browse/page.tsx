'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Filter, MapPin, Clock, Users, MessageSquare,
  ChevronDown, SlidersHorizontal, X,
} from 'lucide-react';
import { getAllCases, getCategoryLabel, formatRelativeTime, Case, CaseCategory } from '@/lib/mockData';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'missing_person', label: 'Missing Person' },
  { value: 'crime', label: 'Crime' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'scam', label: 'Scam / Fraud' },
  { value: 'accident', label: 'Accident' },
  { value: 'corruption', label: 'Corruption' },
  { value: 'other', label: 'Other' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'unknown', label: 'Unknown' },
];

const CATEGORY_ICONS: Record<string, string> = {
  missing_person: '👤', crime: '⚠️', harassment: '🚨',
  scam: '💸', accident: '🚗', corruption: '🏛️', other: '📋',
};

export default function BrowsePage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    setCases(getAllCases());
  }, []);

  const filtered = cases.filter(c => {
    const q = query.toLowerCase();
    const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.case_id.toLowerCase().includes(q) || c.location_text.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || c.category === categoryFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesQuery && matchesCat && matchesStatus;
  });

  const hasFilters = categoryFilter || statusFilter;

  return (
    <div style={{ padding: '28px 32px 48px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Browse Cases</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {cases.length} public cases · All visibility: public
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input"
            placeholder="Search by title, location, or Case ID…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <button
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFilters(f => !f)}
          style={{ gap: 7 }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber-400)' }} />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card animate-in" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: 1, minWidth: 180 }}>
            <label className="input-label">Category</label>
            <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="input-label">Status</label>
            <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setCategoryFilter(''); setStatusFilter(''); }}
              style={{ gap: 5, color: 'var(--red-400)' }}
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Result count */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 14 }}>
        {filtered.length} case{filtered.length !== 1 ? 's' : ''} found
        {query && <> matching "<span style={{ color: 'var(--text-secondary)' }}>{query}</span>"</>}
      </div>

      {/* Cases grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={24} /></div>
          <h3>No matching cases</h3>
          <p>Try a different search term or clear your filters.</p>
          <Link href="/create" className="btn btn-primary" style={{ marginTop: 12 }}>Create this case</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((c, i) => (
            <BrowseCaseCard key={c.id} caseItem={c} animDelay={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function BrowseCaseCard({ caseItem: c, animDelay }: { caseItem: Case; animDelay: number }) {
  const statusColors: Record<string, string> = {
    open: 'badge-open', resolved: 'badge-resolved',
    unknown: 'badge-unknown', archived: 'badge-archived',
  };

  return (
    <Link
      href={`/case/${c.case_id}`}
      className="card interactive animate-in"
      style={{ textDecoration: 'none', animationDelay: `${animDelay * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="case-card">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[c.category] || '📋'}</span>
            <span className={`badge ${statusColors[c.status]} badge-dot`}>{c.status}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getCategoryLabel(c.category)}</span>
          </div>
          <div className="case-card-title">{c.title}</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {c.summary}
          </p>
          <div className="case-card-meta" style={{ marginTop: 8 }}>
            <span><MapPin size={12} /> {c.location_text}</span>
            <span><Clock size={12} /> {formatRelativeTime(c.updated_at)}</span>
            <span><Users size={12} /> {c.subscriber_count.toLocaleString()}</span>
            <span><MessageSquare size={12} /> {c.comment_count}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span className="case-id-chip" style={{ cursor: 'default' }}>{c.case_id}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {c.update_count} update{c.update_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
