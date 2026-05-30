'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MATH_COURSES, SCIENCE_COURSES, TIME_SLOTS, getWeekDays, formatDate, formatDateISO } from '@/lib/courses'

type Step = 1 | 2
type Subject = 'math' | 'science'
type Duration = 15 | 30

export default function StudentRequestPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [step, setStep] = useState<Step>(1)
  const [subject, setSubject] = useState<Subject>('math')
  const [course, setCourse] = useState('')
  const [grade, setGrade] = useState('')
  const [gradeError, setGradeError] = useState('')
  const [duration, setDuration] = useState<Duration>(30)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selStart, setSelStart] = useState<{ date: string; time: string } | null>(null)
  const [selBlock, setSelBlock] = useState<{ date: string; time: string } | null>(null)
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
      .eq('is_booked', false) // only tutors not yet matched to any student
    const counts: Record<string, number> = {}
    for (const row of data || []) {
      const k = slotKey(row.available_date, row.available_time)
      counts[k] = (counts[k] || 0) + 1
    }
    setFreeTutorCounts(counts)
  }

  function changeDuration(d: Duration) {
    setDuration(d)
    setSelStart(null)
    setSelBlock(null)
  }

  function toggleSlot(date: string, time: string) {
    if (selBlock && slotKey(selBlock.date, selBlock.time) === slotKey(date, time)) return
    if (selStart && slotKey(selStart.date, selStart.time) === slotKey(date, time)) {
      setSelStart(null); setSelBlock(null); return
    }
    if (duration === 30) {
      const timeIdx = TIME_SLOTS.indexOf(time)
      if (timeIdx >= TIME_SLOTS.length - 1) return
      setSelStart({ date, time })
      setSelBlock({ date, time: TIME_SLOTS[timeIdx + 1] })
    } else {
      setSelStart({ date, time })
      setSelBlock(null)
    }
  }

  function cellState(date: string, time: string) {
    if (selStart && slotKey(selStart.date, selStart.time) === slotKey(date, time)) return 'sel'
    if (selBlock && slotKey(selBlock.date, selBlock.time) === slotKey(date, time)) return 'block'
    const timeIdx = TIME_SLOTS.indexOf(time)
    if (duration === 30 && timeIdx >= TIME_SLOTS.length - 1) return 'disabled'
    return 'open'
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
    if (!selStart || !user) return
    setSubmitting(true)
    const { error } = await supabase.from('sessions').insert({
      student_id: user.id,
      subject,
      course,
      student_grade: grade ? parseInt(grade) : null,
      session_date: selStart.date,
      session_time: selStart.time,
      duration,
      status: 'pending',
    })
    if (!error) {
      await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id, course, subject,
          date: selStart.date, time: selStart.time, duration,
        }),
      })
      setSuccess(true)
    }
    setSubmitting(false)
  }

  const freeTutorsAtSelection = selStart ? freeTutorCount(selStart.date, selStart.time) : 0

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
          {course} · {selStart?.time} · {duration} min{grade ? ` · Grade: ${grade}` : ''}
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => {
          setSuccess(false); setStep(1); setCourse(''); setGrade(''); setGradeError('')
          setSelStart(null); setSelBlock(null)
        }}>
          Request Another Session
        </button>
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
            {/* Subject toggle */}
            <div className="form-group">
              <label>What subject do you need help with?</label>
              <div className="subject-toggle">
                <button type="button" className={`subject-btn ${subject === 'math' ? 'active' : ''}`}
                  onClick={() => { setSubject('math'); setCourse(''); setGrade(''); setGradeError('') }}>
                  📐 Math
                </button>
                <button type="button" className={`subject-btn ${subject === 'science' ? 'active' : ''}`}
                  onClick={() => { setSubject('science'); setCourse(''); setGrade(''); setGradeError('') }}>
                  🔬 Science
                </button>
              </div>
            </div>

            {/* Course picker */}
            <div className="form-group">
              <label>Which {subject === 'math' ? 'Math' : 'Science'} course do you need help with?</label>
              <div className="course-list">
                {courses.map(c => (
                  <div
                    key={c}
                    className={`course-item ${course === c ? 'selected' : ''}`}
                    onClick={() => { setCourse(c); setGrade(''); setGradeError('') }}
                  >
                    <span style={{ marginLeft: '0.25rem' }}>{course === c ? '✓' : '○'}</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Grade entry — shown as soon as a course is selected */}
            {course && (
              <div className="form-group">
                <div style={{
                  background: '#f9f6ef',
                  border: '1px solid #e2d9c8',
                  borderRadius: '10px',
                  padding: '1.25rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginBottom: '0.3rem' }}>
                        Your current grade in{' '}
                        <span style={{ color: 'var(--navy)', textTransform: 'none', letterSpacing: 0, fontWeight: 700 }}>
                          {course}
                        </span>
                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}> (optional)</span>
                      </label>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
                        Your Proctor will track whether your grade improves after each tutoring session.
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="—"
                          value={grade}
                          onChange={e => handleGradeChange(e.target.value)}
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            padding: '0.5rem',
                            border: `2px solid ${gradeError ? '#fca5a5' : grade ? 'var(--gold)' : 'var(--border)'}`,
                            borderRadius: '8px',
                            color: 'var(--navy)',
                            background: 'white',
                          }}
                        />
                        {grade && !gradeError && (
                          <span style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            background: 'var(--gold)', color: 'var(--navy)',
                            borderRadius: '999px', width: '18px', height: '18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700,
                          }}>✓</span>
                        )}
                      </div>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)' }}>out of 100</span>
                    </div>
                  </div>
                  {gradeError && (
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#b91c1c', margin: '0.25rem 0 0' }}>
                      {gradeError}
                    </p>
                  )}

                  {/* Grade context chip */}
                  {grade && !gradeError && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                      background: parseInt(grade) >= 90 ? '#f0fdf4' : parseInt(grade) >= 70 ? '#fef9ee' : '#fef2f2',
                      border: `1px solid ${parseInt(grade) >= 90 ? '#bbf7d0' : parseInt(grade) >= 70 ? '#fde68a' : '#fecaca'}`,
                      borderRadius: '6px',
                    }}>
                      <span style={{
                        fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem',
                        color: parseInt(grade) >= 90 ? '#15803d' : parseInt(grade) >= 70 ? '#92400e' : '#b91c1c',
                      }}>
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
            {/* Course + grade reminder */}
            <div style={{
              background: '#f9f6ef', border: '1px solid #e2d9c8',
              borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
              fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--navy)',
              display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
            }}>
              <span><strong>Course:</strong> {course}</span>
              {grade && <span><strong>Current grade:</strong> {grade}%</span>}
              <span><strong>Subject:</strong> {subject === 'math' ? '📐 Math' : '🔬 Science'}</span>
            </div>

            {/* Duration */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Session length:</span>
              {([15, 30] as Duration[]).map(d => (
                <button key={d} type="button" onClick={() => changeDuration(d)} style={{
                  padding: '0.4rem 1rem', borderRadius: '999px',
                  border: `2px solid ${duration === d ? 'var(--navy)' : 'var(--border)'}`,
                  background: duration === d ? 'var(--navy)' : 'white',
                  color: duration === d ? 'white' : 'var(--text-muted)',
                  fontFamily: 'system-ui, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}>
                  {d} min
                </button>
              ))}
              {duration === 30 && (
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  · picks two consecutive 15-min slots
                </span>
              )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: '#f9f6ef', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Free tutors for {course}:
              </span>
              {[
                { bg: '#f5f3ee', border: '1px solid #e2d9c8', label: 'None (waitlist)' },
                { bg: '#e8f5f0', label: '1 free' },
                { bg: '#c8e9dc', label: '2 free' },
                { bg: '#9fd9c2', label: '3+ free' },
                { bg: 'var(--navy)', label: 'Your pick' },
                ...(duration === 30 ? [{ bg: '#1a4a6b', label: 'Included' }] : []),
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: s.bg, border: s.border || 'none', flexShrink: 0 }} />
                  {s.label}
                </div>
              ))}
            </div>

            {/* Week nav */}
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setWeekOffset(w => Math.max(0, w - 1))}>← Prev</button>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)' }}>
                {formatDate(days[0])} – {formatDate(days[4])}
              </span>
              <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
            </div>

            {/* Calendar */}
            <div style={{ overflowX: 'auto' }}>
              <table className="cal-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map(d => (
                      <th key={d.toISOString()}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}<br />
                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                          {d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time, ti) => (
                    <tr key={time}>
                      <td>{time}</td>
                      {days.map(d => {
                        const dateStr = formatDateISO(d)
                        const state = cellState(dateStr, time)
                        const level = freeTutorLevel(dateStr, time)
                        const count = freeTutorCount(dateStr, time)
                        const timeIdx = TIME_SLOTS.indexOf(time)
                        const endTime = duration === 30 && timeIdx + 1 < TIME_SLOTS.length ? TIME_SLOTS[timeIdx + 1] : null

                        const bgMap: Record<number, string> = { 0: '#f5f3ee', 1: '#e8f5f0', 2: '#c8e9dc', 3: '#9fd9c2' }
                        const colorMap: Record<number, string> = { 0: '#9ca3af', 1: '#1a7f5a', 2: '#155e3b', 3: '#0e4a2e' }

                        let bg = bgMap[level], color = colorMap[level]
                        let cursor: React.CSSProperties['cursor'] = 'pointer'
                        if (state === 'sel') { bg = 'var(--navy)'; color = 'var(--gold)' }
                        if (state === 'block') { bg = '#1a4a6b'; color = '#90caf9'; cursor = 'default' }
                        if (state === 'disabled') { bg = '#f5f3ee'; color = '#ddd'; cursor = 'not-allowed' }

                        return (
                          <td key={dateStr}>
                            <div
                              style={{ padding: '3px 2px', borderRadius: '5px', cursor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', minHeight: '34px', width: '100%', fontSize: '0.72rem', transition: 'background 0.12s', userSelect: 'none', background: bg, color }}
                              onClick={() => state !== 'block' && state !== 'disabled' && toggleSlot(dateStr, time)}
                            >
                              {state === 'sel' && (<><span style={{ fontWeight: 700 }}>✓ {duration === 30 ? 'Start' : 'Selected'}</span>{duration === 30 && endTime && <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>{time}–{endTime}</span>}</>)}
                              {state === 'block' && (<><span style={{ fontSize: '0.65rem' }}>↑ included</span><span style={{ fontSize: '0.6rem', opacity: 0.75 }}>{time}</span></>)}
                              {state === 'disabled' && <span style={{ fontSize: '0.65rem' }}>—</span>}
                              {state === 'open' && (count === 0
                                ? (<><span style={{ fontSize: '0.65rem' }}>No free tutors</span><span style={{ fontSize: '0.6rem', opacity: 0.75 }}>Book anyway</span></>)
                                : (<><div style={{ display: 'flex', gap: '2px' }}>{Array(Math.min(count, 3)).fill(0).map((_, i) => <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />)}</div><span style={{ fontSize: '0.68rem', fontWeight: 700 }}>{count} free tutor{count !== 1 ? 's' : ''}</span></>)
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selStart && (
              <div className="session-summary" style={{ marginTop: '1rem' }}>
                <span><strong>Course:</strong> {course}</span>
                {grade && <span><strong>Grade:</strong> {grade}%</span>}
                <span><strong>Date:</strong> {new Date(selStart.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span><strong>Time:</strong> {selStart.time}{selBlock ? ' – ' + selBlock.time : ''}</span>
                <span><strong>Duration:</strong> {duration} min</span>
                {freeTutorsAtSelection > 0
                  ? <span style={{ color: '#9fe1cb' }}>· {freeTutorsAtSelection} free tutor{freeTutorsAtSelection !== 1 ? 's' : ''}</span>
                  : <span style={{ color: '#fde8aa' }}>· no free tutors yet — waitlisted</span>}
              </div>
            )}

            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Green slots have unmatched Volunteer Tutors free for {course}. You can book any slot — gray ones go to the waitlist.
            </p>

            <div className="flex-between" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => { setStep(1); setSelStart(null); setSelBlock(null) }}>← Back</button>
              <button className="btn-primary" disabled={!selStart || submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting…' : 'Submit & Get Matched →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
