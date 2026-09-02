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
        {children}
      </body>
    </html>
  )
}
