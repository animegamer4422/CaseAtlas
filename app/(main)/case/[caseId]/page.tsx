'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, BellOff, Share2, Copy, Check, MapPin, Calendar,
  Tag, Users, MessageSquare, FileText, Shield, ChevronLeft,
  Clock, Plus, ExternalLink, Flag, ThumbsUp, Send,
  AlertTriangle, CheckCircle, Archive, Edit3, Zap,
  Newspaper, User as UserIcon, Link2,
} from 'lucide-react';
import {
  getCaseById, getUpdatesForCase, getCommentsForCase,
  getSourcesForCase, getUserById, isSubscribed,
  getCategoryLabel, formatRelativeTime,
  MOCK_CASES, MOCK_USERS, SOURCE_LABEL_META,
  Case, Update, Comment, Source,
} from '@/lib/mockData';

const TABS = ['Overview', 'Updates', 'Discussion', 'Sources'] as const;
type Tab = typeof TABS[number];

export default function CasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const foundCase = getCaseById(caseId);
    setCaseItem(foundCase || null);
    setIsLoading(false);

    if (foundCase) {
      setSubscribed(isSubscribed(foundCase.id));
      setComments(getCommentsForCase(foundCase.id));
      setUpdates(getUpdatesForCase(foundCase.id));
    }
  }, [caseId]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading case...</div>;
  }

  if (!caseItem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div className="empty-icon"><AlertTriangle size={24} /></div>
        <h2>Case not found</h2>
        <p>No case with ID <span className="mono" style={{ color: 'var(--indigo-300)' }}>{caseId}</span> exists.</p>
        <Link href="/" className="btn btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const sources = getSourcesForCase(caseItem.id);
  const creator = getUserById(caseItem.created_by);
  const isMod = caseItem.moderators.includes('current_user');

  const copyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/case/${caseItem.case_id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubscribe = () => setSubscribed(s => !s);

  const submitComment = () => {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `cmt_new_${Date.now()}`,
      case_id: caseItem.id,
      user_id: 'current_user',
      parent_comment_id: null,
      body: newComment.trim(),
      state: 'visible',
      upvotes: 0,
      created_at: new Date().toISOString(),
      replies: [],
    };
    setComments(prev => [c, ...prev]);
    setNewComment('');
  };

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const r: Comment = {
      id: `cmt_reply_${Date.now()}`,
      case_id: caseItem.id,
      user_id: 'current_user',
      parent_comment_id: parentId,
      body: replyText.trim(),
      state: 'visible',
      upvotes: 0,
      created_at: new Date().toISOString(),
    };
    setComments(prev => prev.map(c =>
      c.id === parentId ? { ...c, replies: [...(c.replies || []), r] } : c
    ));
    setReplyTo(null);
    setReplyText('');
  };

  const statusBadge: Record<string, string> = {
    open: 'badge-open',
    resolved: 'badge-resolved',
    unknown: 'badge-unknown',
    archived: 'badge-archived',
  };

  return (
    <div style={{ minHeight: '100%', position: 'relative', zIndex: 1 }}>

      {/* ─── Case Header ─── */}
      <div style={{
        padding: '24px 32px 0',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10,10,18,0.5)',
        backdropFilter: 'blur(12px)',
      }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: 16, transition: 'color 0.2s' }}
        >
          <ChevronLeft size={14} /> All cases
        </Link>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span className={`badge ${statusBadge[caseItem.status]} badge-dot`}>
                {caseItem.status}
              </span>
              <span className="badge" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                {getCategoryLabel(caseItem.category)}
              </span>
              {isMod && (
                <span className="badge" style={{ background: 'rgba(245,158,11,0.10)', color: 'var(--amber-400)', border: '1px solid rgba(245,158,11,0.20)' }}>
                  <Shield size={10} /> Moderator
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 10, lineHeight: 1.25, color: 'var(--text-primary)' }}>
              {caseItem.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {caseItem.location_text}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} /> {caseItem.incident_start_date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {caseItem.subscriber_count.toLocaleString()} subscribers</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> Updated {formatRelativeTime(caseItem.updated_at)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
            {/* Case ID chip */}
            <button
              className="case-id-chip"
              onClick={copyLink}
              title="Copy case link"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {caseItem.case_id}
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleSubscribe}
                style={{ gap: 7 }}
              >
                {subscribed ? <BellOff size={15} /> : <Bell size={15} />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
              <button className="btn btn-secondary btn-icon" onClick={copyLink} title="Share">
                {copied ? <Check size={16} /> : <Share2 size={16} />}
              </button>
            </div>

            {isMod && (
              <Link href={`/case/${caseItem.case_id}/update/new`} className="btn btn-amber" style={{ fontSize: '0.8125rem' }}>
                <Plus size={14} /> Post Official Update
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: 'none', marginBottom: -1 }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--indigo-300)' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--indigo-500)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tabIcon(tab)}
              {tab}
              {tab === 'Updates' && <span style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.10)', color: 'var(--indigo-300)' }}>{updates.length}</span>}
              {tab === 'Discussion' && <span style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.10)', color: 'var(--indigo-300)' }}>{comments.length}</span>}
              {tab === 'Sources' && <span style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.10)', color: 'var(--indigo-300)' }}>{sources.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div style={{ padding: '28px 32px', maxWidth: 860 }}>

        {/* ── Overview ── */}
        {activeTab === 'Overview' && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Stats row */}
            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="stat-box">
                <div className="stat-box-value">{caseItem.update_count}</div>
                <div className="stat-box-label">Updates</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-value">{caseItem.subscriber_count.toLocaleString()}</div>
                <div className="stat-box-label">Subscribers</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-value">{caseItem.comment_count}</div>
                <div className="stat-box-label">Comments</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-value">{sources.length}</div>
                <div className="stat-box-label">Sources</div>
              </div>
            </div>

            {/* Summary */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} style={{ color: 'var(--indigo-400)' }} />
                Summary
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>{caseItem.summary}</p>

              {/* Initial Evidence rendering */}
              {caseItem.media && caseItem.media.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Initial Evidence</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {caseItem.media.map(m => (
                      <div key={m.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', aspectRatio: '16/9' }}>
                        {m.type === 'image' && (
                          <img src={m.url} alt="attached media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        )}
                        {m.type === 'video' && (
                          <video src={m.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        {m.type === 'document' && (
                          <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                            <FileText size={24} style={{ color: 'var(--indigo-400)', marginBottom: 8 }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center' }}>View<br/>Document</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key facts */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} style={{ color: 'var(--amber-400)' }} />
                Key Facts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FactRow label="Category" value={getCategoryLabel(caseItem.category)} />
                <FactRow label="Location" value={caseItem.location_text} />
                <FactRow label="Incident Date" value={caseItem.incident_start_date + (caseItem.incident_end_date ? ` → ${caseItem.incident_end_date}` : ' (ongoing)')} />
                <FactRow label="Status" value={caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)} />
                <FactRow label="Visibility" value={caseItem.visibility.charAt(0).toUpperCase() + caseItem.visibility.slice(1)} />
                <FactRow label="Case Created" value={formatRelativeTime(caseItem.created_at)} />
                <FactRow label="Created by" value={creator?.handle || 'Unknown'} />
                <FactRow label="Case ID" value={caseItem.case_id} mono />
              </div>
            </div>

            {/* Tags */}
            {caseItem.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Tag size={14} style={{ color: 'var(--text-muted)' }} />
                {caseItem.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(99,102,241,0.07)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    fontSize: '0.8125rem', color: 'var(--indigo-300)',
                  }}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Last official update preview */}
            {updates.length > 0 && (
              <div className="card card-glow" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <CheckCircle size={15} style={{ color: 'var(--green-400)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--green-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Official Update</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatRelativeTime(updates[0].approved_at!)}</span>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: 8 }}>{updates[0].title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {updates[0].body.length > 200 ? updates[0].body.slice(0, 200) + '…' : updates[0].body}
                </p>
                <button
                  onClick={() => setActiveTab('Updates')}
                  style={{ marginTop: 12, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--indigo-300)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  See all {updates.length} updates →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Updates ── */}
        {activeTab === 'Updates' && (
          <div className="animate-in">
            {isMod && (
              <div style={{ marginBottom: 20 }}>
                <Link href={`/case/${caseItem.case_id}/update/new`} className="btn btn-amber">
                  <Plus size={15} /> Post Official Update
                </Link>
              </div>
            )}

            {updates.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Bell size={24} /></div>
                <h3>No official updates yet</h3>
                <p>Moderators will post verified updates here. Subscribe to be notified.</p>
              </div>
            ) : (
              <div className="timeline">
                {updates.map((u, i) => (
                  <UpdateCard key={u.id} update={u} isLast={i === updates.length - 1} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Discussion ── */}
        {activeTab === 'Discussion' && (
          <div className="animate-in">
            {/* Comment box */}
            <div className="card" style={{ padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="avatar">YO</div>
                <div style={{ flex: 1 }}>
                  <textarea
                    className="input"
                    placeholder="Share what you know. Be specific, be civil, cite sources when possible."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    style={{ minHeight: 90, resize: 'vertical', marginBottom: 10 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Be accurate. Avoid assumptions without evidence.
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={submitComment}
                      disabled={!newComment.trim()}
                      style={{ gap: 6 }}
                    >
                      <Send size={13} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            {comments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><MessageSquare size={24} /></div>
                <h3>No comments yet</h3>
                <p>Be the first to share relevant information or context.</p>
              </div>
            ) : (
              <div>
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    replyTo={replyTo}
                    replyText={replyText}
                    onReplyTo={setReplyTo}
                    onReplyTextChange={setReplyText}
                    onSubmitReply={submitReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Sources ── */}
        {activeTab === 'Sources' && (
          <div className="animate-in">
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                All sources are labeled by reliability. Personal accounts are unverified unless corroborated.
              </p>
              {isMod && (
                <button className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
                  <Plus size={13} /> Add Source
                </button>
              )}
            </div>

            {sources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FileText size={24} /></div>
                <h3>No sources yet</h3>
                <p>Moderators can add verified sources and evidence here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sources.map(src => (
                  <SourceCard key={src.id} source={src} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function tabIcon(tab: Tab) {
  const icons = {
    Overview: <FileText size={14} />,
    Updates: <Bell size={14} />,
    Discussion: <MessageSquare size={14} />,
    Sources: <Link2 size={14} />,
  };
  return icons[tab];
}

function FactRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.875rem',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
        fontWeight: mono ? 500 : 400,
        color: mono ? 'var(--indigo-300)' : 'var(--text-primary)',
      }}>
        {value}
      </span>
    </div>
  );
}

function UpdateCard({ update, isLast }: { update: Update; isLast: boolean }) {
  const author = getUserById(update.author_id);
  const typeColors: Record<string, { bg: string; color: string; label: string }> = {
    official_update: { bg: 'rgba(74,222,128,0.10)', color: 'var(--green-400)', label: 'Official Update' },
    correction: { bg: 'rgba(96,165,250,0.10)', color: 'var(--blue-400)', label: 'Correction' },
    status_change: { bg: 'rgba(245,158,11,0.10)', color: 'var(--amber-400)', label: 'Status Change' },
  };
  const meta = typeColors[update.type] || typeColors.official_update;

  return (
    <div className="timeline-item" style={{ animationFillMode: 'both' }}>
      {!isLast && <div className="timeline-line" />}
      <div className="timeline-dot">
        <CheckCircle size={14} style={{ color: 'var(--indigo-300)' }} />
      </div>
      <div className="timeline-content">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                background: meta.bg, color: meta.color,
                fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                width: 'fit-content',
              }}>
                <CheckCircle size={10} /> {meta.label}
              </span>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.35 }}>{update.title}</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
              {formatRelativeTime(update.approved_at!)}
            </span>
          </div>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{update.body}</p>
          
          {/* Media Attachments */}
          {update.media && update.media.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
              {update.media.map(m => (
                <div key={m.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', aspectRatio: '16/9' }}>
                  {m.type === 'image' && (
                    <img src={m.url} alt="attached media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  )}
                  {m.type === 'video' && (
                    <video src={m.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  {m.type === 'document' && (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <FileText size={24} style={{ color: 'var(--indigo-400)', marginBottom: 8 }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center' }}>View<br/>Document</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar avatar-sm" style={{ background: getUserById(update.author_id)?.avatarColor || 'var(--indigo-700)' }}>
              {author?.avatarInitials}
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Posted by <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>@{author?.handle}</span>
            </span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--green-400)' }}>
              <Shield size={11} /> Approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment, replyTo, replyText, onReplyTo, onReplyTextChange, onSubmitReply
}: {
  comment: Comment;
  replyTo: string | null;
  replyText: string;
  onReplyTo: (id: string | null) => void;
  onReplyTextChange: (s: string) => void;
  onSubmitReply: (id: string) => void;
}) {
  const user = getUserById(comment.user_id);
  const [upvoted, setUpvoted] = useState(false);

  return (
    <div className="comment">
      <div className="avatar" style={{ background: user?.avatarColor || 'var(--indigo-700)' }}>
        {user?.avatarInitials || '??'}
      </div>
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">@{user?.handle || 'unknown'}</span>
          {user?.trust_level && user.trust_level >= 4 && (
            <span style={{
              fontSize: '0.6875rem', padding: '1px 6px', borderRadius: 'var(--radius-full)',
              background: 'rgba(99,102,241,0.10)', color: 'var(--indigo-300)',
              border: '1px solid rgba(99,102,241,0.15)',
              fontWeight: 600,
            }}>Trusted</span>
          )}
          <span className="comment-time">{formatRelativeTime(comment.created_at)}</span>
        </div>
        <p className="comment-text">{comment.body}</p>
        <div className="comment-actions">
          <button
            className="comment-action-btn"
            onClick={() => setUpvoted(u => !u)}
            style={{ color: upvoted ? 'var(--indigo-300)' : undefined }}
          >
            <ThumbsUp size={12} /> {comment.upvotes + (upvoted ? 1 : 0)}
          </button>
          <button className="comment-action-btn" onClick={() => onReplyTo(replyTo === comment.id ? null : comment.id)}>
            <MessageSquare size={12} /> Reply
          </button>
          <button className="comment-action-btn">
            <Flag size={12} /> Report
          </button>
        </div>

        {/* Reply box */}
        {replyTo === comment.id && (
          <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeInDown 0.2s ease' }}>
            <div className="avatar avatar-sm">YO</div>
            <div style={{ flex: 1 }}>
              <textarea
                className="input"
                placeholder={`Replying to @${user?.handle}…`}
                value={replyText}
                onChange={e => onReplyTextChange(e.target.value)}
                style={{ minHeight: 70, resize: 'none', marginBottom: 8 }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => onReplyTo(null)}>Cancel</button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => {
              const ru = getUserById(reply.user_id);
              return (
                <div key={reply.id} className="comment" style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <div className="avatar avatar-sm" style={{ background: ru?.avatarColor || 'var(--indigo-700)' }}>{ru?.avatarInitials}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author" style={{ fontSize: '0.8125rem' }}>@{ru?.handle}</span>
                      <span className="comment-time">{formatRelativeTime(reply.created_at)}</span>
                    </div>
                    <p className="comment-text" style={{ fontSize: '0.875rem' }}>{reply.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const meta = SOURCE_LABEL_META[source.label];
  const adder = getUserById(source.added_by);
  const typeIcons: Record<string, React.ReactNode> = {
    url: <ExternalLink size={16} />,
    image: <FileText size={16} />,
    pdf: <FileText size={16} />,
    text: <FileText size={16} />,
  };

  return (
    <div className="source-item">
      <div className="source-icon" style={{ background: `${meta.color}15`, borderColor: `${meta.color}30`, color: meta.color }}>
        {typeIcons[source.type] || <FileText size={16} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 4 }}>{source.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700,
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                background: `${meta.color}15`, color: meta.color,
                border: `1px solid ${meta.color}30`,
              }}>
                {meta.label}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {meta.reliability}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                · Added by @{adder?.handle} · {formatRelativeTime(source.created_at)}
              </span>
            </div>
          </div>
          {source.url && source.url !== '#' && (
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
              <ExternalLink size={13} /> Open
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
