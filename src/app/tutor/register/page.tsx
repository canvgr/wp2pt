'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TutorRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', graduationYear: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.email.endsWith('@belenwolverines.org')) {
      setError('You must use your Belen Jesuit school email (@belenwolverines.org).')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { first_name: form.firstName, last_name: form.lastName, role: 'tutor' }
        }
      })
      if (signUpError) throw signUpError
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          role: 'tutor',
          graduation_year: form.graduationYear ? parseInt(form.graduationYear) : null,
        })
      }
      router.push('/tutor/availability')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-narrow">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-role-badge" style={{ background: '#155e3b' }}>Volunteer Tutor Registration</div>
          <h1 style={{ fontSize: '1.6rem', margin: '0.5rem 0 0.25rem', color: 'var(--navy)' }}>
            Join as a Volunteer Tutor
          </h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Help a fellow Wolverine succeed and grow
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" required placeholder="Diego"
                value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" required placeholder="Nunez"
                value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label>School Email</label>
            <input type="email" required placeholder="dnunez@belenwolverines.org"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Graduation Year</label>
            <input type="number" placeholder="e.g. 2026" min="2024" max="2030"
              value={form.graduationYear} onChange={e => setForm(f => ({ ...f, graduationYear: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" required placeholder="At least 8 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" required placeholder="Repeat your password"
              value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#155e3b' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already registered? <Link href="/tutor/login">Sign in</Link>
        </div>
        <p className="motto">Ad Majorem Dei Gloriam</p>
      </div>
    </div>
  )
}
