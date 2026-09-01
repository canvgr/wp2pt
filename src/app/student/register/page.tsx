'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StudentRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
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
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('Password must be at least 8 characters, include one uppercase letter and one number.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { first_name: form.firstName, last_name: form.lastName, role: 'student' }
        }
      })

      if (signUpError) throw signUpError

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          role: 'student',
        })
      }

      router.push('/student/request')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
