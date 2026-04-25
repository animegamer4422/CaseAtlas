'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;
    setSubmitting(true);
    try {
      await signup(username, email, password);
      // Navigation is handled in the context
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      setSubmitting(false);
    }
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Create Account</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
          Join the community to post updates and discuss.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        <div className="input-group">
          <label className="input-label" htmlFor="username">Username</label>
          <div style={{ position: 'relative' }}>
            <UserIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="username"
              type="text"
              className="input"
              placeholder="johndoe"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ paddingLeft: 42 }}
              required
            />
          </div>
        </div>

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
          <label className="input-label" htmlFor="password">Password</label>
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
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !email || !password || !username}
          style={{ width: '100%', height: 44, marginTop: 8 }}
        >
          {submitting ? 'Creating account...' : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign up <ArrowRight size={16} /></span>
          )}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--indigo-300)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
      </div>
    </div>
  );
}
