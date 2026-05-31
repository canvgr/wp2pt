'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MATH_COURSES, SCIENCE_COURSES, TIME_SLOTS, getWeekDays, formatDate, formatDateISO } from '@/lib/courses'

type Step = 1 | 2
type Subject = 'math' | 'science'
type Duration = 15 | 30

type SlotKey = string // "dateISO|time"

export default function TutorAvailabilityPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [step, setStep] = useState<Step>(1)
  const [subject, setSubject] = useState<Subject>('math')
  const [selectedMathCourses, setSelectedMathCourses] = useState<string[]>([])
  const [selectedScienceCourses, setSelectedScienceCourses] = useState<string[]>([])
  const [duration, setDuration] = useState<Duration>(30)
  const [weekOffset, setWeekOffset] = useState(0)
  const [setSlots, setSetSlots] = useState<Set<SlotKey>>(new Set())
  const [blockSlots, setBlockSlots] = useState<Set<SlotKey>>(new Set())
  const [demand, setDemand] = useState<Record<SlotKey, { count: number; courses: string[] }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const days = getWeekDays(weekOffset)
  const allSelectedCourses = [...selectedMathCourses, ...selectedScienceCourses]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/tutor/login'); return }
      setUser({ id: data.user.id, email: data.user.email! })
    })
  }, [router])

  useEffect(() => {
    if (step === 2 && allSelectedCourses.length > 0) loadDemand()
  }, [step, weekOffset, allSelectedCourses.join(',')])

  async function loadDemand() {
    const dateStrings = days.map(formatDateISO)
    const { data } = await supabase
      .from('sessions')
      .select('session_date, session_time, course')
      .in('session_date', dateStrings)
      .in('course', allSelectedCourses)
      .eq('status', 'pending')

    const map: Record<SlotKey, { count: number; courses: string[] }> = {}
    for (const row of data || []) {
      const key = `${row.session_date}|${row.session_time}`
      if (!map[key]) map[key] = { count: 0, courses: [] }
      map[key].count++
      if (!map[key].courses.includes(row.course)) map[key].courses.push(row.course)
    }
    setDemand(map)
  }

  function slotKey(date: string, time: string): SlotKey { return `${date}|${time}` }

  function toggleSlot(date: string, time: string) {
    const key = slotKey(date, time)
    if (blockSlots.has(key)) return

    const newSet = new Set(setSlots)
    const newBlock = new Set(blockSlots)

    if (newSet.has(key)) {
      newSet.delete(key)
      if (duration === 30) {
        const timeIdx = TIME_SLOTS.indexOf(time)
        if (timeIdx < TIME_SLOTS.length - 1) {
          newBlock.delete(slotKey(date, TIME_SLOTS[timeIdx + 1]))
        }
      }
    } else {
      if (duration === 30) {
        const timeIdx = TIME_SLOTS.indexOf(time)
        if (timeIdx >= TIME_SLOTS.length - 1) return
        const nextKey = slotKey(date, TIME_SLOTS[timeIdx + 1])
        newSet.delete(nextKey)
        newBlock.delete(nextKey)
        newBlock.add(nextKey)
      }
      newSet.add(key)
    }

    setSetSlots(newSet)
    setBlockSlots(newBlock)
  }

  function changeDuration(d: Duration) {
    setDuration(d)
    setSetSlots(new Set())
    setBlockSlots(new Set())
  }

  function demandLevel(date: string, time: string) {
    const d = demand[slotKey(date, time)]
    if (!d) return 0
    return Math.min(d.count, 3)
  }

  function demandInfo(date: string, time: string) {
    return demand[slotKey(date, time)] || { count: 0, courses: [] }
  }

  function demandStyle(level: number): React.CSSProperties {
    const styles: Record<number, React.CSSProperties> = {
      0: { background: '#f9f6ef', color: '#bbb' },
      1: { background: '#fef9ee', color: '#92400e' },
      2: { background: '#fef0cc', color: '#854f0b' },
      3: { background: '#fde8aa', color: '#633806' },
    }
    return styles[level] || styles[0]
  }

  async function handleSubmit() {
    if (!user || setSlots.size === 0) return
    setSubmitting(true)

    const rows = Array.from(setSlots).map(key => {
      const [date, time] = key.split('|')
      return {
        tutor_id: user.id,
        subject: selectedMathCourses.length > 0 ? 'math' : 'science',
        courses: allSelectedCourses,
        available_date: date,
        available_time: time,
        duration,
        is_booked: false,
      }
    })

    const dates = Array.from(new Set(rows.map(r => r.available_date)))
    const { error: delError } = await supabase.from('tutor_availability').delete().eq('tutor_id', user.id).in('available_date', dates)
    if (delError) console.error('Delete error:', delError)
    const { error: insError } = await supabase.from('tutor_availability').insert(rows)
    if (insError) console.error('Insert error:', insError)
    setSuccess(true)
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="page-narrow" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#155e3b' }}>Availability Set!</h2>
        <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          You've registered {setSlots.size} time slot{setSlots.size !== 1 ? 's' : ''}. You'll receive a confirmation email when matched with a student.
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem', background: '#155e3b' }}
          onClick={() => { setSuccess(false); setStep(1); setSetSlots(new Set()); setBlockSlots(new Set()) }}>
          Update Availability
        </button>
        <button className="btn-secondary" style={{ marginTop: '0.75rem', display: 'block', width: '100%' }} onClick={async () => {
          await supabase.auth.signOut(); router.push('/')
        }}>
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="page-narrow">
      <h1 style={{ color: 'var(--navy)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Volunteer Tutor Portal</h1>
      <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {step === 1 ? 'Select the courses you can tutor.' : 'Set the times you\'re available — see where students need you most.'}
      </p>

      <div className="steps">
        <div className={`step ${step === 1 ? 'active' : 'done'}`}>
          <div className="step-num">{step > 1 ? '✓' : '1'}</div>
          <span>Subjects</span>
        </div>
        <div className="step-divider" />
        <div className={`step ${step === 2 ? 'active' : ''}`}>
          <div className="step-num">2</div>
          <span>Availability</span>
        </div>
      </div>

      <div className="card">
        {step === 1 && (
          <>
            <div className="form-group">
              <label>Which subject can you tutor?</label>
              <div className="subject-toggle">
                <button type="button" className={`subject-btn ${subject === 'math' ? 'active' : ''}`}
                  onClick={() => setSubject('math')}>📐 Math</button>
                <button type="button" className={`subject-btn ${subject === 'science' ? 'active' : ''}`}
                  onClick={() => setSubject('science')}>🔬 Science</button>
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                You can select courses from both Math and Science — switch tabs and check all that apply.
              </p>
            </div>

            <div className="form-group">
              <label>
                Which {subject === 'math' ? 'Math' : 'Science'} courses can you tutor?
                <span style={{ fontWeight: 400, marginLeft: '0.5rem', color: 'var(--success)' }}>
                  {subject === 'math' ? selectedMathCourses.length : selectedScienceCourses.length} selected
                </span>
              </label>
              <div className="course-list">
                {(subject === 'math' ? MATH_COURSES : SCIENCE_COURSES).map(c => {
                  const isSelected = subject === 'math' ? selectedMathCourses.includes(c) : selectedScienceCourses.includes(c)
                  return (
                    <div key={c} className={`course-item ${isSelected ? 'selected' : ''}`} onClick={() => {
                      if (subject === 'math') setSelectedMathCourses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
                      else setSelectedScienceCourses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
                    }}>
                      <input type="checkbox" readOnly checked={isSelected} style={{ pointerEvents: 'none' }} />
                      {c}
                    </div>
                  )
                })}
              </div>
            </div>

            {allSelectedCourses.length > 0 && (
              <div style={{ background: '#eff9f5', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: '#155e3b', margin: 0 }}>
                  <strong>{allSelectedCourses.length} course{allSelectedCourses.length !== 1 ? 's' : ''} selected:</strong>{' '}
                  {allSelectedCourses.join(', ')}
                </p>
              </div>
            )}

            <div className="flex-end">
              <button className="btn-primary" style={{ background: '#155e3b' }}
                disabled={allSelectedCourses.length === 0}
                onClick={() => setStep(2)}>
                Next: Set Availability →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Courses reminder */}
            <div style={{ background: '#eff9f5', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: '#155e3b', margin: 0 }}>
                <strong>Your courses:</strong> {allSelectedCourses.join(', ')}
              </p>
            </div>

            {/* Duration */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Session length:</span>
              {([15, 30] as Duration[]).map(d => (
                <button key={d} type="button" onClick={() => changeDuration(d)} style={{
                  padding: '0.4rem 1rem', borderRadius: '999px',
                  border: `2px solid ${duration === d ? '#155e3b' : 'var(--border)'}`,
                  background: duration === d ? '#155e3b' : 'white',
                  color: duration === d ? 'white' : 'var(--text-muted)',
                  fontFamily: 'system-ui, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}>
                  {d} min
                </button>
              ))}
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {duration === 30 ? '· selecting a slot also reserves the next 15 min' : ''}
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: '#f9f6ef', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student demand:</span>
              {[
                { bg: '#f9f6ef', border: '1px solid #e2d9c8', label: 'None' },
                { bg: '#fef9ee', label: 'Low (1)' },
                { bg: '#fef0cc', label: 'Med (2)' },
                { bg: '#fde8aa', label: 'High (3+)' },
                { bg: '#155e3b', label: 'You\'re set', color: 'white' },
                { bg: '#1a7f5a', label: 'Included', color: 'white' },
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
                        const key = slotKey(dateStr, time)
                        const isSet = setSlots.has(key)
                        const isBlock = blockSlots.has(key)
                        const info = demandInfo(dateStr, time)
                        const level = demandLevel(dateStr, time)
                        const isLastSlot = ti === TIME_SLOTS.length - 1

                        let cellStyle: React.CSSProperties = { cursor: 'pointer', padding: '4px 2px', minHeight: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', borderRadius: '6px', fontSize: '0.72rem', transition: 'all 0.12s', width: '100%', textAlign: 'center' }

                        if (isSet) {
                          cellStyle = { ...cellStyle, background: '#155e3b', color: 'white' }
                        } else if (isBlock) {
                          cellStyle = { ...cellStyle, background: '#1a7f5a', color: 'white', cursor: 'default' }
                        } else if (duration === 30 && isLastSlot) {
                          cellStyle = { ...cellStyle, background: '#f3f3f3', color: '#bbb', cursor: 'not-allowed' }
                        } else {
                          cellStyle = { ...cellStyle, ...demandStyle(level) }
                        }

                        return (
                          <td key={dateStr}>
                            <div style={cellStyle} onClick={() => !isBlock && !(duration === 30 && isLastSlot) && toggleSlot(dateStr, time)}>
                              {isSet && (
                                <>
                                  <span style={{ fontWeight: 700, fontSize: '0.72rem' }}>✓ Available</span>
                                  {duration === 30 && <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>{time}+15m</span>}
                                </>
                              )}
                              {isBlock && (
                                <span style={{ fontSize: '0.65rem' }}>↑ incl.</span>
                              )}
                              {!isSet && !isBlock && !(duration === 30 && isLastSlot) && (
                                <>
                                  {level > 0 ? (
                                    <>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        {Array(level).fill(0).map((_, i) => (
                                          <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />
                                        ))}
                                      </div>
                                      <span style={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
                                        {info.courses[0]}{info.courses.length > 1 ? ` +${info.courses.length - 1}` : ''}
                                      </span>
                                      <span style={{ fontSize: '0.62rem' }}>{info.count} student{info.count !== 1 ? 's' : ''}</span>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: '0.65rem', color: '#ccc' }}>—</span>
                                  )}
                                </>
                              )}
                              {!isSet && !isBlock && duration === 30 && isLastSlot && (
                                <span style={{ fontSize: '0.65rem' }}>—</span>
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

            {setSlots.size > 0 && (
              <div className="session-summary" style={{ background: '#155e3b', marginTop: '1rem' }}>
                <span><strong style={{ color: '#9fe1cb' }}>Slots set:</strong> {setSlots.size}</span>
                <span><strong style={{ color: '#9fe1cb' }}>Duration:</strong> {duration} min each</span>
                <span><strong style={{ color: '#9fe1cb' }}>Courses:</strong> {allSelectedCourses.length} selected</span>
              </div>
            )}

            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Heat color shows how many students need a tutor at that time in your courses. Tap any slot to mark yourself available.
            </p>

            <div className="flex-between" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ background: '#155e3b' }}
                disabled={setSlots.size === 0 || submitting}
                onClick={handleSubmit}>
                {submitting ? 'Saving…' : 'Submit Availability →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
