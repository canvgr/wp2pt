'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    })
  }, [])

  return (
    <div className="page-narrow" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      {status === 'loading' && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ color: 'var(--navy)' }}>Verifying your email…</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)' }}>Please wait a moment.</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#155e3b' }}>Email Verified!</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Your Belen Jesuit account has been confirmed. You can now sign in and start using WP2PT.
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push('/student/login')}
            style={{ marginBottom: '0.75rem', width: '100%', justifyContent: 'center' }}
          >
            Sign In as Student →
          </button>
          <button
            className="btn-secondary"
            onClick={() => router.push('/tutor/login')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign In as Volunteer Tutor →
          </button>
        </>
      )}
      {status === 'error' && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: 'var(--navy)' }}>Verification Link Expired</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            This verification link has expired or has already been used. Please register again or try signing in — your account may already be active.
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push('/student/register')}
            style={{ marginBottom: '0.75rem', width: '100%', justifyContent: 'center' }}
          >
            Register as Student →
          </button>
          <button
            className="btn-secondary"
            onClick={() => router.push('/tutor/register')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Register as Volunteer Tutor →
          </button>
        </>
      )}
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Ad Majorem Dei Gloriam · Belen Jesuit Preparatory School
      </p>
    </div>
  )
}
