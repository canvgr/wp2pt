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
  classroom: string | null
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

export default function ProctorDashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('calendar')
  const [weekOffset, setWeekOffset] = useState(0)
  const [availability, setAvailability] = useState<TutorAvailabilityRow[]>([])
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null)
  const [classroomInputs, setClassroomInputs] = useState<Record<string, string>>({})
  const [savingClassroom, setSavingClassroom] = useState<string | null>(null)

  const days = getWeekDays(weekOffset)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sessions')
      .select(`id, session_date, session_time, duration, course, subject, status, student_grade, classroom,
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
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/proctor/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'proctor') { router.push('/proctor/login'); return }
      loadSessions()
    })
  }, [router, loadSessions])

  async function saveClassroom(sessionId: string) {
    const classroom = classroomInputs[sessionId]?.trim()
    if (!classroom) return
    setSavingClassroom(sessionId)
    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'classroom', sessionId, classroom }),
    })
    setSavingClassroom(null)
    setClassroomInputs(prev => { const n = { ...prev }; delete n[sessionId]; return n })
    loadSessions()
  }

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

  const
