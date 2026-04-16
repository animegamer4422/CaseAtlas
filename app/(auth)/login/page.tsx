'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await login(email);
  };

  return (
    <div className="card animate-in" style={{ width: '100%', maxWidth: 420, padding: '40px 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--indigo-500) 0%, var(--indigo-700) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, boxShadow: '0 8px 16px rgba(99,102,241,0.2)'
        }}>
          <Shield size={24} style={{ color: 'white' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
          Sign in to track cases and post updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ paddingLeft: 42 }}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="input-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
            <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--indigo-400)', textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ paddingLeft: 42 }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !email || !password}
          style={{ width: '100%', height: 44, marginTop: 8 }}
        >
          {submitting ? 'Signing in...' : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign in <ArrowRight size={16} /></span>
          )}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
      </div>

      <div style={{ marginTop: 24, padding: 12, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        <strong>Demo Mode:</strong> Any email and password will work. It will log you in as testing user "you". Use "ravenworth@email.com" to test as another user.
      </div>
    </div>
  );
}
