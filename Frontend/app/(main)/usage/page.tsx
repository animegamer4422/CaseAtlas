'use client';

import {
  Shield, Search, Bell, MessageSquare, Plus,
  Users, CheckCircle, AlertTriangle, BookOpen,
  Lock, TrendingUp, FileText, Star, Zap,
  ChevronLeft, Globe, Eye, HelpCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function UsagePage() {
  return (
    <div style={{ padding: '0 32px 64px', position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>

      {/* Back link */}
      <Link
        href="/"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', marginTop: 24, marginBottom: 32, transition: 'color 0.2s' }}
      >
        <ChevronLeft size={14} /> Back to home
      </Link>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 16px', borderRadius: 'var(--radius-full)',
          background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)',
          fontSize: '0.8125rem', fontWeight: 600, color: 'var(--indigo-300)',
          marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase'
        }}>
          <Shield size={13} /> Platform Guide
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>
          How{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--indigo-300), var(--indigo-500), var(--amber-400))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>CaseAtlas</span>{' '}
          Works
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          A structured, community-powered platform for tracking real-world civil cases — built on transparency, accountability, and verified information.
        </p>
      </div>

      {/* Core Concept */}
      <section style={{ marginBottom: 48 }}>
        <SectionLabel icon={<Globe size={14} />} text="The Core Idea" />
        <div className="card" style={{ padding: 28 }}>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
            CaseAtlas is a public registry for real civil, criminal, and social cases. Every case gets a
            unique <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--indigo-300)', fontSize: '0.875rem' }}>CA-XXXX-XXXX</span>{' '}
            identifier — a permanent address that anyone can search, share, or subscribe to.
            All official updates are gated through a moderation layer so the public record stays clean and signal-over-noise.
          </p>
        </div>
      </section>

      {/* How it works steps */}
      <section style={{ marginBottom: 48 }}>
        <SectionLabel icon={<Zap size={14} />} text="Step-by-Step" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-lg)', flexShrink: 0,
                background: `rgba(${step.rgb},0.12)`, border: `1px solid rgba(${step.rgb},0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: `rgb(${step.rgb})`,
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6875rem', fontWeight: 700,
                    color: `rgb(${step.rgb})`, letterSpacing: '0.05em',
                    background: `rgba(${step.rgb},0.10)`, padding: '2px 8px',
                    borderRadius: 'var(--radius-full)', border: `1px solid rgba(${step.rgb},0.20)`
                  }}>Step {i + 1}</span>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{step.title}</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section style={{ marginBottom: 48 }}>
        <SectionLabel icon={<Users size={14} />} text="Who Does What" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {ROLES.map(r => (
            <div key={r.title} className="card" style={{ padding: 22 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 'var(--radius-md)', marginBottom: 14,
                background: `rgba(${r.rgb},0.10)`, border: `1px solid rgba(${r.rgb},0.20)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: `rgb(${r.rgb})`
              }}>
                {r.icon}
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{r.title}</h4>
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {r.perms.map(p => (
                  <li key={p} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Moderation */}
      <section style={{ marginBottom: 48 }}>
        <SectionLabel icon={<CheckCircle size={14} />} text="Moderation & Trust" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TRUST_ITEMS.map(t => (
            <div key={t.title} className="card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)', flexShrink: 0, marginTop: 2,
                background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-400)'
              }}>
                {t.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section style={{ marginBottom: 56 }}>
        <SectionLabel icon={<Lock size={14} />} text="Privacy & Visibility" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {VISIBILITY.map(v => (
            <div key={v.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-xl)', margin: '0 auto 14px',
                background: `rgba(${v.rgb},0.10)`, border: `1px solid rgba(${v.rgb},0.20)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: `rgb(${v.rgb})`
              }}>
                {v.icon}
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{v.label}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="card card-glow" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
        <h2 style={{ fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>Ready to get started?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          Search a case by ID, browse what's happening, or create a new case to put something on the record.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/browse" className="btn btn-primary">
            <BookOpen size={15} /> Browse Cases
          </Link>
          <Link href="/create" className="btn btn-secondary">
            <Plus size={15} /> Create a Case
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ color: 'var(--indigo-400)' }}>{icon}</span>
      <span style={{
        fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.10em', color: 'var(--text-muted)'
      }}>{text}</span>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: <Search size={18} />, rgb: '99,102,241',
    title: 'Find or Create a Case',
    desc: 'Enter a known Case ID directly in the search bar, browse existing cases, or create a new case by providing a title, description, category, and location. Every submitted case is assigned a unique CA-XXXX-XXXX identifier instantly.',
  },
  {
    icon: <Bell size={18} />, rgb: '251,191,36',
    title: 'Subscribe',
    desc: 'Hit Subscribe on any case to add it to your tracked list. You\'ll see it pinned in your sidebar and on the home dashboard. Subscriptions are private — no one sees who is watching a case.',
  },
  {
    icon: <FileText size={18} />, rgb: '74,222,128',
    title: 'Follow Official Updates',
    desc: 'Moderators post verified, approved updates on the case timeline. These are labelled "Official Update" and represent facts confirmed through credible sources. Pending updates are visible only to moderators until approved.',
  },
  {
    icon: <MessageSquare size={18} />, rgb: '96,165,250',
    title: 'Participate in Discussion',
    desc: 'Comment with context, witness observations, or relevant links. You can also attach images, videos, and documents to your comments. Discussions are public and community-moderated.',
  },
  {
    icon: <TrendingUp size={18} />, rgb: '167,139,250',
    title: 'Discover Trending Cases',
    desc: 'The Browse page surfaces trending cases based on subscriber activity, update frequency, and community engagement. Trending cases help surface matters that need more public attention.',
  },
];

const ROLES = [
  {
    title: 'Public User', rgb: '96,165,250', icon: <Users size={16} />,
    perms: ['Browse and search all public cases', 'View approved official updates', 'Read community discussions'],
  },
  {
    title: 'Registered Member', rgb: '99,102,241', icon: <Star size={16} />,
    perms: ['Everything public users can do', 'Subscribe to cases', 'Post comments with media', 'Create new cases'],
  },
  {
    title: 'Moderator', rgb: '251,191,36', icon: <Shield size={16} />,
    perms: ['Post official updates', 'Approve pending updates', 'Manage case status', 'Moderate discussions'],
  },
  {
    title: 'Administrator', rgb: '74,222,128', icon: <CheckCircle size={16} />,
    perms: ['Full moderator access', 'Assign moderator roles', 'Archive or delete cases', 'System configuration'],
  },
];

const TRUST_ITEMS = [
  {
    icon: <CheckCircle size={16} />,
    title: 'Two-tier Updates',
    desc: 'All official updates enter a pending state until a moderator reviews and approves them. This prevents misinformation from spreading as "official" content.',
  },
  {
    icon: <Eye size={16} />,
    title: 'Transparent Record',
    desc: 'Every approved update and comment is timestamped and attributed. The public can see the full chronological history of a case including who posted what and when.',
  },
  {
    icon: <AlertTriangle size={16} />,
    title: 'Community Flagging',
    desc: 'Registered members can flag comments that contain misinformation, personal information, or inappropriate content. Flagged items are reviewed by moderators within 24 hours.',
  },
  {
    icon: <Lock size={16} />,
    title: 'No Anonymous Posting',
    desc: 'All comments and updates are tied to verified accounts. This maintains accountability and reduces bad-faith posting while keeping personal data private from other users.',
  },
];

const VISIBILITY = [
  {
    label: 'Public', rgb: '74,222,128', icon: <Globe size={18} />,
    desc: 'Visible to everyone, indexed and discoverable in Browse and search.',
  },
  {
    label: 'Unlisted', rgb: '251,191,36', icon: <Eye size={18} />,
    desc: 'Accessible only via direct Case ID link. Not shown in Browse or search results.',
  },
  {
    label: 'Private', rgb: '248,113,113', icon: <Lock size={18} />,
    desc: 'Visible only to the case creator and assigned moderators.',
  },
];
