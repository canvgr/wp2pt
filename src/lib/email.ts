import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'WP2PT Wolverines <noreply@wp2pt.com>'

export async function sendStudentConfirmation({
  studentEmail,
  studentName,
  tutorName,
  course,
  date,
  time,
  duration,
}: {
  studentEmail: string
  studentName: string
  tutorName: string
  course: string
  date: string
  time: string
  duration: number
}) {
  await resend.emails.send({
    from: FROM,
    to: studentEmail,
    subject: `✅ Tutoring Session Confirmed — ${course}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf8f3; padding: 2rem; border-radius: 12px;">
        <div style="background: #0a1628; padding: 1.5rem 2rem; border-radius: 8px; border-bottom: 3px solid #c9a84c; text-align: center; margin-bottom: 1.5rem;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 1.4rem; letter-spacing: 0.05em;">WP2PT</h1>
          <p style="color: #e0cc99; margin: 0.25rem 0 0; font-family: system-ui, sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Wolverines Peer-to-Peer Tutoring</p>
        </div>
        <h2 style="color: #0a1628;">Session Confirmed, ${studentName}!</h2>
        <p style="font-family: system-ui, sans-serif; color: #4a5568;">Your tutoring session has been matched. Here are your details:</p>
        <div style="background: white; border: 1px solid #e2d9c8; border-radius: 10px; padding: 1.5rem; margin: 1.5rem 0;">
          <table style="width: 100%; font-family: system-ui, sans-serif; border-collapse: collapse;">
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Course</td><td style="font-weight: 600; color: #0a1628;">${course}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Your Tutor</td><td style="font-weight: 600; color: #0a1628;">${tutorName}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Date</td><td style="font-weight: 600; color: #0a1628;">${date}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Time</td><td style="font-weight: 600; color: #0a1628;">${time}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Duration</td><td style="font-weight: 600; color: #0a1628;">${duration} minutes</td></tr>
          </table>
        </div>
        <p style="font-family: system-ui, sans-serif; color: #4a5568; font-size: 0.9rem;">Head to the tutoring classroom at the scheduled time. If you need to cancel, please reach out to your Proctor.</p>
        <p style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 2rem; letter-spacing: 0.1em; text-transform: uppercase;">Ad Majorem Dei Gloriam · Belen Jesuit Preparatory School</p>
      </div>
    `,
  })
}

export async function sendTutorConfirmation({
  tutorEmail,
  tutorName,
  studentName,
  course,
  date,
  time,
  duration,
}: {
  tutorEmail: string
  tutorName: string
  studentName: string
  course: string
  date: string
  time: string
  duration: number
}) {
  await resend.emails.send({
    from: FROM,
    to: tutorEmail,
    subject: `📚 Tutoring Request Matched — ${course}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf8f3; padding: 2rem; border-radius: 12px;">
        <div style="background: #0a1628; padding: 1.5rem 2rem; border-radius: 8px; border-bottom: 3px solid #c9a84c; text-align: center; margin-bottom: 1.5rem;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 1.4rem; letter-spacing: 0.05em;">WP2PT</h1>
          <p style="color: #e0cc99; margin: 0.25rem 0 0; font-family: system-ui, sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Wolverines Peer-to-Peer Tutoring</p>
        </div>
        <h2 style="color: #0a1628;">You've Been Matched, ${tutorName}!</h2>
        <p style="font-family: system-ui, sans-serif; color: #4a5568;">A fellow Wolverine needs your help. Here are the session details:</p>
        <div style="background: white; border: 1px solid #e2d9c8; border-radius: 10px; padding: 1.5rem; margin: 1.5rem 0;">
          <table style="width: 100%; font-family: system-ui, sans-serif; border-collapse: collapse;">
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Course</td><td style="font-weight: 600; color: #0a1628;">${course}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Student</td><td style="font-weight: 600; color: #0a1628;">${studentName}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Date</td><td style="font-weight: 600; color: #0a1628;">${date}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Time</td><td style="font-weight: 600; color: #0a1628;">${time}</td></tr>
            <tr><td style="color: #4a5568; font-size: 0.85rem; padding: 0.5rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Duration</td><td style="font-weight: 600; color: #0a1628;">${duration} minutes</td></tr>
          </table>
        </div>
        <p style="font-family: system-ui, sans-serif; color: #4a5568; font-size: 0.9rem;">Thank you for volunteering your time to help a fellow Wolverine succeed. See you in the tutoring room!</p>
        <p style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 2rem; letter-spacing: 0.1em; text-transform: uppercase;">Ad Majorem Dei Gloriam · Belen Jesuit Preparatory School</p>
      </div>
    `,
  })
}
