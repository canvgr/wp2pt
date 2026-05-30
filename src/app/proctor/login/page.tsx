'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProctorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'proctor') {
        await supabase.auth.signOut()
        throw new Error('Access denied. Proctor credentials required.')
      }
      router.push('/proctor/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-narrow">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-role-badge" style={{ background: '#7c2d12' }}>Proctor Access</div>
          <h1 style={{ fontSize: '1.6rem', margin: '0.5rem 0 0.25rem', color: 'var(--navy)' }}>Admin Sign In</h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Access the Proctor dashboard to view sessions and track grades
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required placeholder="proctor@belenwolverines.org"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required placeholder="Admin password"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#7c2d12' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Access Dashboard →'}
          </button>
        </form>
        <p className="motto" style={{ marginTop: '1.5rem' }}>Ad Majorem Dei Gloriam</p>
      </div>
    </div>
  )
}
