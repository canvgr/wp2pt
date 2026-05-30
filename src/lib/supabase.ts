import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type UserRole = 'student' | 'tutor' | 'proctor'

export type Profile = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
}

export type Session = {
  id: string
  student_id: string
  tutor_id: string | null
  subject: 'math' | 'science'
  course: string
  student_grade: number | null
  session_date: string
  session_time: string
  duration: 15 | 30
  status: 'pending' | 'matched' | 'completed' | 'cancelled'
  created_at: string
}

export type TutorAvailability = {
  id: string
  tutor_id: string
  subject: 'math' | 'science'
  courses: string[]
  available_date: string
  available_time: string
  duration: 15 | 30
  is_booked: boolean
}
