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

    if (body.trigger === 'student') {
      const { sessionId, studentId, course, date, time, duration } = body

      if (!sessionId) {
        return NextResponse.json({ matched: false, reason: 'No sessionId provided' })
      }

      const { data: slots } = await supabase
        .from('tutor_availability')
        .select('*, tutor:profiles!tutor_availability_tutor_id_fkey(id, first_name, last_name, email)')
        .eq('available_date', date)
        .eq('available_time', time)
        .eq('is_booked', false)
        .contains('courses', [course])

      if (!slots || slots.length === 0) {
        return NextResponse.json({ matched: false, reason: 'No tutor available yet' })
      }

      const slot = slots[0]
      const tutor = slot.tutor

      await supabase
        .from('tutor_availability')
        .update({ is_booked: true, booked_session_id: sessionId })
        .eq('id', slot.id)

      await supabase
        .from('sessions')
        .update({ status: 'matched', tutor_id: tutor.id, tutor_availability_id: slot.id })
        .eq('id', sessionId)

      const { data: studentProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', studentId)
        .single()

      if (studentProfile) {
        await sendStudentConfirmation({
          studentEmail: studentProfile.email,
          studentName: `${studentProfile.first_name} ${studentProfile.last_name}`,
          tutorName: `${tutor.first_name} ${tutor.last_name}`,
          course, date, time, duration,
        })
      }

      await sendTutorConfirmation({
        tutorEmail: tutor.email,
        tutorName: `${tutor.first_name} ${tutor.last_name}`,
        studentName: studentProfile ? `${studentProfile.first_name} ${studentProfile.last_name}` : 'A student',
        course, date, time, duration,
      })

      return NextResponse.json({ matched: true, tutorName: `${tutor.first_name} ${tutor.last_name}` })
    }

    if (body.trigger === 'tutor') {
      const { availabilityId, tutorId, courses, date, time, duration } = body

      const { data: pendingSessions } = await supabase
        .from('sessions')
        .select('*, student:profiles!sessions_student_id_fkey(id, first_name, last_name, email)')
        .eq('status', 'pending')
        .eq('session_date', date)
        .eq('session_time', time)
        .in('course', courses)

      if (!pendingSessions || pendingSessions.length === 0) {
        return NextResponse.json({ matched: false, reason: 'No pending student yet' })
      }

      const session = pendingSessions[0]
      const student = session.student

      await supabase
        .from('tutor_availability')
        .update({ is_booked: true, booked_session_id: session.id })
        .eq('id', availabilityId)

      await supabase
        .from('sessions')
        .update({ status: 'matched', tutor_id: tutorId, tutor_availability_id: availabilityId })
        .eq('id', session.id)

      const { data: tutorProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', tutorId)
        .single()

      if (student && tutorProfile) {
        await sendStudentConfirmation({
          studentEmail: student.email,
          studentName: `${student.first_name} ${student.last_name}`,
          tutorName: `${tutorProfile.first_name} ${tutorProfile.last_name}`,
          course: session.course, date, time, duration,
        })

        await sendTutorConfirmation({
          tutorEmail: tutorProfile.email,
          tutorName: `${tutorProfile.first_name} ${tutorProfile.last_name}`,
          studentName: `${student.first_name} ${student.last_name}`,
          course: session.course, date, time, duration,
        })
      }

      return NextResponse.json({ matched: true, studentName: student ? `${student.first_name} ${student.last_name}` : 'A student' })
    }

    return NextResponse.json({ error: 'Invalid trigger' }, { status: 400 })

  } catch (err) {
    console.error('Match API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
