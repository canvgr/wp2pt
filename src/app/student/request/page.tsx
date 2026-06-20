'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MATH_COURSES, SCIENCE_COURSES, TIME_SLOTS, DURATION, getWeekDays, formatDate, formatDateISO } from '@/lib/courses'

type Step = 1 | 2
type Subject = 'math' | 'science'

export default function StudentRequestPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [step, setStep] = useState<Step>(1)
  const [subject, setSubject] = useState<Subject>('math')
  const [course, setCourse] = useState('')
  const [grade, setGrade] = useState('')
  const [gradeError, setGradeError] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)
  const [selSlot, setSelSlot] = useState<{ date: string; time: string } | null>(null)
  const [freeTutorCounts, setFreeTutorCounts] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/student/login')
      else setUser({ id: data.user.id, email: data.user.email! })
    })
  }, [router])

  const days = getWeekDays(weekOffset)
  const courses = subject === 'math' ? MATH_COURSES : SCIENCE_COURSES

  function slotKey(date: string, time: string) { return `${date}|${time}` }

  useEffect(() => {
    if (step === 2 && course) loadTutorAvailability()
  }, [step, weekOffset, course])

  async function loadTutorAvailability() {
    const dateStrings = days.map(formatDateISO)
    const { data } = await supabase
      .from('tutor_availability')
      .select('available_date, available_time')
      .in('available_date', dateStrings)
      .contains('courses', [course])
      .eq('is_booked', false)
    const counts: Record<string, number> = {}
    for (const row of data || []) {
      const k = slotKey(row.available_date, row.available_time)
      counts[k] = (counts[k] || 0) + 1
    }
    setFreeTutorCounts(counts)
  }

  function freeTutorLevel(date: string, time: string) {
    return Math.min(freeTutorCounts[slotKey(date, time)] || 0, 3)
  }
  function freeTutorCount(date: string, time: string) {
    return freeTutorCounts[slotKey(date, time)] || 0
  }

  function handleGradeChange(val: string) {
    setGradeError('')
    if (val === '') { setGrade(''); return }
    const num = parseInt(val)
    if (isNaN(num) || num < 0 || num > 100) {
      setGradeError('Enter a number between 0 and 100.')
    } else {
      setGrade(val)
    }
  }

  function handleNext() {
    if (!course) return
    if (grade && (parseInt(grade) < 0 || parseInt(grade) > 100)) {
      setGradeError('Enter a number between 0 and 100.')
      return
    }
    setStep(2)
  }

  async function handleSubmit() {
    if (!selSlot || !user) return
    setSubmitting(true)
    const { data: sessionData, error } = await supabase
      .from('sessions')
      .insert({
        student_id: user.id,
        subject,
        course,
        student_grade: grade ? parseInt(grade) : null,
        session_date: selSlot.date,
        session_time: selSlot.time,
        duration: DURATION,
        status: 'pending',
      })
      .select('id')
      .single()
    if (error) console.error('Session insert error:', error)
    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger: 'student',
        sessionId: sessionData?.id,
        studentId: user.id,
        course,
        subject,
        date: selSlot.date,
        time: selSlot.time,
        duration: DURATION,
      }),
    }).catch(() => {})
    setSuccess(true)
    setSubmitting(false)
  }

  const freeTutorsAtSelection = selSlot ? freeTutorCount(selSlot.date, selSlot.time) : 0

  if (success) {
    return (
      <div className="page-narrow" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: 'var(--navy)' }}>Request Submitted!</h2>
        <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {freeTutorsAtSelection > 0
            ? 'A confirmation email will be sent once you are matched with a Volunteer Tutor.'
            : "No tutors are free for this slot yet. You're on the waitlist — we'll email you if one becomes available."}
        </p>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600, color: 'var(--navy)' }}>
          {course} · {selSlot?.time} · {DURATION} min{grade ? ` · Grade: ${grade}` : ''}
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => {
          setSuccess(false); setStep(1); setCourse(''); setGrade(''); setGradeError(''); setSelSlot(null)
        }}>Request Another Session</button>
        <button className="btn-secondary" style={{ marginTop: '0.75rem', display: 'block', width: '100%' }} onClick={async () => {
          await supabase.auth.signOut(); router.push('/')
        }}>Sign Out</button>
      </div>
    )
  }

  return (
    <div className="page-narrow">
      <h1 style={{ color: 'var(--navy)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Request Tutoring</h1>
      <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Tell us what you need — we'll find your match.
      </p>
      <div className="steps">
        <div className={`step ${step === 1 ? 'active' : 'done'}`}>
          <div className="step-num">{step > 1 ? '✓' : '1'}</div>
          <span>Subject &amp; Grade</span>
        </div>
        <div className="step-divider" />
        <div className={`step ${step === 2 ? 'active' : ''}`}>
          <div className="step-num">2</div>
          <span>Schedule</span>
        </div>
      </div>
      <div className="card">
        {step === 1 && (
          <>
            <div className="form-group">
              <label>What subject do you need help with?</label>
              <div className="subject-toggle">
                <button type="button" className={`subject-btn ${subject === 'math' ? 'active' : ''}`}
                  onClick={() => { setSubject('math'); setCourse(''); setGrade(''); setGradeError('') }}>📐 Math</button>
                <button type="button" className={`subject-btn ${subject === 'science' ? 'active' : ''}`}
                  onClick={() => { setSubject('science'); setCourse(''); setGrade(''); setGradeError('') }}>🔬 Science</button>
              </div>
            </div>
            <div className="form-group">
              <label>Which {subject === 'math' ? 'Math' : 'Science'} course do you need help with?</label>
              <div className="course-list">
                {courses.map(c => (
                  <div key={c} className={`course-item ${course === c ? 'selected' : ''}`}
                    onClick={() => { setCourse(c); setGrade(''); setGradeError('') }}>
                    <span style={{ marginLeft: '0.25rem' }}>{course === c ? '✓' : '○'}</span>{c}
                  </div>
                ))}
              </div>
            </div>
            {course && (
              <div className="form-group">
                <div style={{ background: '#f9f6ef', border: '1px solid #e2d9c8', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginBottom: '0.3rem' }}>
                        Your current grade in <span style={{ color: 'var(--navy)', fontWeight: 700 }}>{course}</span>
                        <span style={{ fontWeight: 400 }}> (optional)</span>
                      </label>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
                        Your Proctor will track whether your grade improves after each tutoring session.
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ position: 'relative' }}>
                        <input type="number" min="0" max="100" placeholder="—" value={grade}
                          onChange={e => handleGradeChange(e.target.value)}
                          style={{ width: '80px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, padding: '0.5rem',
                            border: `2px solid ${gradeError ? '#fca5a5' : grade ? 'var(--gold)' : 'var(--border)'}`,
                            borderRadius: '8px', color: 'var(--navy)', background: 'white' }} />
                        {grade && !gradeError && (
                          <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--gold)', color: 'var(--navy)',
                            borderRadius: '999px', width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>
                        )}
                      </div>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)' }}>out of 100</span>
                    </div>
                  </div>
                  {gradeError && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#b91c1c', margin: '0.25rem 0 0' }}>{gradeError}</p>}
                  {grade && !gradeError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                      background: parseInt(grade) >= 90 ? '#f0fdf4' : parseInt(grade) >= 70 ? '#fef9ee' : '#fef2f2',
                      border: `1px solid ${parseInt(grade) >= 90 ? '#bbf7d0' : parseInt(grade) >= 70 ? '#fde68a' : '#fecaca'}`,
                      borderRadius: '6px' }}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem',
                        color: parseInt(grade) >= 90 ? '#15803d' : parseInt(grade) >= 70 ? '#92400e' : '#b91c1c' }}>
                        {parseInt(grade) >= 90 ? '🟢' : parseInt(grade) >= 70 ? '🟡' : '🔴'}{' '}
                        <strong>{parseInt(grade)}%</strong> in {course} —
                        {parseInt(grade) >= 90 ? ' keep it up!' : parseInt(grade) >= 70 ? ' room to improve.' : ' tutoring can really help here.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex-end">
              <button className="btn-primary" disabled={!course || !!gradeError} onClick={handleNext}>
                Next: Pick a Date &amp; Time →
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ background: '#f9f6ef', border: '1px solid #e2d9c8', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
              fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--navy)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span><strong>Course:</strong> {course}</span>
              {grade && <span><strong>Current grade:</strong> {grade}%</span>}
              <span><strong>Session length:</strong> {DURATION} min</span>
            </div>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setWeekOffset(w => w - 1)}>← Prev</button>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)' }}>
                {formatDate(days[0])} – {formatDate(days[4])}
              </span>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="cal-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map(d => (
                      <th key={d.toISOString()}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}<br />
                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {days.map(d => {
                        const dateStr = formatDateISO(d)
                        const isSel = selSlot?.date === dateStr && selSlot?.time === time
                        const level = freeTutorLevel(dateStr, time)
                        const count = freeTutorCount(dateStr, time)
                        const bgMap: Record<number, string> = { 0: '#f5f3ee', 1: '#e8f5f0', 2: '#c8e9dc', 3: '#9fd9c2' }
                        const colorMap: Record<number, string> = { 0: '#9ca3af', 1: '#1a7f5a', 2: '#155e3b', 3: '#0e4a2e' }
                        const bg = isSel ? 'var(--navy)' : bgMap[level]
                        const color = isSel ? 'var(--gold)' : colorMap[level]
                        return (
                          <td key={dateStr}>
                            <div style={{ padding: '3px 2px', borderRadius: '5px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center', gap: '2px', minHeight: '44px', width: '100%',
                              fontSize: '0.72rem', transition: 'background 0.12s', userSelect: 'none', background: bg, color }}
                              onClick={() => setSelSlot(isSel ? null : { date: dateStr, time })}>
                              {isSel ? <span style={{ fontWeight: 700 }}>✓ Selected</span>
                                : count === 0
                                  ? <><span style={{ fontSize: '0.65rem' }}>No free tutors</span><span style={{ fontSize: '0.6rem', opacity: 0.75 }}>Book anyway</span></>
                                  : <><div style={{ display: 'flex', gap: '2px' }}>{Array(Math.min(count, 3)).fill(0).map((_, i) => <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />)}</div><span style={{ fontSize: '0.68rem', fontWeight: 700 }}>{count} free tutor{count !== 1 ? 's' : ''}</span></>
                              }
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selSlot && (
              <div className="session-summary" style={{ marginTop: '1rem' }}>
                <span><strong>Course:</strong> {course}</span>
                {grade && <span><strong>Grade:</strong> {grade}%</span>}
                <span><strong>Date:</strong> {new Date(selSlot.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span><strong>Time:</strong> {selSlot.time}</span>
                <span><strong>Duration:</strong> {DURATION} min</span>
                {freeTutorsAtSelection > 0
                  ? <span style={{ color: '#9fe1cb' }}>· {freeTutorsAtSelection} free tutor{freeTutorsAtSelection !== 1 ? 's' : ''}</span>
                  : <span style={{ color: '#fde8aa' }}>· no free tutors yet — waitlisted</span>}
              </div>
            )}
            <div className="flex-between" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => { setStep(1); setSelSlot(null) }}>← Back</button>
              <button className="btn-primary" disabled={!selSlot || submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting…' : 'Submit & Get Matched →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
