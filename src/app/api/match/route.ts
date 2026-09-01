import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendStudentConfirmation, sendTutorConfirmation, sendClassroomNotification } from '@/lib/email'

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

    async function getClassroom(): Promise<string> {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'classroom')
        .single()
      return data?.value || ''
    }

    if (body.trigger === 'set_classroom') {
      const { classroom } = body

      await supabase
        .from('settings')
        .upsert({ key: 'classroom', value: classroom })

      const today = new Date().toISOString().split('T')[0]

      const { data: matchedSessions } = await supabase
        .from('sessions')
        .select(`id, course, session_date, session_time,
          student:profiles!sessions_student_id_fkey(first_name, last_name, email),
          tutor:profiles!sessions_tutor_id_fkey(first_name, last_name, email)`)
        .in('status', ['matched', 'completed'])
        .gte('session_date', today)

      if (matchedSessions && classroom) {
        for (const s of matchedSessions) {
          if (s.student) {
            await sendClassroomNotification({
              email: s.student.email,
              name: `${s.student.first_name} ${s.student.last_name}`,
              role: 'student',
              course: s.course,
              date: s.session_date,
              time: s.session_time,
              classroom,
            })
          }
          if (s.tutor) {
            await sendClassroomNotification({
              email: s.tutor.email,
              name: `${s.tutor.first_name} ${s.tutor.last_name}`,
              role: 'tutor',
              course: s.course,
              date: s.session_date,
              time: s.session_time,
              classroom,
            })
          }
        }
      }

      return NextResponse.json({ success: true })
    }

    if (body.trigger === 'get_classroom') {
      const classroom = await getClassroom()
      return NextResponse.json({ classroom })
    }

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
      const classroom = await getClassroom()

      await supabase
        .from('tutor_availability')
        .update({ is_booked: true })
        .eq('id', slot.id)

      await supabase
        .from('sessions')
        .update({ status: 'matched', tutor_id: tutor.id })
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
          course, date, time, duration, classroom,
        })
      }

      await sendTutorConfirmation({
        tutorEmail: tutor.email,
        tutorName: `${tutor.first_name} ${tutor.last_name}`,
        studentName: studentProfile ? `${studentProfile.first_name} ${studentProfile.last_name}` : 'A student',
        course, date, time, duration, classroom,
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
      const classroom = await getClassroom()

      await supabase
        .from('tutor_availability')
        .update({ is_booked: true })
        .eq('id', availabilityId)

      await supabase
        .from('sessions')
        .update({ status: 'matched', tutor_id: tutorId })
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
          course: session.course, date, time, duration, classroom,
        })

        await sendTutorConfirmation({
          tutorEmail: tutorProfile.email,
          tutorName: `${tutorProfile.first_name} ${tutorProfile.last_name}`,
          studentName: `${student.first_name} ${student.last_name}`,
          course: session.course, date, time, duration, classroom,
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
