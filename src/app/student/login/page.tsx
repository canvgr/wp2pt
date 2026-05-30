'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StudentLoginPage() {
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
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
      router.push('/student/request')
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
          <div className="auth-role-badge">Student Portal</div>
          <h1 style={{ fontSize: '1.6rem', margin: '0.5rem 0 0.25rem', color: 'var(--navy)' }}>
            Sign In
          </h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Use your Belen Jesuit school email
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>School Email</label>
            <input
              type="email" required placeholder="dnunez@belenwolverines.org"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" required placeholder="Your password"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link href="/student/register">Register</Link>
        </div>
        <p className="motto">Ad Majorem Dei Gloriam</p>
      </div>
    </div>
  )
}
