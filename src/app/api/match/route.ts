// src/app/api/match/route.ts
//
// FIX: Matching now runs in BOTH directions:
//   Direction A (triggered by student submitting a request):
//     → look for an already-available tutor who matches course/date/time
//   Direction B (triggered by tutor submitting availability):
//     → look for a pending student request that matches course/date/time
//
// Both directions send confirmation emails to both parties when a match is found.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendStudentConfirmation, sendTutorConfirmation } from '@/lib/email'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getSupabase()

    // ── DIRECTION A: Student just submitted → find an available tutor ──────────
    if (body.trigger === 'student') {
      const { sessionId, studentId, course, date, time, duration } = body

      if (!sessionId) {
        return NextResponse.json({ matched: false, reason: 'No sessionId provided' })
      }

      // Find an available tutor slot that matches course / date / time
      const { data: slots } = await supabase
        .from('tutor_availability')
        .select(`
          *,
          tutor:profiles!tutor_availability_tutor_id_fkey(
            id, first_name, last_name, email
          )
        `)
        .eq('available_date', date)
        .eq('available_time', time)
        .eq('is_booked', false)
        .contains('courses', [course])

      if (!slots || slots.length === 0) {
        return NextResponse.json({ matched: false, reason: 'No tutor available yet — session is pending' })
      }

      const slot = slots[0]
      const tutor = slot.tutor

      // Mark tutor slot as booked
      await supabase
        .from('tutor_availability')
        .update({ is_booked: true, booked_session_id: sessionId })
        .eq('id', slot.id)

      // Update session to matched — using correct column names
      await supabase
        .from('sessions')
        .update({
          status: 'matched',
          tutor_id: tutor.id,
          tutor_availability_id: slot.id,
        })
        .eq('id', sessionId)

      // Fetch student profile for email
      const { data: studentProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', studentId)
        .single()

      if (studentProfile) {
        await sendStudentConfirmation({
          studentEmail: studentProfile.email,
          studentName:  `${studentProfile.first_name} ${studentProfile.last_name}`,
          tutorName:    `${tutor.first_name} ${tutor.last_name}`,
          course,
          date,
          time,
          duration,
        })
      }

      await sendTutorConfirmation({
        tutorEmail:   tutor.email,
        tutorName:    `${tutor.first_name} ${tutor.last_name}`,
        studentName:  studentProfile
          ? `${studentProfile.first_name} ${studentProfile.last_name}`
          : 'A student',
        course,
        date,
        time,
        duration,
      })

      return NextResponse.json({ matched: true, tutorName: `${tutor.first_name} ${tutor.last_name}` })
    }

    // ── DIRECTION B: Tutor just submitted availability → find a pending student ─
    if (body.trigger === 'tutor') {
      const { availabilityId, tutorId, courses, date, time, duration } = body

      // FIX: use session_date and session_time (correct column names)
      const { data: pendingSessions } = await supabase
        .from('sessions')
        .select(`
          *,
          student:profiles!sessions_student_id_fkey(
            id, first_name, last_name, email
          )
        `)
        .eq('status', 'pending')
        .eq('session_date', date)
        .eq('session_time', time)
        .in('course', courses)

      if (!pendingSessions || pendingSessions.length === 0) {
        return NextResponse.json({ matched: false, reason: 'No pending student yet — availability is saved' })
      }

      const session = pendingSessions[0]
      const student = session.student

      // Mark tutor slot as booked
      await supabase
        .from('tutor_availability')
        .update({ is_booked: true, booked_session_id: session.id })
        .eq('id', availabilityId)

      // Update session to matched
      await supabase
        .from('sessions')
        .update({
          status: 'matched',
          tutor_id: tutorId,
          tutor_availability_id: availabilityId,
        })
        .eq('id', session.id)

      // Fetch tutor profile for email
      const { data: tutorProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', tutorId)
        .single()

      if (student && tutorProfile) {
        await sendStudentConfirmation({
          studentEmail: student.email,
          studentName:  `${student.first_name} ${student.last_name}`,
          tutorName:    `${tutorProfile.first_name} ${tutorProfile.last_name}`,
          course:       session.course,
          date,
          time,
          duration,
        })

        await sendTutorConfirmation({
          tutorEmail:   tutorProfile.email,
          tutorName:    `${tutorProfile.first_name} ${tutorProfile.last_name}`,
          studentName:  `${student.first_name} ${student.last_name}`,
          course:       session.course,
          date,
          time,
          duration,
        })
      }

      return NextResponse.json({
        matched: true,
        studentName: student ? `${student.first_name} ${student.last_name}` : 'A student',
      })
    }

    return NextResponse.json({ error: 'Invalid trigger' }, { status: 400 })

  } catch (err) {
    console.error('Match API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
