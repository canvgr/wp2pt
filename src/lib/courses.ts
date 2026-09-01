export const MATH_COURSES = [
  'Advanced Algebra 1',
  'Advanced Algebra 2 & Trigonometry',
  'Advanced Geometry',
  'Advanced Pre-Algebra',
  'Algebra 1',
  'Algebra 2 & Trigonometry',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Statistics',
  'Calculus',
  'Geometry',
  'Honors Algebra 2 & Trigonometry',
  'Honors Calculus',
  'Honors Precalculus (Dual Enrollment)',
  'Math 6',
  'Pre-Algebra 6',
  'Pre-Algebra 7',
  'Pre-Algebra',
  'Precalculus',
  'Statistics',
]
export const SCIENCE_COURSES = [
  'Advanced Biology',
  'Advanced Physical Science',
  'AP Biology',
  'AP Chemistry',
  'AP Environmental Science',
  'AP Physics C: Mechanics',
  'AP Physics I',
  'Astronomy',
  'Biology',
  'Chemistry',
  'Earth & Space Science',
  'Honors Chemistry',
  'Honors Environmental Science',
  'Honors Physics (Dual Enrollment)',
  'Life Science',
  'Physical Science',
  'Physics',
]
export const TIME_SLOTS = [
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
]
export const DURATION = 30
export function getWeekDays(weekOffset = 0) {
  const today = new Date()
  const monday = new Date(today)
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(today.getDate() + diff + weekOffset * 7)
  const days = []
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}
export function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
}
export function formatDateISO(d: Date) {
  return d.toISOString().split('T')[0]
}
