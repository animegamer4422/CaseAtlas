'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Filter, MapPin, Clock, Users, MessageSquare,
  ChevronDown, SlidersHorizontal, X,
} from 'lucide-react';
import { getCategoryLabel, formatRelativeTime } from '@/lib/mockData';
import { api } from '@/lib/api';

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
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading cases...</div>}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        let endpoint = '/search?';
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (categoryFilter) params.append('category', categoryFilter);
        if (statusFilter) params.append('status', statusFilter);

        const data = await api.get(endpoint + params.toString());
        setCases(data);
      } catch (error) {
        console.error('Failed to search cases', error);
      }
    };
    
    // Debounce query
    const timeout = setTimeout(fetchCases, 300);
    return () => clearTimeout(timeout);
  }, [query, categoryFilter, statusFilter]);

  const hasFilters = categoryFilter || statusFilter;

  return (
    <div style={{ padding: '28px 32px 48px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Browse Cases</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {cases.length} public cases
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input"
            placeholder="Search by title, description, or Case ID…"
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
        {cases.length} case{cases.length !== 1 ? 's' : ''} found
        {query && <> matching "<span style={{ color: 'var(--text-secondary)' }}>{query}</span>"</>}
      </div>

      {/* Cases grid */}
      {cases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={24} /></div>
          <h3>No matching cases</h3>
          <p>Try a different search term or clear your filters.</p>
          <Link href="/create" className="btn btn-primary" style={{ marginTop: 12 }}>Create this case</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!hasFilters && !query && cases.length > 0 && (
            <div style={{ marginBottom: 24, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.1)', color: 'var(--amber-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} />
                </div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Trending Cases</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cases.slice(0, 3).map((c, i) => (
                  <BrowseCaseCard key={c._id} caseItem={c} animDelay={i} />
                ))}
              </div>
              <div style={{ margin: '32px 0 20px', height: 1, background: 'var(--border-subtle)' }} />
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 16px', fontWeight: 700 }}>All Cases</h2>
            </div>
          )}

          {(!hasFilters && !query ? cases.slice(3) : cases).map((c, i) => (
            <BrowseCaseCard key={c._id} caseItem={c} animDelay={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function BrowseCaseCard({ caseItem: c, animDelay }: { caseItem: any; animDelay: number }) {
  const statusColors: Record<string, string> = {
    open: 'badge-open', resolved: 'badge-resolved',
    unknown: 'badge-unknown', archived: 'badge-archived',
  };

  return (
    <Link
      href={`/case/${c.caseId}`}
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
            {c.description}
          </p>
          <div className="case-card-meta" style={{ marginTop: 8 }}>
            <span><MapPin size={12} /> {c.location || 'Unknown'}</span>
            <span><Clock size={12} /> {formatRelativeTime(c.updatedAt || c.createdAt)}</span>
            <span><Users size={12} /> {c.subscribers?.length || 0}</span>
            <span><MessageSquare size={12} /> {c.commentCount || 0}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span className="case-id-chip" style={{ cursor: 'default' }}>{c.caseId}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {c.updateCount || 0} update{(c.updateCount || 0) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
