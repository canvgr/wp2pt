import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendStudentConfirmation, sendTutorConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { studentId, course, subject, date, time, duration } = await req.json()
    const supabase = createServerClient()

    // 1. Find an available tutor who can teach this course on this date/time
    const { data: availableSlots } = await supabase
      .from('tutor_availability')
      .select('*, tutor:profiles!tutor_availability_tutor_id_fkey(id, first_name, last_name, email)')
      .eq('available_date', date)
      .eq('available_time', time)
      .eq('is_booked', false)
      .contains('courses', [course])

    if (!availableSlots || availableSlots.length === 0) {
      // No match found — leave session as pending
      return NextResponse.json({ matched: false, reason: 'No tutor available' })
    }

    // 2. Pick first available tutor (could add logic to prefer tutors with fewer sessions)
    const slot = availableSlots[0]
    const tutor = slot.tutor as { id: string; first_name: string; last_name: string; email: string }

    // 3. Get student info
    const { data: student } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single()

    if (!student) return NextResponse.json({ matched: false, reason: 'Student not found' })

    // 4. Update session with tutor + matched status
    await supabase
      .from('sessions')
      .update({ tutor_id: tutor.id, status: 'matched' })
      .eq('student_id', studentId)
      .eq('session_date', date)
      .eq('session_time', time)

    // 5. Mark availability slot as booked
    await supabase
      .from('tutor_availability')
      .update({ is_booked: true })
      .eq('id', slot.id)

    // 6. Send confirmation emails
    const dateFormatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    await sendStudentConfirmation({
      studentEmail: student.email,
      studentName: `${student.first_name} ${student.last_name}`,
      tutorName: `${tutor.first_name} ${tutor.last_name}`,
      course,
      date: dateFormatted,
      time,
      duration,
    })

    await sendTutorConfirmation({
      tutorEmail: tutor.email,
      tutorName: `${tutor.first_name} ${tutor.last_name}`,
      studentName: `${student.first_name} ${student.last_name}`,
      course,
      date: dateFormatted,
      time,
      duration,
    })

    return NextResponse.json({
      matched: true,
      tutor: { name: `${tutor.first_name} ${tutor.last_name}` },
    })
  } catch (err) {
    console.error('Matching error:', err)
    return NextResponse.json({ matched: false, reason: 'Server error' }, { status: 500 })
  }
}
