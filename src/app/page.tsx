'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        .belen-btn-primary:hover { background: #c9a84c; border-color: #c9a84c; color: #0a1628; }
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
        .belen-btn-outline:hover { background: #c9a84c; color: #0a1628; }
        .step-card { background: #0d1f3c; border-top: 3px solid #c9a84c; padding: 2rem 1.75rem; }
        @media (max-width: 640px) {
          .hero-title { font-size: 3.2rem !important; }
          .role-grid { flex-direction: column !important; align-items: center; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-inner { flex-direction: column !important; text-align: center; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>

        {/* TOP NAVY BAR */}
        <div style={{ background: '#0a1628', height: '7px', width: '100%' }} />

        {/* HEADER */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #e2ddd4',
          padding: '0 2.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '76px',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Real Belen B logo */}
            <Image src="/clipart765116.png" alt="Belen Jesuit B" width={48} height={52} style={{ objectFit: 'contain' }} />
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

        {/* HERO */}
        <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f4f5f7' }}>

          {/* Architectural watermark */}
          <svg viewBox="0 0 1000 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055, pointerEvents: 'none' }} aria-hidden="true">
            <rect x="200" y="250" width="600" height="330" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            <polyline points="160,250 500,120 840,250" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            <line x1="500" y1="68" x2="500" y2="120" stroke="#0a1628" strokeWidth="3"/>
            <line x1="478" y1="88" x2="522" y2="88" stroke="#0a1628" strokeWidth="3"/>
            <path d="M430 580 L430 390 Q500 320 570 390 L570 580" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            <path d="M240 580 L240 420 Q270 380 300 420 L300 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M320 580 L320 420 Q350 380 380 420 L380 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M620 580 L620 420 Q650 380 680 420 L680 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M700 580 L700 420 Q730 380 760 420 L760 580" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <rect x="230" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="320" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="620" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="710" y="270" width="60" height="70" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <line x1="100" y1="580" x2="110" y2="350" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="105" cy="330" rx="50" ry="28" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="85" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="125" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <line x1="900" y1="580" x2="890" y2="350" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="895" cy="330" rx="50" ry="28" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="875" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="915" cy="315" rx="40" ry="20" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
          </svg>

          {/* Gold left sidebar */}
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: '#c9a84c', width: '38px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#0a1628', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Wolverines · WP2PT
            </span>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '820px', padding: '2rem 4rem' }}>

            {/* AMDG cross mark */}
            <div style={{ marginBottom: '1.75rem', display: 'inline-flex', justifyContent: 'center' }}>
              <svg width="42" height="44" viewBox="0 0 42 44" fill="none">
                <text x="0" y="14" fontFamily="Georgia, serif" fontSize="11" fill="#0a1628" letterSpacing="5">A M</text>
                <line x1="21" y1="0" x2="21" y2="44" stroke="#0a1628" strokeWidth="1.2"/>
                <line x1="0" y1="22" x2="42" y2="22" stroke="#0a1628" strokeWidth="1.2"/>
                <text x="0" y="40" fontFamily="Georgia, serif" fontSize="11" fill="#0a1628" letterSpacing="5">D G</text>
              </svg>
            </div>

            {/* Real Belen B — large, centered above title */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Image src="/clipart765116.png" alt="Belen Jesuit" width={100} height={110} style={{ objectFit: 'contain' }} />
            </div>

            <h1 className="hero-title" style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3.2rem, 9vw, 6rem)',
              color: '#0a1628',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              Wolverines<br />
              <span style={{ color: '#c9a84c' }}>Peer-to-Peer</span><br />
              Tutoring
            </h1>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              A student-built platform connecting Belen Jesuit students with volunteer tutors — automatically matched, confirmed by email, and tracked by the Proctor.
            </p>

            {/* Role buttons */}
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
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#9ca3af' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af' }}>Scroll to discover</span>
              <div style={{ width: '40px', height: '1px', background: '#9ca3af' }} />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
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
        <section style={{ background: '#f4f5f7', padding: '5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Corner crosses */}
          {['top:2rem;left:2rem', 'top:2rem;right:2rem', 'bottom:2rem;left:2rem', 'bottom:2rem;right:2rem'].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', ...Object.fromEntries(pos.split(';').map(p => p.split(':'))), opacity: 0.12 }}>
              <svg width="30" height="30" viewBox="0 0 30 30"><line x1="15" y1="0" x2="15" y2="30" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="15" x2="30" y2="15" stroke="#0a1628" strokeWidth="2"/></svg>
            </div>
          ))}
          {/* Large B watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }}>
            <Image src="/clipart765116.png" alt="" width={400} height={440} style={{ objectFit: 'contain' }} aria-hidden="true" />
          </div>
          <div style={{ maxWidth: '620px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '40px', height: '2px', background: '#c9a84c', margin: '0 auto 2rem' }} />
            <blockquote style={{ fontFamily: "Georgia, serif", fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#0a1628', lineHeight: 1.8, fontStyle: 'italic' }}>
              "Built by a Wolverine, for Wolverines — gifted permanently to Belen Jesuit so every class after mine benefits."
            </blockquote>
            <div style={{ marginTop: '1.5rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
              Diego A. Núñez · Class of 2027
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0a1628', borderTop: '4px solid #c9a84c', padding: '2.5rem' }}>
          <div className="footer-inner" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Image src="/clipart765116.png" alt="Belen B" width={36} height={40} style={{ objectFit: 'contain' }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#c9a84c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>WP2PT</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.7rem', color: '#475569' }}>Wolverines Peer-to-Peer Tutoring</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.25rem' }}>Ad Majorem Dei Gloriam</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.65rem', color: '#475569' }}>Belen Jesuit Preparatory School · Miami, Florida</div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[['Students', '/student/login'], ['Tutors', '/tutor/login'], ['Proctor', '/proctor/login']].map(([label, href]) => (
                <Link key={label} href={href} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
