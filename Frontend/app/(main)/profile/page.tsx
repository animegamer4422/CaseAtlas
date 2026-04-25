'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Shield, Mail, Calendar, Settings, Activity } from 'lucide-react';
import { formatRelativeTime } from '@/lib/mockData';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (user) {
      setHandle(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (isLoading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }
  
  if (!user) {
    return <div style={{ padding: 40 }}>Please sign in to view your profile.</div>;
  }

  // derive trust level from role or fallback to 1
  let trustLevel = 1;
  if (user.role === 'moderator') trustLevel = 3;
  if (user.role === 'admin') trustLevel = 5;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 800 }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Settings size={22} style={{ color: 'var(--indigo-400)' }} />
        Account Settings
      </h1>

      <div style={{ display: 'grid', gap: 24 }}>
        
        {/* Profile Card */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 24 }}>Profile Information</h2>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div 
                style={{ 
                  width: 96, height: 96, borderRadius: '50%', 
                  backgroundColor: 'var(--indigo-600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 700, color: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              >
                {handle.substring(0, 2).toUpperCase()}
              </div>
              <button className="btn btn-secondary btn-sm">Change Avatar</button>
            </div>

            <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Public Handle / Username</label>
                <input className="input" value={handle} onChange={e => setHandle(e.target.value)} disabled />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Username cannot be changed currently.</span>
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled />
              </div>
            </div>

          </div>
        </div>

        {/* Info Card */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 24 }}>Account Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <Shield size={20} style={{ color: 'var(--indigo-400)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Level</div>
                <div style={{ fontWeight: 600 }}>Level {trustLevel} ({user.role})</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={20} style={{ color: 'var(--indigo-400)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</div>
                <div style={{ fontWeight: 600 }}>{user.createdAt ? formatRelativeTime(user.createdAt) : 'Recently'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <Activity size={20} style={{ color: 'var(--indigo-400)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontWeight: 600, color: 'var(--green-400)', textTransform: 'capitalize' }}>
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
