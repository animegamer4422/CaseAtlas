'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Send, CheckCircle, AlertTriangle, Bell,
  FileText, Info, Shield,
} from 'lucide-react';
import { getCaseById, saveUpdate } from '@/lib/mockData';
import { FileUpload, UploadedFile } from '@/components/ui/FileUpload';

export default function NewUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const caseItem = getCaseById(caseId);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'official_update' | 'correction' | 'status_change'>('official_update');
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  if (!caseItem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div className="empty-icon"><AlertTriangle size={24} /></div>
        <h2>Case not found</h2>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const handlePublish = () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      saveUpdate(caseItem.id, {
        id: `upd_${Date.now()}`,
        case_id: caseItem.id,
        author_id: 'current_user',
        type: type,
        title: title.trim(),
        body: body.trim(),
        state: 'approved',
        approved_by: 'current_user',
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        media: mediaFiles.length > 0 ? mediaFiles.map(m => ({ id: m.id, url: m.previewUrl, type: m.type })) : undefined,
      });
      setSubmitting(false);
      setPublished(true);
      setTimeout(() => router.push(`/case/${caseItem.case_id}?tab=Updates`), 1800);
    }, 1200);
  };

  if (published) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, animation: 'fadeInUp 0.4s ease' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(74,222,128,0.12)',
          border: '2px solid rgba(74,222,128,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-dot 2s infinite',
        }}>
          <CheckCircle size={36} style={{ color: 'var(--green-400)' }} />
        </div>
        <h2 style={{ color: 'var(--text-primary)' }}>Update Published</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 320 }}>
          All subscribers to this case have been notified.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)' }}>
          <Bell size={14} style={{ color: 'var(--indigo-300)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--indigo-300)', fontWeight: 600 }}>
            {caseItem.subscriber_count.toLocaleString()} subscribers notified
          </span>
        </div>
      </div>
    );
  }

  const typeOptions = [
    { value: 'official_update', label: 'Official Update', desc: 'New information or developments', color: 'var(--green-400)' },
    { value: 'correction', label: 'Correction', desc: 'Correcting previously stated information', color: 'var(--blue-400)' },
    { value: 'status_change', label: 'Status Change', desc: 'Case status has changed', color: 'var(--amber-400)' },
  ];

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: 700, position: 'relative', zIndex: 1 }}>

      {/* Back link */}
      <Link
        href={`/case/${caseItem.case_id}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: 24, transition: 'color 0.2s' }}
      >
        <ChevronLeft size={14} /> Back to case
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-400)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <Shield size={12} /> Moderator Action
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Post Official Update</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          for <span style={{ color: 'var(--indigo-300)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{caseItem.case_id}</span>
          {' — '}{caseItem.title}
        </p>
      </div>

      {/* Update type */}
      <div style={{ marginBottom: 24 }}>
        <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>Update Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {typeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value as typeof type)}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                border: type === opt.value
                  ? `2px solid ${opt.color}40`
                  : '1px solid var(--border-subtle)',
                background: type === opt.value ? `${opt.color}0e` : 'var(--bg-elevated)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: type === opt.value ? opt.color : 'var(--text-primary)', marginBottom: 3 }}>{opt.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="input-group" style={{ marginBottom: 20 }}>
        <label className="input-label" htmlFor="update-title">Update Title *</label>
        <input
          id="update-title"
          className="input"
          placeholder="e.g. Police confirm suspect detained in connection with case"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: '1rem', fontWeight: 500 }}
        />
      </div>

      {/* Body */}
      <div className="input-group" style={{ marginBottom: 24 }}>
        <label className="input-label" htmlFor="update-body">Update Body *</label>
        <textarea
          id="update-body"
          className="input"
          placeholder="Write the full update here. Include source citations wherever possible. Be factual and precise."
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{ minHeight: 200, lineHeight: 1.75 }}
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
          {body.length} chars · Markdown not yet supported
        </span>
      </div>

      {/* Media Upload */}
      <div className="input-group" style={{ marginBottom: 28 }}>
        <label className="input-label">Attachments</label>
        <FileUpload onUpload={setMediaFiles} label="Attach Evidence (Photos/Videos)" />
      </div>

      {/* Warning notice */}
      <div style={{
        display: 'flex', gap: 12, padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.15)',
        marginBottom: 28,
      }}>
        <Info size={16} style={{ color: 'var(--amber-400)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--amber-400)', marginBottom: 2 }}>Publishing as moderator</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            This update will be marked <strong style={{ color: 'var(--green-400)' }}>Approved</strong> immediately and all <strong style={{ color: 'var(--text-secondary)' }}>{caseItem.subscriber_count.toLocaleString()}</strong> subscribers will receive a notification.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          className="btn btn-amber btn-lg"
          onClick={handlePublish}
          disabled={submitting || !title.trim() || !body.trim()}
          style={{ gap: 8 }}
        >
          {submitting ? (
            <>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid black', animation: 'spin 0.8s linear infinite' }} />
              Publishing…
            </>
          ) : (
            <>
              <Send size={15} /> Publish Update
            </>
          )}
        </button>
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Save as Draft
        </button>
        <Link href={`/case/${caseItem.case_id}`} className="btn btn-ghost">
          Cancel
        </Link>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
