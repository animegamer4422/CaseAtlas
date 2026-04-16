'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Plus, AlertTriangle, Info, Globe,
  Lock, EyeOff, CheckCircle, MapPin, Calendar, Tag,
} from 'lucide-react';
import { generateCaseId, saveCase } from '@/lib/mockData';
import { FileUpload, UploadedFile } from '@/components/ui/FileUpload';

const CATEGORIES = [
  { value: 'missing_person', label: 'Missing Person', emoji: '👤' },
  { value: 'crime', label: 'Crime', emoji: '⚠️' },
  { value: 'harassment', label: 'Harassment', emoji: '🚨' },
  { value: 'scam', label: 'Scam / Fraud', emoji: '💸' },
  { value: 'accident', label: 'Accident', emoji: '🚗' },
  { value: 'corruption', label: 'Corruption', emoji: '🏛️' },
  { value: 'other', label: 'Other', emoji: '📋' },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Visible to everyone, searchable', icon: Globe },
  { value: 'unlisted', label: 'Unlisted', desc: 'Only accessible via Case ID link', icon: EyeOff },
  { value: 'private', label: 'Private', desc: 'Only you and moderators', icon: Lock },
];

export default function CreateCasePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);

  const canProceed1 = title.trim() && category;
  const canProceed2 = location.trim() && startDate;
  const canSubmit = summary.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const newCaseId = generateCaseId();
    setTimeout(() => {
      saveCase({
        id: `c_${Date.now()}`,
        case_id: newCaseId,
        created_by: 'current_user',
        moderators: ['current_user'],
        status: 'open',
        category: category as any,
        title: title.trim(),
        location_text: location.trim(),
        summary: summary.trim(),
        visibility: visibility as any,
        incident_start_date: startDate || new Date().toISOString(),
        incident_end_date: endDate || null,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscriber_count: 1, // Author defaults basically to subscribed initially
        update_count: 0,
        comment_count: 0,
        media: mediaFiles.length > 0 ? mediaFiles.map(m => ({ id: m.id, url: m.previewUrl, type: m.type })) : undefined,
      });
      setSubmitting(false);
      setPublished(newCaseId);
    }, 1400);
  };

  if (published) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 20, animation: 'fadeInUp 0.4s ease', padding: '0 32px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, rgba(99,102,241,0.05) 100%)',
          border: '2px solid rgba(99,102,241,0.40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={40} style={{ color: 'var(--indigo-400)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Case Created</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Your case is now live. Share the Case ID to invite people to subscribe.</p>
        </div>
        <div style={{
          padding: '16px 28px', borderRadius: 'var(--radius-xl)',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.25)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Your Case ID</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-300)', letterSpacing: '0.05em' }}>{published}</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigator.clipboard.writeText(`http://localhost:3000/case/${published}`)}
          >
            Copy Share Link
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => router.push(`/case/${published}`)}
          >
            View Case →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: 640, position: 'relative', zIndex: 1 }}>

      {/* Back */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: 24 }}>
        <ChevronLeft size={14} /> Home
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 8 }}>
          Create a <span className="text-gradient">New Case</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          You'll become the moderator and can post official updates, add sources, and manage the discussion.
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, alignItems: 'center' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: s < 3 ? '1 1 auto' : 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8125rem', fontWeight: 700,
              background: step > s ? 'var(--indigo-500)' : step === s ? 'rgba(99,102,241,0.20)' : 'var(--bg-elevated)',
              border: step >= s ? '2px solid var(--indigo-500)' : '2px solid var(--border-dim)',
              color: step >= s ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s',
            }}>
              {step > s ? <CheckCircle size={14} /> : s}
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: step === s ? 600 : 400, color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {['Basic Info', 'Location & Date', 'Summary & Publish'][s - 1]}
            </span>
            {s < 3 && <div style={{ flex: 1, height: 1, background: step > s ? 'var(--indigo-500)' : 'var(--border-subtle)', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="case-title">Case Title *</label>
            <input
              id="case-title"
              className="input"
              placeholder="e.g. Missing: Jane Doe, Mumbai – Last seen Jan 5"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ fontSize: '1rem', fontWeight: 500 }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Be specific and factual. Avoid accusations or inflammatory language.</span>
          </div>

          <div className="input-group">
            <label className="input-label">Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: category === cat.value ? '2px solid var(--indigo-500)' : '1px solid var(--border-subtle)',
                    background: category === cat.value ? 'rgba(99,102,241,0.10)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: category === cat.value ? 'var(--indigo-300)' : 'var(--text-secondary)' }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            disabled={!canProceed1}
            onClick={() => setStep(2)}
            style={{ marginTop: 8 }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="location"><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />Location *</label>
            <input
              id="location"
              className="input"
              placeholder="e.g. Connaught Place, New Delhi, India"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="input-group">
              <label className="input-label" htmlFor="start-date"><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />Incident Date *</label>
              <input
                id="start-date"
                className="input"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="end-date">End Date (optional)</label>
              <input
                id="end-date"
                className="input"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="tags"><Tag size={13} style={{ display: 'inline', marginRight: 4 }} />Tags <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <input
              id="tags"
              className="input"
              placeholder="e.g. missing, delhi, urgent (comma-separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div className="input-group">
            <label className="input-label">Visibility</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {VISIBILITY_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setVisibility(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-lg)',
                      border: visibility === opt.value ? '2px solid var(--indigo-500)' : '1px solid var(--border-subtle)',
                      background: visibility === opt.value ? 'rgba(99,102,241,0.08)' : 'var(--bg-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={16} style={{ color: visibility === opt.value ? 'var(--indigo-400)' : 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: visibility === opt.value ? 'var(--indigo-300)' : 'var(--text-primary)' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              disabled={!canProceed2}
              onClick={() => setStep(3)}
              style={{ flex: 1 }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="summary">Case Summary *</label>
            <textarea
              id="summary"
              className="input"
              placeholder="Describe the incident factually. Include who, what, when, where, and any known details. Avoid speculation. This will be the public-facing description of this case."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              style={{ minHeight: 200, lineHeight: 1.75 }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Initial Evidence (Photos, Videos, PDFs)</label>
            <FileUpload onUpload={setMediaFiles} maxFiles={5} />
          </div>

          {/* Notice */}
          <div style={{
            display: 'flex', gap: 12, padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <Info size={16} style={{ color: 'var(--indigo-400)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--indigo-300)', marginBottom: 2 }}>You become the Moderator</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                As creator, you can post official updates, add sources, accept/reject edits, and appoint co-moderators.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex', gap: 12, padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}>
            <AlertTriangle size={16} style={{ color: 'var(--amber-400)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Do not include personal identifying information (addresses, phone numbers, private IDs) of anyone who has not publicly consented.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              disabled={submitting || !canSubmit}
              onClick={handleSubmit}
              style={{ flex: 1, gap: 8 }}
            >
              {submitting ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 0.8s linear infinite' }} />
                  Creating case…
                </>
              ) : (
                <><Plus size={16} /> Create Case</>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
