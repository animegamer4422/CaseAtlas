'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Bell, MapPin, Clock, Users,
  MessageSquare, Filter, ChevronDown, Shield,
} from 'lucide-react';
import { getCategoryLabel, formatRelativeTime } from '@/lib/mockData';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

const CATEGORY_ICONS: Record<string, string> = {
  missing_person: '👤', crime: '⚠️', harassment: '🚨',
  scam: '💸', accident: '🚗', corruption: '🏛️', other: '📋',
};

const TABS = [
  { id: 'subscribed', label: 'Subscribed', icon: Bell },
  { id: 'created', label: 'Created by Me', icon: LayoutDashboard },
];

export default function MyCasesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('subscribed');
  
  const [subscribed, setSubscribed] = useState<any[]>([]);
  const [created, setCreated] = useState<any[]>([]);
  const [moderating, setModerating] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch subscriptions
    api.get('/users/me/subscriptions')
      .then(subs => {
        setSubscribed(subs.map((s: any) => s.caseId));
      })
      .catch(console.error);

    // Fetch all cases and filter
    api.get('/cases')
      .then(allCases => {
        setCreated(allCases.filter((c: any) => c.createdBy._id === user._id));
        setModerating(allCases.filter((c: any) => 
          c.moderators.some((m: any) => m._id === user._id || m === user._id)
        ));
      })
      .catch(console.error);
  }, [user]);

  const cases = activeTab === 'subscribed' ? subscribed : created;

  return (
    <div style={{ padding: '28px 32px 48px', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>My Cases</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track your subscriptions and manage cases you've created.</p>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        <div className="stat-box">
          <div className="stat-box-value" style={{ color: 'var(--indigo-300)' }}>{subscribed.length}</div>
          <div className="stat-box-label">Subscribed</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value" style={{ color: 'var(--amber-400)' }}>{created.length}</div>
          <div className="stat-box-label">Created</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value" style={{ color: 'var(--green-400)' }}>{moderating.length}</div>
          <div className="stat-box-label">Moderating</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`tab ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Case list */}
      {cases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {activeTab === 'subscribed' ? <Bell size={24} /> : <LayoutDashboard size={24} />}
          </div>
          <h3>{activeTab === 'subscribed' ? 'No subscriptions yet' : 'No cases created'}</h3>
          <p>
            {activeTab === 'subscribed'
              ? 'Subscribe to any case from its page to track official updates.'
              : 'Create a case to start tracking an incident.'}
          </p>
          <Link href={activeTab === 'subscribed' ? '/' : '/create'} className="btn btn-primary" style={{ marginTop: 12 }}>
            {activeTab === 'subscribed' ? 'Find a case' : 'Create case'}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cases.map((c, i) => {
            const isMod = activeTab === 'created' || moderating.some(m => m._id === c._id);
            return <MyCaseCard key={c._id} caseItem={c} animDelay={i} isMod={isMod} />
          })}
        </div>
      )}
    </div>
  );
}

function MyCaseCard({ caseItem: c, animDelay, isMod }: { caseItem: any; animDelay: number; isMod: boolean }) {
  const statusColors: Record<string, string> = {
    open: 'badge-open', resolved: 'badge-resolved',
    unknown: 'badge-unknown', archived: 'badge-archived',
  };

  return (
    <Link
      href={`/case/${c.caseId}`}
      className="card interactive animate-in"
      style={{ textDecoration: 'none', animationDelay: `${animDelay * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="case-card">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[c.category] || '📋'}</span>
            <span className={`badge ${statusColors[c.status]} badge-dot`}>{c.status}</span>
            {isMod && (
              <span className="badge" style={{ background: 'rgba(245,158,11,0.10)', color: 'var(--amber-400)', border: '1px solid rgba(245,158,11,0.20)', fontSize: '0.6875rem' }}>
                <Shield size={10} style={{marginRight: 4, display: 'inline'}}/> Moderator
              </span>
            )}
          </div>
          <div className="case-card-title">{c.title}</div>
          <div className="case-card-meta" style={{ marginTop: 6 }}>
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
