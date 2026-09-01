'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Georgia, serif', overflowX: 'hidden' }}>

      {/* TOP BAR */}
      <div style={{ background: '#0a1628', height: '6px', width: '100%' }} />

      {/* HEADER */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e4d9', padding: '0 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Belen B mark placeholder */}
          <div style={{ width: '52px', height: '52px', background: '#0a1628', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #c9a84c' }}>
            <span style={{ color: '#c9a84c', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>B</span>
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: '0.8rem', color: '#0a1628', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>Belen Jesuit</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 400, fontSize: '0.7rem', color: '#0a1628', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4 }}>Preparatory School</div>
          </div>
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#0a1628', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          WP2PT
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f7f6f2' }}>

        {/* Architectural watermark — Belen building outline */}
        <svg viewBox="0 0 800 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} aria-hidden="true">
          {/* Main building facade */}
          <rect x="150" y="200" width="500" height="280" fill="none" stroke="#0a1628" strokeWidth="2"/>
          {/* Central arch */}
          <path d="M350 480 L350 320 Q400 270 450 320 L450 480" fill="none" stroke="#0a1628" strokeWidth="2"/>
          {/* Left arch */}
          <path d="M200 480 L200 350 Q230 310 260 350 L260 480" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
          {/* Right arch */}
          <path d="M540 480 L540 350 Q570 310 600 350 L600 480" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
          {/* Roofline */}
          <polyline points="130,200 400,100 670,200" fill="none" stroke="#0a1628" strokeWidth="2"/>
          {/* Cross at top */}
          <line x1="400" y1="60" x2="400" y2="100" stroke="#0a1628" strokeWidth="2"/>
          <line x1="385" y1="75" x2="415" y2="75" stroke="#0a1628" strokeWidth="2"/>
          {/* Windows left */}
          <rect x="185" y="230" width="40" height="50" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
          <rect x="250" y="230" width="40" height="50" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
          {/* Windows right */}
          <rect x="510" y="230" width="40" height="50" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
          <rect x="575" y="230" width="40" height="50" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
          {/* Columns */}
          <line x1="320" y1="200" x2="320" y2="480" stroke="#0a1628" strokeWidth="1"/>
          <line x1="360" y1="200" x2="360" y2="320" stroke="#0a1628" strokeWidth="1"/>
          <line x1="440" y1="200" x2="440" y2="320" stroke="#0a1628" strokeWidth="1"/>
          <line x1="480" y1="200" x2="480" y2="480" stroke="#0a1628" strokeWidth="1"/>
          {/* Palm trees left */}
          <line x1="100" y1="480" x2="100" y2="300" stroke="#0a1628" strokeWidth="1.5"/>
          <ellipse cx="100" cy="285" rx="35" ry="20" fill="none" stroke="#0a1628" strokeWidth="1"/>
          <ellipse cx="100" cy="270" rx="25" ry="15" fill="none" stroke="#0a1628" strokeWidth="1"/>
          {/* Palm trees right */}
          <line x1="700" y1="480" x2="700" y2="300" stroke="#0a1628" strokeWidth="1.5"/>
          <ellipse cx="700" cy="285" rx="35" ry="20" fill="none" stroke="#0a1628" strokeWidth="1"/>
          <ellipse cx="700" cy="270" rx="25" ry="15" fill="none" stroke="#0a1628" strokeWidth="1"/>
          {/* AMDG cross symbol */}
          <text x="370" y="160" fontFamily="Georgia" fontSize="12" fill="#0a1628" letterSpacing="4">A M</text>
          <text x="370" y="178" fontFamily="Georgia" fontSize="12" fill="#0a1628" letterSpacing="4">D G</text>
          <line x1="395" y1="148" x2="395" y2="185" stroke="#0a1628" strokeWidth="1"/>
          <line x1="370" y1="166" x2="420" y2="166" stroke="#0a1628" strokeWidth="1"/>
        </svg>

        {/* Gold left sidebar tab */}
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: '#c9a84c', width: '36px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a1628', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Wolverines · WP2PT
          </span>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px', padding: '0 3rem' }}>
          {/* AMDG mark */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', lineHeight: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '32px', borderTop: '1.5px solid #0a1628', borderLeft: '1.5px solid #0a1628' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.55rem', color: '#0a1628', padding: '1px 3px', borderRight: '1.5px solid #0a1628', borderBottom: '1.5px solid #0a1628' }}>A</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.55rem', color: '#0a1628', padding: '1px 3px', borderBottom: '1.5px solid #0a1628' }}>M</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.55rem', color: '#0a1628', padding: '1px 3px', borderRight: '1.5px solid #0a1628', borderBottom: '1.5px solid #0a1628' }}>D</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.55rem', color: '#0a1628', padding: '1px 3px', borderBottom: '1.5px solid #0a1628' }}>G</span>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            color: '#0a1628',
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Wolverines<br />
            <span style={{ color: '#c9a84c' }}>Peer-to-Peer</span><br />
            Tutoring
          </h1>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.05rem',
            color: '#4a5568',
            lineHeight: 1.75,
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}>
            A student-built platform connecting Belen Jesuit students with volunteer tutors — automatically matched, confirmed by email, and tracked by your Proctor.
          </p>

          {/* Role cards */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { role: 'Student', desc: 'Request tutoring', href: '/student/login', primary: true },
              { role: 'Volunteer Tutor', desc: 'Set your availability', href: '/tutor/login', primary: false },
              { role: 'Proctor', desc: 'Access dashboard', href: '/proctor/login', primary: false },
            ].map(item => (
              <Link key={item.role} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: `2px solid ${item.primary ? '#0a1628' : '#c9a84c'}`,
                  background: item.primary ? '#0a1628' : 'transparent',
                  padding: '1rem 1.75rem',
                  minWidth: '160px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: item.primary ? '#c9a84c' : '#0a1628',
                    marginBottom: '0.25rem',
                  }}>{item.role}</div>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.8rem',
                    color: item.primary ? '#e0cc99' : '#4a5568',
                  }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop: '3rem', fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '1px', background: '#9ca3af' }} />
            Scroll to discover
            <div style={{ width: '32px', height: '1px', background: '#9ca3af' }} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#0a1628', padding: '5rem 2.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ width: '40px', height: '2px', background: '#c9a84c', margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 0.95 }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
            {[
              { step: '01', title: 'Student Requests', body: 'A student registers, selects their course, and picks an available time slot.' },
              { step: '02', title: 'Tutor Registers', body: 'A Volunteer Tutor lists their courses and sets availability on the calendar.' },
              { step: '03', title: 'Automatic Match', body: 'The platform pairs them instantly and sends confirmation emails to both.' },
              { step: '04', title: 'Proctor Tracks', body: 'The Proctor monitors sessions, grade progress, and tutor service hours in real time.' },
            ].map(item => (
              <div key={item.step} style={{ background: '#0d1f3c', padding: '2rem 1.75rem', borderTop: '2px solid #c9a84c' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#c9a84c', lineHeight: 1, marginBottom: '0.75rem', opacity: 0.4 }}>{item.step}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{item.title}</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#c9a84c', padding: '2.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { number: '20+', label: 'Math Courses' },
            { number: '17+', label: 'Science Courses' },
            { number: '30', label: 'Min Sessions' },
            { number: '100%', label: 'Free to Students' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: '2.2rem', color: '#0a1628', lineHeight: 1 }}>{s.number}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.65rem', color: '#0a1628', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section style={{ background: '#f7f6f2', padding: '5rem 2.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ width: '40px', height: '2px', background: '#c9a84c', margin: '0 auto 1.5rem' }} />
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#0a1628', lineHeight: 1.75, fontStyle: 'italic', margin: '0 0 1.5rem' }}>
            "Built by a Wolverine, for Wolverines — gifted permanently to Belen Jesuit so every class after ours benefits."
          </blockquote>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Diego A. Núñez — Class of 2027
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1628', borderTop: '3px solid #c9a84c', padding: '2rem 2.5rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.5rem' }}>
          Ad Majorem Dei Gloriam
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: '#475569', letterSpacing: '0.05em' }}>
          Belen Jesuit Preparatory School · Miami, Florida · wp2pt.com
        </div>
      </footer>

    </div>
  )
}
