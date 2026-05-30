import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'WP2PT — Wolverines Peer-to-Peer Tutoring',
  description: 'A dedicated tutoring platform for Belen Jesuit students, built by a Wolverine, for Wolverines.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <a href="/" className="nav-brand">
            <div>
              <div className="nav-logo">WP2PT</div>
              <div className="nav-sub">Wolverines Peer-to-Peer Tutoring</div>
            </div>
          </a>
          <div className="nav-links">
            <a href="/student/login" className="nav-link">Student</a>
            <a href="/tutor/login" className="nav-link">Volunteer Tutor</a>
            <a href="/proctor/login" className="nav-link">Proctor</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
