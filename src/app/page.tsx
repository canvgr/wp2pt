'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      {/* Import Barlow Condensed — Belen's headline font style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .belen-hero-bg {
          background: #f4f5f7;
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .belen-btn-primary {
          display: block;
          background: #0a1628;
          border: 2px solid #0a1628;
          color: #c9a84c;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.85rem 1.75rem;
          text-decoration: none;
          transition: all 0.15s;
          text-align: center;
        }
        .belen-btn-primary:hover {
          background: #c9a84c;
          border-color: #c9a84c;
          color: #0a1628;
        }

        .belen-btn-outline {
          display: block;
          background: transparent;
          border: 2px solid #c9a84c;
          color: #0a1628;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.85rem 1.75rem;
          text-decoration: none;
          transition: all 0.15s;
          text-align: center;
        }
        .belen-btn-outline:hover {
          background: #c9a84c;
          color: #0a1628;
        }

        .step-card {
          background: #0d1f3c;
          border-top: 3px solid #c9a84c;
          padding: 2rem 1.75rem;
        }

        @media (max-width: 640px) {
          .hero-title { font-size: 3.5rem !important; }
          .role-grid { flex-direction: column !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>

        {/* TOP NAVY BAR */}
        <div style={{ background: '#0a1628', height: '7px', width: '100%' }} />

        {/* HEADER */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e2ddd4',
          padding: '0 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Belen B Mark — SVG recreation of the signature navy/gold B */}
            <svg width="48" height="52" viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer gold shape */}
              <path d="M4 0 L44 0 Q48 0 48 4 L48 44 Q48 52 40 52 L8 52 Q0 52 0 44 L0 8 Q0 4 4 0 Z" fill="#c9a84c"/>
              {/* White border */}
              <path d="M6 3 L42 3 Q45 3 45 6 L45 43 Q45 49 39 49 L9 49 Q3 49 3 43 L3 9 Q3 6 6 3 Z" fill="white"/>
              {/* Navy inner shape */}
              <path d="M8 6 L40 6 Q43 6 43 9 L43 42 Q43 46 39 46 L9 46 Q5 46 5 42 L5 10 Q5 7 8 6 Z" fill="#0a1628"/>
              {/* The B letterform in old english style */}
              <text x="8" y="40" fontFamily="Georgia, serif" fontWeight="900" fontSize="36" fill="#c9a84c" letterSpacing="-2">B</text>
              {/* Gold inner highlight */}
              <path d="M8 6 L40 6 Q43 6 43 9 L43 12 L8 12 Z" fill="#c9a84c" opacity="0.15"/>
            </svg>

            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#0a1628', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.1 }}>Belen Jesuit</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '0.7rem', color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Preparatory School</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0a1628', letterSpacing: '0.12em', textTransform: 'uppercase' }}>WP2PT</div>
            <Link href="/student/login" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a1628', border: '1.5px solid #c9a84c', padding: '0.4rem 1rem' }}>
                Sign In
              </div>
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="belen-hero-bg">

          {/* Architectural SVG watermark */}
          <svg viewBox="0 0 1000 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055, pointerEvents: 'none' }} aria-hidden="true">
            {/* Main building */}
            <rect x="200" y="250" width="600" height="330" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            {/* Roofline */}
            <polyline points="160,250 500,120 840,250" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            {/* Cross at peak */}
            <line x1="500" y1="68" x2="500" y2="120" stroke="#0a1628" strokeWidth="3"/>
            <line x1="478" y1="88" x2="522" y2="88" stroke="#0a1628" strokeWidth="3"/>
            {/* Center arch */}
            <path d="M430 580 L430 390 Q500 320 570 390 L570 580" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            {/* Left arches */}
            <path d="M240 580 L240 420 Q270 380 300 420 L300 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M320 580 L320 420 Q350 380 380 420 L380 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            {/* Right arches */}
            <path d="M620 580 L620 420 Q650 380 680 420 L680 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M700 580 L700 420 Q730 380 760 420 L760 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            {/* Windows */}
            <rect x="230" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="320" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="620" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="710" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            {/* Palm trees left */}
            <line x1="100" y1="580" x2="110" y2="350" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="105" cy="330" rx="50" ry="28" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="85" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="125" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            {/* Palm trees right */}
            <line x1="900" y1="580" x2="890" y2="350" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="895" cy="330" rx="50" ry="28" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="875" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="915" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            {/* AMDG cross symbol center top */}
            <line x1="500" y1="150" x2="500" y2="200" stroke="#0a1628" strokeWidth="1.5"/>
            <line x1="480" y1="170" x2="520" y2="170" stroke="#0a1628" strokeWidth="1.5"/>
            <text x="472" y="148" fontFamily="Georgia" fontSize="14" fill="#0a1628" letterSpacing="3">AM</text>
            <text x="472" y="215" fontFamily="Georgia" fontSize="14" fill="#0a1628" letterSpacing="3">DG</text>
          </svg>

          {/* Gold left sidebar — exactly like belenjesuit.org */}
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: '#c9a84c', width: '38px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#0a1628', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Wolverines · WP2PT
            </span>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '820px', padding: '2rem 4rem' }}>

            {/* AMDG cross mark */}
            <div style={{ marginBottom: '1.75rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="38" height="42" viewBox="0 0 38 42" fill="none">
                <text x="1" y="14" fontFamily="Georgia, serif" fontSize="11" fill="#0a1628" letterSpacing="6">A M</text>
                <line x1="19" y1="0" x2="19" y2="42" stroke="#0a1628" strokeWidth="1.2"/>
                <line x1="0" y1="21" x2="38" y2="21" stroke="#0a1628" strokeWidth="1.2"/>
                <text x="1" y="36" fontFamily="Georgia, serif" fontSize="11" fill="#0a1628" letterSpacing="6">D G</text>
              </svg>
            </div>

            {/* Main headline — Barlow Condensed Extra Bold like Belen site */}
            <h1 className="hero-title" style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
              color: '#0a1628',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              Wolverines<br />
              <span style={{ color: '#c9a84c', WebkitTextStroke: '0px' }}>Peer-to-Peer</span><br />
              Tutoring
            </h1>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              A student-built platform connecting Belen Jesuit students with volunteer tutors — automatically matched, confirmed by email, and tracked by the Proctor.
            </p>

            {/* Role buttons — three gold-bordered boxes like Belen site */}
            <div className="role-grid" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '160px' }}>
                <Link href="/student/login" className="belen-btn-primary">I'm a Student</Link>
                <Link href="/student/register" className="belen-btn-outline" style={{ fontSize: '0.72rem', padding: '0.5rem 1rem' }}>Register</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '160px' }}>
                <Link href="/tutor/login" className="belen-btn-primary" style={{ background: '#155e3b', borderColor: '#155e3b' }}>Volunteer Tutor</Link>
                <Link href="/tutor/register" className="belen-btn-outline" style={{ fontSize: '0.72rem', padding: '0.5rem 1rem', borderColor: '#155e3b', color: '#155e3b' }}>Register</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '160px' }}>
                <Link href="/proctor/login" className="belen-btn-primary" style={{ background: '#7c2d12', borderColor: '#7c2d12' }}>Proctor Access</Link>
                <div style={{ height: '30px' }} />
              </div>
            </div>

            {/* Scroll line */}
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#9ca3af' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af' }}>Scroll to discover</span>
              <div style={{ width: '40px', height: '1px', background: '#9ca3af' }} />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — dark navy like Belen's dark sections */}
        <section style={{ background: '#0a1628', padding: '5rem 2.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ width: '40px', height: '2px', background: '#c9a84c', margin: '0 auto 1.25rem' }} />
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 0.95 }}>
                How It Works
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2px' }}>
              {[
                { num: '01', title: 'Student Requests', body: 'Register, pick your course, and choose an available time slot.' },
                { num: '02', title: 'Tutor Registers', body: 'List the courses you can teach and set your weekly availability.' },
                { num: '03', title: 'Automatic Match', body: 'The platform pairs you instantly and sends confirmation emails to both.' },
                { num: '04', title: 'Proctor Tracks', body: 'Real-time dashboard shows sessions, grade progress, and service hours.' },
              ].map(s => (
                <div key={s.num} className="step-card">
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.5rem', color: '#c9a84c', opacity: 0.35, lineHeight: 1, marginBottom: '0.75rem' }}>{s.num}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>{s.title}</div>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GOLD STATS BAR */}
        <section style={{ background: '#c9a84c', padding: '2.75rem 2.5rem' }}>
          <div className="stats-grid" style={{ maxWidth: '880px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {[
              { n: '20+', label: 'Math Courses' },
              { n: '17+', label: 'Science Courses' },
              { n: '30', label: 'Min Sessions' },
              { n: '100%', label: 'Free to Wolverines' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.5rem', color: '#0a1628', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', color: '#0a1628', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION QUOTE */}
        <section style={{ background: '#f4f5f7', padding: '5rem 2.5rem', textAlign: 'center', position: 'relative' }}>
          {/* Decorative crosses */}
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="0" x2="16" y2="32" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="16" x2="32" y2="16" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', opacity: 0.12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="0" x2="16" y2="32" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="16" x2="32" y2="16" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', opacity: 0.12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="0" x2="16" y2="32" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="16" x2="32" y2="16" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0.12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="0" x2="16" y2="32" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="16" x2="32" y2="16" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>

          <div style={{ maxWidth: '620px', margin: '0 auto' }}>
            <div style={{ width: '40px', height: '2px', background: '#c9a84c', margin: '0 auto 2rem' }} />
            {/* Large B watermark behind quote */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '14rem', color: '#0a1628', opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>B</div>
              <blockquote style={{ fontFamily: "Georgia, serif", fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#0a1628', lineHeight: 1.8, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                "Built by a Wolverine, for Wolverines — gifted permanently to Belen Jesuit so every class after mine benefits."
              </blockquote>
            </div>
            <div style={{ marginTop: '1.5rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
              Diego A. Núñez · Class of 2027
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0a1628', borderTop: '4px solid #c9a84c', padding: '2.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Footer B mark */}
              <svg width="32" height="35" viewBox="0 0 48 52" fill="none">
                <path d="M4 0 L44 0 Q48 0 48 4 L48 44 Q48 52 40 52 L8 52 Q0 52 0 44 L0 8 Q0 4 4 0 Z" fill="#c9a84c"/>
                <path d="M6 3 L42 3 Q45 3 45 6 L45 43 Q45 49 39 49 L9 49 Q3 49 3 43 L3 9 Q3 6 6 3 Z" fill="white"/>
                <path d="M8 6 L40 6 Q43 6 43 9 L43 42 Q43 46 39 46 L9 46 Q5 46 5 42 L5 10 Q5 7 8 6 Z" fill="#0a1628"/>
                <text x="8" y="40" fontFamily="Georgia, serif" fontWeight="900" fontSize="36" fill="#c9a84c" letterSpacing="-2">B</text>
              </svg>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.85rem', color: '#c9a84c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>WP2PT</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.7rem', color: '#475569' }}>Wolverines Peer-to-Peer Tutoring</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.25rem' }}>
                Ad Majorem Dei Gloriam
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.65rem', color: '#475569' }}>
                Belen Jesuit Preparatory School · Miami, Florida
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/student/login" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none' }}>Students</Link>
              <Link href="/tutor/login" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none' }}>Tutors</Link>
              <Link href="/proctor/login" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none' }}>Proctor</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
