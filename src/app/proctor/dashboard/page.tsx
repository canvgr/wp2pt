'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TIME_SLOTS, getWeekDays, formatDateISO, formatDate } from '@/lib/courses'

type SessionRow = {
  id: string
  session_date: string
  session_time: string
  duration: number
  course: string
  subject: string
  status: string
  student_grade: number | null
  student: { first_name: string; last_name: string; email: string } | null
  tutor: { first_name: string; last_name: string; email: string } | null
}

type TutorStat = {
  id: string
  name: string
  email: string
  sessions: number
  mins: number
}

type GradeEntry = {
  studentName: string
  studentEmail: string
  course: string
  subject: string
  sessions: { date: string; grade: number | null; status: string }[]
}

type TutorAvailabilityRow = {
  id: string
  available_date: string
  available_time: string
  duration: number
  courses: string[]
  subject: string
  is_booked: boolean
  tutor: { first_name: string; last_name: string; email: string } | null
}

type View = 'calendar' | 'hours' | 'grades' | 'available'

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]

export default function ProctorDashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('calendar')
  const [weekOffset, setWeekOffset] = useState(0)
  const [availability, setAvailability] = useState<TutorAvailabilityRow[]>([])
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null)
  const [classroom, setClassroom] = useState('')
  const [classroomInput, setClassroomInput] = useState('')
  const [savingClassroom, setSavingClassroom] = useState(false)
  const [classroomSaved, setClassroomSaved] = useState(false)
  const [search, setSearch] = useState('')

  // Delete data state
  const [showDeletePanel, setShowDeletePanel] = useState(false)
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR))
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2 | 3>(0)
  const [deleting, setDeleting] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const days = getWeekDays(weekOffset)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sessions')
      .select(`id, session_date, session_time, duration, course, subject, status, student_grade,
        student:profiles!sessions_student_id_fkey(first_name, last_name, email),
        tutor:profiles!sessions_tutor_id_fkey(first_name, last_name, email)`)
      .order('session_date', { ascending: true })
      .order('session_time', { ascending: true })
    setSessions((data as unknown as SessionRow[]) || [])
    const { data: avail } = await supabase
      .from('tutor_availability')
      .select(`id, available_date, available_time, duration, courses, subject, is_booked,
        tutor:profiles!tutor_availability_tutor_id_fkey(first_name, last_name, email)`)
      .order('available_date', { ascending: true })
      .order('available_time', { ascending: true })
    setAvailability((avail as unknown as TutorAvailabilityRow[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'get_classroom' }),
    })
      .then(r => r.json())
      .then(d => {
        setClassroom(d.classroom || '')
        setClassroomInput(d.classroom || '')
      })
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/proctor/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'proctor') { router.push('/proctor/login'); return }
      loadSessions()
    })
  }, [router, loadSessions])

  async function saveClassroom() {
    if (!classroomInput.trim()) return
    setSavingClassroom(true)
    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'set_classroom', classroom: classroomInput.trim() }),
    })
    setClassroom(classroomInput.trim())
    setSavingClassroom(false)
    setClassroomSaved(true)
    setTimeout(() => setClassroomSaved(false), 3000)
  }

  function toggleMonth(m: string) {
    setSelectedMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  async function executeDelete() {
    if (selectedMonths.length === 0) return
    setDeleting(true)
    for (const month of selectedMonths) {
      const from = `${selectedYear}-${month}-01`
      const lastDay = new Date(parseInt(selectedYear), parseInt(month), 0).getDate()
      const to = `${selectedYear}-${month}-${String(lastDay).padStart(2, '0')}`
      await supabase.from('sessions').delete().gte('session_date', from).lte('session_date', to)
      await supabase.from('tutor_availability').delete().gte('available_date', from).lte('available_date', to)
    }
    setDeleting(false)
    setDeleteSuccess(true)
    setDeleteStep(0)
    setSelectedMonths([])
    setShowDeletePanel(false)
    setTimeout(() => setDeleteSuccess(false), 5000)
    loadSessions()
  }

  const selectedMonthLabels = selectedMonths
    .sort()
    .map(m => MONTHS.find(x => x.value === m)?.label)
    .join(', ')

  function getSlots(date: string, time: string): SessionRow[] {
    return sessions.filter(s => s.session_date === date && s.session_time === time)
  }

  function getAvailableTutors(date: string, time: string): TutorAvailabilityRow[] {
    return availability.filter(a => a.available_date === date && a.available_time === time && !a.is_booked)
  }

  const tutorStats: TutorStat[] = (() => {
    const map: Record<string, TutorStat> = {}
    sessions.filter(s => s.tutor && s.status !== 'cancelled').forEach(s => {
      const key = s.tutor!.email
      if (!map[key]) map[key] = { id: key, name: `${s.tutor!.first_name} ${s.tutor!.last_name}`, email: key, sessions: 0, mins: 0 }
      map[key].sessions++
      map[key].mins += s.duration
    })
    return Object.values(map).sort((a, b) => b.mins - a.mins)
  })()

  const maxMins = tutorStats[0]?.mins || 1

  const gradeHistory: GradeEntry[] = (() => {
    const map: Record<string, GradeEntry> = {}
    sessions.forEach(s => {
      if (!s.student) return
      const key = `${s.student.email}||${s.course}`
      if (!map[key]) map[key] = {
        studentName: `${s.student.first_name} ${s.student.last_name}`,
        studentEmail: s.student.email,
        course: s.course,
        subject: s.subject,
        sessions: [],
      }
      map[key].sessions.push({ date: s.session_date, grade: s.student_grade, status: s.status })
    })
    Object.values(map).forEach(e => e.sessions.sort((a, b) => a.date.localeCompare(b.date)))
    return Object.values(map).sort((a, b) => a.studentName.localeCompare(b.studentName))
  })()

  function gradeChange(entry: GradeEntry) {
    const g = entry.sessions.filter(s => s.grade !== null)
    if (g.length < 2) return null
    return (g[g.length - 1].grade as number) - (g[0].grade as number)
  }

  const stats = {
    total: sessions.length,
    paired: sessions.filter(s => s.status === 'matched' || s.status === 'completed').length,
    unpaired: sessions.filter(s => s.status === 'pending').length,
    students: new Set(sessions.map(s => s.student?.email)).size,
    tutors: new Set(sessions.filter(s => s.tutor).map(s => s.tutor?.email)).size,
    totalMins: sessions.filter(s => s.tutor).reduce((sum, s) => sum + s.duration, 0),
  }

  const q = search.toLowerCase().trim()
  const filteredTutorStats = tutorStats.filter(t => !q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q))
  const filteredGradeHistory = gradeHistory.filter(e => !q || e.studentName.toLowerCase().includes(q) || e.studentEmail.toLowerCase().includes(q) || e.course.toLowerCase().includes(q))
  const filteredAvailability = availability.filter(a => !a.is_booked).filter(a =>
    !q || (a.tutor && (`${a.tutor.first_name} ${a.tutor.last_name}`).toLowerCase().includes(q)) ||
    (a.tutor && a.tutor.email.toLowerCase().includes(q)) ||
    (Array.isArray(a.courses) && a.courses.join(' ').toLowerCase().includes(q))
  )

  const btnBase: React.CSSProperties = {
    border: '1.5px solid #e2d9c8', borderRadius: '10px', padding: '14px 10px',
    background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', flex: 1,
  }
  const btnActive: React.CSSProperties = { ...btnBase, borderColor: 'var(--navy)', background: 'var(--navy)' }

  return (
    <div className="page" style={{ maxWidth: '1100px' }}>
      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
        <div>
          <h1 style={{ color: 'var(--navy)', fontSize: '1.5rem', margin: '0 0 0.25rem' }}>Proctor Dashboard</h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Wolverines Peer-to-Peer Tutoring · Belen Jesuit Preparatory School
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => { setShowDeletePanel(!showDeletePanel); setDeleteStep(0); setSelectedMonths([]) }}
            style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 700,
              padding: '0.45rem 0.9rem', background: showDeletePanel ? '#7f1d1d' : '#fef2f2',
              color: showDeletePanel ? 'white' : '#b91c1c',
              border: '1.5px solid #fca5a5', borderRadius: '7px', cursor: 'pointer',
            }}
          >
            🗑 Clear Data
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.85rem' }}
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Delete success banner */}
      {deleteSuccess && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '0.75rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
          ✓ Data successfully deleted for the selected months.
        </div>
      )}

      {/* Delete Panel */}
      {showDeletePanel && (
        <div style={{ marginTop: '1rem', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#7f1d1d', marginBottom: '0.75rem' }}>
            🗑 Clear Session Data by Month
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: '#b91c1c', marginBottom: '1rem' }}>
            This permanently deletes all sessions and tutor availability records for the selected months. This cannot be undone.
          </p>

          {/* Year selector */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {YEARS.map(y => (
                <button key={y} onClick={() => setSelectedYear(String(y))} style={{
                  fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                  padding: '0.35rem 0.9rem',
                  background: selectedYear === String(y) ? '#7f1d1d' : 'white',
                  color: selectedYear === String(y) ? 'white' : '#7f1d1d',
                  border: '1.5px solid #fca5a5', borderRadius: '6px', cursor: 'pointer',
                }}>{y}</button>
              ))}
            </div>
          </div>

          {/* Month selector */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Months to Delete
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {MONTHS.map(m => (
                <button key={m.value} onClick={() => toggleMonth(m.value)} style={{
                  fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  background: selectedMonths.includes(m.value) ? '#7f1d1d' : 'white',
                  color: selectedMonths.includes(m.value) ? 'white' : '#7f1d1d',
                  border: '1.5px solid #fca5a5', borderRadius: '6px', cursor: 'pointer',
                }}>{m.label}</button>
              ))}
            </div>
          </div>

          {/* Triple confirmation steps */}
          {selectedMonths.length > 0 && deleteStep === 0 && (
            <button onClick={() => setDeleteStep(1)} style={{
              fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.85rem',
              padding: '0.5rem 1.25rem', background: '#b91c1c', color: 'white',
              border: 'none', borderRadius: '7px', cursor: 'pointer',
            }}>
              Delete data for {selectedMonthLabels} {selectedYear} →
            </button>
          )}

          {deleteStep === 1 && (
            <div style={{ background: 'white', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#7f1d1d', marginBottom: '0.5rem' }}>
                ⚠️ Step 1 of 3 — Confirm months
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: '#4a5568', marginBottom: '0.75rem' }}>
                You are about to delete all data for <strong>{selectedMonthLabels} {selectedYear}</strong>. Are these the correct months?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setDeleteStep(2)} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Yes, these months are correct →
                </button>
                <button onClick={() => setDeleteStep(0)} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: 'white', color: '#7f1d1d', border: '1.5px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
                  Go back
                </button>
              </div>
            </div>
          )}

          {deleteStep === 2 && (
            <div style={{ background: 'white', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#7f1d1d', marginBottom: '0.5rem' }}>
                ⚠️ Step 2 of 3 — Confirm deletion
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: '#4a5568', marginBottom: '0.75rem' }}>
                This will permanently delete all sessions and tutor availability for <strong>{selectedMonthLabels} {selectedYear}</strong>. This action <strong>cannot be undone</strong>. Are you sure you want to delete this data?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setDeleteStep(3)} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Yes, I want to delete this data →
                </button>
                <button onClick={() => setDeleteStep(0)} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: 'white', color: '#7f1d1d', border: '1.5px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
                  Go back
                </button>
              </div>
            </div>
          )}

          {deleteStep === 3 && (
            <div style={{ background: '#7f1d1d', border: '1.5px solid #b91c1c', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'white', marginBottom: '0.5rem' }}>
                ⚠️ Step 3 of 3 — Final confirmation
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', color: '#fecaca', marginBottom: '0.75rem' }}>
                Last chance. You are permanently deleting all data for <strong style={{ color: 'white' }}>{selectedMonthLabels} {selectedYear}</strong>. Click Confirm to proceed.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={executeDelete}
                  disabled={deleting}
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: 'white', color: '#7f1d1d', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {deleting ? 'Deleting…' : '✓ Confirm — Delete permanently'}
                </button>
                <button onClick={() => setDeleteStep(0)} style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.82rem', padding: '0.4rem 1rem', background: 'transparent', color: '#fecaca', border: '1.5px solid #fecaca', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Classroom Setting */}
      <div style={{
        marginTop: '1.25rem', background: 'white', border: '1.5px solid #c9a84c',
        borderRadius: '10px', padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)', marginBottom: '0.2rem' }}>
            📍 Tutoring Classroom
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            This classroom appears in all match confirmation emails. Update it anytime to notify future sessions automatically.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="e.g. Room 214"
            value={classroomInput}
            onChange={e => setClassroomInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveClassroom() }}
            style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: 700,
              padding: '0.5rem 0.75rem', border: '1.5px solid #c9a84c', borderRadius: '7px',
              color: 'var(--navy)', width: '160px', outline: 'none',
            }}
          />
          <button onClick={saveClassroom} disabled={savingClassroom || !classroomInput.trim()} style={{
            fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.85rem',
            padding: '0.5rem 1rem', background: 'var(--navy)', color: 'var(--gold)',
            border: 'none', borderRadius: '7px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {savingClassroom ? 'Saving…' : 'Save & Notify'}
          </button>
          {classroomSaved && <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#155e3b', fontWeight: 600 }}>✓ Saved — emails sent!</span>}
          {classroom && !classroomSaved && <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current: <strong style={{ color: 'var(--navy)' }}>{classroom}</strong></span>}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginTop: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div className="stat-card"><div className="stat-label">Total Sessions</div><div className="stat-value">{stats.total}</div></div>
        <div className="stat-card"><div className="stat-label">Paired</div><div className="stat-value" style={{ color: 'var(--success)' }}>{stats.paired}</div></div>
        <div className="stat-card"><div className="stat-label">Unpaired</div><div className="stat-value" style={{ color: '#92400e' }}>{stats.unpaired}</div></div>
        <div className="stat-card"><div className="stat-label">Active Students</div><div className="stat-value">{stats.students}</div></div>
        <div className="stat-card"><div className="stat-label">Active Tutors</div><div className="stat-value">{stats.tutors}</div></div>
        <div className="stat-card"><div className="stat-label">Total Tutor Min</div><div className="stat-value">{stats.totalMins}</div></div>
      </div>

      {/* View buttons */}
      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
        {([
          { id: 'calendar', icon: '📅', label: 'Session Calendar', desc: 'Click any slot to see full detail' },
          { id: 'hours', icon: '⏱', label: 'Tutor Hours', desc: 'Minutes volunteered per tutor' },
          { id: 'grades', icon: '📈', label: 'Student Progress', desc: 'Grade improvement over sessions' },
          { id: 'available', icon: '🙋', label: 'Tutors Available', desc: 'Unmatched tutors ready to help' },
        ] as const).map(v => (
          <button key={v.id} style={view === v.id ? btnActive : btnBase} onClick={() => { setView(v.id); setSearch('') }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{v.icon}</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: view === v.id ? 'var(--gold)' : 'var(--navy)', marginBottom: '3px' }}>{v.label}</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: view === v.id ? '#e0cc99' : 'var(--text-muted)', lineHeight: 1.4 }}>{v.desc}</div>
          </button>
        ))}
      </div>

      {/* Calendar */}
      {view === 'calendar' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px', padding: '6px 10px', background: 'white', border: '0.5px solid var(--border)', borderRadius: '7px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key:</span>
            {[
              { bg: '#e8f5f0', border: '0.5px solid #9fe1cb', label: 'Has paired sessions' },
              { bg: '#fef9ee', border: '0.5px solid #fde68a', label: 'Has unmatched students' },
              { bg: '#f5f3ee', border: '0.5px solid #e2d9c8', label: 'No activity' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.bg, border: l.border }} />
                {l.label}
              </div>
            ))}
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>· Click any slot to expand</span>
          </div>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => { setWeekOffset(w => w - 1); setExpandedSlot(null) }}>← Prev week</button>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)' }}>
              {formatDate(days[0])} – {formatDate(days[4])}
            </span>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              onClick={() => { setWeekOffset(w => w + 1); setExpandedSlot(null) }}>Next week →</button>
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
                      const slotKey = `${dateStr}|${time}`
                      const slotSessions = getSlots(dateStr, time)
                      const freeTutors = getAvailableTutors(dateStr, time)
                      const paired = slotSessions.filter(s => s.status === 'matched' || s.status === 'completed')
                      const unmatched = slotSessions.filter(s => s.status === 'pending')
                      const isExpanded = expandedSlot === slotKey
                      const hasActivity = slotSessions.length > 0 || freeTutors.length > 0
                      const bg = paired.length > 0 ? '#e8f5f0' : unmatched.length > 0 ? '#fef9ee' : '#f5f3ee'
                      const color = paired.length > 0 ? '#0e4a2e' : unmatched.length > 0 ? '#633806' : '#ccc'
                      return (
                        <td key={dateStr} style={{ verticalAlign: 'top', position: 'relative' }}>
                          <div onClick={() => hasActivity && setExpandedSlot(isExpanded ? null : slotKey)} style={{
                            padding: '3px 2px', borderRadius: '5px', background: bg, color,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: '1px', minHeight: '44px', width: '100%',
                            fontSize: '0.7rem', userSelect: 'none',
                            cursor: hasActivity ? 'pointer' : 'default',
                            border: isExpanded ? '2px solid var(--navy)' : '2px solid transparent',
                            boxSizing: 'border-box',
                          }}>
                            {!hasActivity && <span style={{ fontSize: '0.65rem' }}>—</span>}
                            {hasActivity && (
                              <>
                                {paired.length > 0 && <span style={{ fontWeight: 700, fontSize: '0.68rem' }}>✓ {paired.length} paired</span>}
                                {unmatched.length > 0 && <span style={{ fontSize: '0.65rem', color: '#92400e' }}>{unmatched.length} waiting</span>}
                                {freeTutors.length > 0 && <span style={{ fontSize: '0.62rem', color: '#155e3b' }}>{freeTutors.length} tutor{freeTutors.length !== 1 ? 's' : ''} free</span>}
                                <span style={{ fontSize: '0.58rem', opacity: 0.6 }}>{isExpanded ? '▲' : '▼'}</span>
                              </>
                            )}
                          </div>
                          {isExpanded && (
                            <div style={{
                              position: 'absolute', top: '100%', left: 0, zIndex: 50,
                              background: 'white', border: '1.5px solid var(--navy)',
                              borderRadius: '8px', padding: '0.6rem',
                              minWidth: '220px', maxWidth: '280px',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              fontFamily: 'system-ui, sans-serif',
                            }}>
                              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--navy)', marginBottom: '0.4rem', borderBottom: '1px solid #e2d9c8', paddingBottom: '0.3rem' }}>
                                {time} · {new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                              {paired.length > 0 && (
                                <div style={{ marginBottom: '0.4rem' }}>
                                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#155e3b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>✓ Paired ({paired.length})</div>
                                  {paired.map(s => (
                                    <div key={s.id} style={{ fontSize: '0.72rem', color: '#0e4a2e', background: '#f0fdf4', borderRadius: '5px', padding: '4px 6px', marginBottom: '3px' }}>
                                      <span style={{ fontWeight: 600 }}>{s.student?.last_name}</span><span style={{ opacity: 0.6 }}> ↔ </span><span style={{ fontWeight: 600 }}>{s.tutor?.last_name}</span>
                                      <span style={{ display: 'block', fontSize: '0.62rem', color: '#155e3b', opacity: 0.8 }}>{s.course.replace('AP ', '')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {unmatched.length > 0 && (
                                <div style={{ marginBottom: '0.4rem' }}>
                                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>⏳ Waiting ({unmatched.length})</div>
                                  {unmatched.map(s => (
                                    <div key={s.id} style={{ fontSize: '0.72rem', color: '#633806', background: '#fef9ee', borderRadius: '5px', padding: '3px 6px', marginBottom: '3px' }}>
                                      <span style={{ fontWeight: 600 }}>{s.student?.last_name}</span>
                                      <span style={{ display: 'block', fontSize: '0.62rem', opacity: 0.8 }}>{s.course.replace('AP ', '')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {freeTutors.length > 0 && (
                                <div>
                                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#155e3b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>🙋 Available ({freeTutors.length})</div>
                                  {freeTutors.map(a => (
                                    <div key={a.id} style={{ fontSize: '0.72rem', color: '#0e4a2e', background: '#eff9f5', borderRadius: '5px', padding: '3px 6px', marginBottom: '3px' }}>
                                      <span style={{ fontWeight: 600 }}>{a.tutor?.last_name}</span>
                                      <span style={{ display: 'block', fontSize: '0.62rem', opacity: 0.8 }}>{Array.isArray(a.courses) ? a.courses.map(c => c.replace('AP ', '')).join(', ') : a.courses}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right', cursor: 'pointer' }} onClick={() => setExpandedSlot(null)}>close ✕</div>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tutor Hours */}
      {view === 'hours' && (
        <div>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1.5px solid #e2d9c8', borderRadius: '8px', outline: 'none', color: 'var(--navy)' }} />
            <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.4 }}>🔍</span>
            {search && <span onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>}
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Total minutes each Volunteer Tutor has committed to matched sessions this term.</p>
          {loading ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading…</p>
            : filteredTutorStats.length === 0 ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{search ? `No tutors found for "${search}"` : 'No tutor data yet.'}</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredTutorStats.map((t, i) => (
                  <div key={t.id} style={{ background: 'white', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '20px', textAlign: 'center' }}>{i + 1}</span>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                      {t.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.email}</div>
                    </div>
                    <div style={{ flex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                        <div style={{ flex: 1, background: '#f0ece0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((t.mins / maxMins) * 100)}%`, height: '100%', borderRadius: '999px', background: '#155e3b' }} />
                        </div>
                        <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', minWidth: '52px', textAlign: 'right' }}>{t.mins} min</span>
                      </div>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.sessions} session{t.sessions !== 1 ? 's' : ''} · {(t.mins / 60).toFixed(1)} hrs</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Student Progress */}
      {view === 'grades' && (
        <div>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input type="text" placeholder="Search by name, email or course…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1.5px solid #e2d9c8', borderRadius: '8px', outline: 'none', color: 'var(--navy)' }} />
            <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.4 }}>🔍</span>
            {search && <span onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>}
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Grade progression per student per course — earliest to latest session.</p>
          {loading ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading…</p>
            : filteredGradeHistory.length === 0 ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{search ? `No students found for "${search}"` : 'No grade data yet.'}</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredGradeHistory.map((entry, i) => {
                  const change = gradeChange(entry)
                  const graded = entry.sessions.filter(s => s.grade !== null)
                  return (
                    <div key={i} className="card" style={{ padding: '1.25rem' }}>
                      <div className="flex-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>{entry.studentName}</div>
                          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.studentEmail}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy)' }}>{entry.course}</span>
                            <span className={`badge ${entry.subject === 'math' ? 'badge-math' : 'badge-science'}`} style={{ marginLeft: '0.5rem' }}>{entry.subject}</span>
                          </div>
                          {change !== null && (
                            <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.85rem', padding: '0.2rem 0.7rem', borderRadius: '999px', background: change > 0 ? '#f0fdf4' : change < 0 ? '#fef2f2' : '#f9f6ef', color: change > 0 ? '#15803d' : change < 0 ? '#b91c1c' : 'var(--text-muted)', border: `1px solid ${change > 0 ? '#86efac' : change < 0 ? '#fca5a5' : 'var(--border)'}` }}>
                              {change > 0 ? `↑ +${change} pts` : change < 0 ? `↓ ${change} pts` : '→ No change'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        {entry.sessions.map((s, si) => {
                          const dateLabel = new Date(s.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          const prev = entry.sessions.slice(0, si).filter(x => x.grade !== null)
                          const prevGrade = prev.length > 0 ? prev[prev.length - 1].grade as number : null
                          const improved = s.grade !== null && prevGrade !== null && s.grade > prevGrade
                          const declined = s.grade !== null && prevGrade !== null && s.grade < prevGrade
                          return (
                            <div key={si} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                              {si > 0 && s.grade !== null && <span style={{ fontSize: '0.8rem', color: '#d1d5db', alignSelf: 'center', marginBottom: '16px', paddingRight: '3px' }}>→</span>}
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: !s.grade ? '#f3f4f6' : improved ? '#f0fdf4' : declined ? '#fef2f2' : '#f9f6ef', border: `2px solid ${!s.grade ? '#e5e7eb' : improved ? '#86efac' : declined ? '#fca5a5' : 'var(--gold)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', color: !s.grade ? '#9ca3af' : improved ? '#15803d' : declined ? '#b91c1c' : 'var(--navy)' }}>
                                {s.grade !== null ? <><span style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1 }}>{s.grade}</span><span style={{ fontSize: '0.55rem', opacity: 0.7 }}>/100</span></> : <span style={{ fontSize: '0.6rem', textAlign: 'center', lineHeight: 1.2 }}>No grade</span>}
                              </div>
                              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>{dateLabel}</div>
                              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: s.status === 'completed' ? '#15803d' : s.status === 'matched' ? '#92400e' : '#9ca3af' }}>
                                {s.status === 'completed' ? '✓ done' : s.status === 'matched' ? '⏳ upcoming' : '○ pending'}
                              </div>
                            </div>
                          )
                        })}
                        {graded.length >= 2 && (
                          <div style={{ marginLeft: '6px', padding: '6px 10px', background: '#f9f6ef', borderRadius: '8px', fontFamily: 'system-ui, sans-serif', alignSelf: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Range</div>
                            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{Math.min(...graded.map(s => s.grade as number))} – {Math.max(...graded.map(s => s.grade as number))}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{graded.length} graded</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      )}

      {/* Tutors Available */}
      {view === 'available' && (
        <div>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input type="text" placeholder="Search by name, email or course…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1.5px solid #e2d9c8', borderRadius: '8px', outline: 'none', color: 'var(--navy)' }} />
            <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.4 }}>🔍</span>
            {search && <span onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>}
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Volunteer Tutors who have set availability but have not yet been matched with a student.</p>
          {loading ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading…</p>
            : filteredAvailability.length === 0 ? <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{search ? `No tutors found for "${search}"` : 'No unmatched tutors available right now.'}</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredAvailability.map((a, i) => (
                  <div key={i} style={{ background: 'white', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>
                      {a.tutor ? (a.tutor.first_name[0] + a.tutor.last_name[0]).toUpperCase() : '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{a.tutor ? `${a.tutor.first_name} ${a.tutor.last_name}` : 'Unknown'}</div>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.tutor?.email}</div>
                    </div>
                    <div style={{ flex: 2 }}>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '3px' }}>
                        {new Date(a.available_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {a.available_time} · {a.duration} min
                      </div>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {a.subject === 'math' ? '📐 Math' : '🔬 Science'} · {Array.isArray(a.courses) ? a.courses.join(', ') : a.courses}
                      </div>
                    </div>
                    <div style={{ background: '#eff9f5', border: '0.5px solid #bbf7d0', borderRadius: '999px', padding: '3px 10px', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#15803d', flexShrink: 0 }}>
                      Available
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Ad Majorem Dei Gloriam · Belen Jesuit Preparatory School · WP2PT
        </p>
      </div>
    </div>
  )
}
