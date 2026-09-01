'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Barlow', sans-serif; }

        .wp2pt-wrap { min-height: 100vh; background: #fff; overflow-x: hidden; }

        /* ── TOP NAV BAR ── */
        .top-bar {
          background: #0a1628;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 3rem;
        }
        .top-bar-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.05rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a84c;
        }
        .top-bar-brand span {
          font-weight: 400;
          font-size: 0.7rem;
          color: #94a3b8;
          display: block;
          letter-spacing: 0.1em;
          margin-top: 1px;
        }
        .top-bar-nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .top-bar-nav a {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e2e8f0;
          text-decoration: none;
          transition: color 0.15s;
        }
        .top-bar-nav a:hover { color: #c9a84c; }

        /* ── HEADER ── */
        .main-header {
          background: #fff;
          border-bottom: 1px solid #e2ddd4;
          padding: 0 3rem;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-school-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: #0a1628;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .header-school-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.65rem;
          color: #6b7280;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .header-platform {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #0a1628;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .header-signin {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a1628;
          border: 1.5px solid #c9a84c;
          padding: 0.45rem 1.1rem;
          text-decoration: none;
          transition: all 0.15s;
        }
        .header-signin:hover { background: #c9a84c; }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #f3f4f6;
          overflow: hidden;
          padding: 4rem 2rem;
        }

        /* Building watermark */
        .hero-watermark {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          pointer-events: none;
        }

        /* B mark watermark behind content */
        .hero-b-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.04;
          pointer-events: none;
          user-select: none;
          width: 500px;
          height: 550px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          max-width: 700px;
          width: 100%;
        }

        /* Gold divider line */
        .gold-rule {
          width: 60px;
          height: 2px;
          background: #c9a84c;
          margin: 0 auto;
        }

        .hero-amdg {
          font-family: Georgia, serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: #6b7280;
          text-transform: uppercase;
          margin: 1.25rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hero-amdg::before, .hero-amdg::after {
          content: '+';
          color: #c9a84c;
          font-size: 1rem;
        }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(3.8rem, 10vw, 6.5rem);
          color: #0a1628;
          line-height: 0.88;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin: 1.5rem 0 0.5rem;
        }
        .hero-title-gold {
          color: #c9a84c;
          display: block;
        }

        .hero-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.75;
          max-width: 460px;
          margin: 1.5rem auto 2.5rem;
        }

        /* Three role buttons — symmetric grid */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          width: 100%;
          max-width: 600px;
          border: 2px solid #0a1628;
        }
        .role-cell {
          display: flex;
          flex-direction: column;
          border-right: 2px solid #0a1628;
        }
        .role-cell:last-child { border-right: none; }
        .role-btn-main {
          background: #0a1628;
          color: #c9a84c;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 1rem 0.5rem;
          text-decoration: none;
          text-align: center;
          border-bottom: 1px solid #1e3a5f;
          transition: all 0.15s;
          display: block;
        }
        .role-btn-main:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-main.green { background: #155e3b; color: #fff; }
        .role-btn-main.green:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-main.red { background: #7c2d12; color: #fff; border-bottom: none; }
        .role-btn-main.red:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-register {
          background: transparent;
          color: #0a1628;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.6rem 0.5rem;
          text-decoration: none;
          text-align: center;
          display: block;
          transition: all 0.15s;
        }
        .role-btn-register:hover { background: #f3f4f6; }
        .role-btn-spacer { padding: 0.6rem; }

        .scroll-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2.5rem;
        }
        .scroll-hint-line { width: 40px; height: 1px; background: #9ca3af; }
        .scroll-hint-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        /* ── HOW IT WORKS ── */
        .how-section {
          background: #0a1628;
          padding: 5rem 3rem;
          text-align: center;
        }
        .section-eyebrow {
          width: 40px;
          height: 2px;
          background: #c9a84c;
          margin: 0 auto 1.5rem;
        }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          line-height: 0.92;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 3.5rem;
          border: 1px solid #1e3a5f;
        }
        .step-card {
          border-right: 1px solid #1e3a5f;
          border-top: 3px solid #c9a84c;
          padding: 2rem 1.5rem;
          text-align: left;
        }
        .step-card:last-child { border-right: none; }
        .step-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 3rem;
          color: #c9a84c;
          opacity: 0.25;
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .step-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.6rem;
        }
        .step-body {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.7;
        }

        /* ── STATS ── */
        .stats-bar {
          background: #c9a84c;
          padding: 2.75rem 3rem;
        }
        .stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          text-align: center;
        }
        .stat-item {
          padding: 0 1rem;
          border-right: 1px solid rgba(10,22,40,0.2);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2.8rem;
          color: #0a1628;
          line-height: 1;
        }
        .stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          color: #0a1628;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-top: 0.3rem;
          opacity: 0.75;
        }

        /* ── QUOTE ── */
        .quote-section {
          background: #f3f4f6;
          padding: 6rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .quote-cross {
          position: absolute;
          opacity: 0.1;
        }
        .quote-b-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.035;
          pointer-events: none;
        }
        .quote-inner {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }
        .quote-text {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #0a1628;
          line-height: 1.85;
        }
        .quote-attr {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: 1.5rem;
        }

        /* ── FOOTER ── */
        .footer {
          background: #0a1628;
          border-top: 4px solid #c9a84c;
          padding: 2.5rem 3rem;
        }
        .footer-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          color: #c9a84c;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .footer-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.65rem;
          color: #475569;
        }
        .footer-center {
          text-align: center;
        }
        .footer-amdg {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.3rem;
        }
        .footer-school {
          font-family: 'Barlow', sans-serif;
          font-size: 0.62rem;
          color: #475569;
        }
        .footer-right {
          display: flex;
          gap: 1.5rem;
          justify-content: flex-end;
        }
        .footer-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #c9a84c; }

        @media (max-width: 768px) {
          .top-bar { padding: 0 1.5rem; }
          .main-header { padding: 0 1.5rem; }
          .hero { padding: 3rem 1.5rem; }
          .role-grid { grid-template-columns: 1fr; border: none; gap: 0.5rem; }
          .role-cell { border-right: none; border: 2px solid #0a1628; }
          .steps-grid { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .stat-item { border-right: none; }
          .footer-inner { grid-template-columns: 1fr; text-align: center; }
          .footer-left { justify-content: center; }
          .footer-right { justify-content: center; }
        }
      `}</style>

      <div className="wp2pt-wrap">

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="top-bar-brand">
            WP2PT
            <span>Wolverines Peer-to-Peer Tutoring</span>
          </div>
          <nav className="top-bar-nav">
            <Link href="/student/login">Student</Link>
            <Link href="/tutor/login">Volunteer Tutor</Link>
            <Link href="/proctor/login">Proctor</Link>
          </nav>
        </div>

        {/* HEADER — seal + school name left, platform name + sign in right */}
        <header className="main-header">
          <div className="header-left">
            <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit Seal" width={56} height={56} style={{ objectFit: 'contain' }} />
            <div>
              <div className="header-school-name">Belen Jesuit</div>
              <div className="header-school-sub">Preparatory School</div>
            </div>
          </div>
          <div className="header-right">
            <span className="header-platform">WP2PT</span>
            <Link href="/student/login" className="header-signin">Sign In</Link>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">

          {/* Architectural building watermark */}
          <svg className="hero-watermark" viewBox="0 0 1000 580" aria-hidden="true">
            <rect x="200" y="240" width="600" height="320" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <polyline points="160,240 500,110 840,240" fill="none" stroke="#0a1628" strokeWidth="2.5"/>
            <line x1="500" y1="58" x2="500" y2="110" stroke="#0a1628" strokeWidth="3"/>
            <line x1="476" y1="80" x2="524" y2="80" stroke="#0a1628" strokeWidth="3"/>
            <path d="M425 560 L425 375 Q500 300 575 375 L575 560" fill="none" stroke="#0a1628" strokeWidth="2"/>
            <path d="M230 560 L230 410 Q258 372 286 410 L286 560" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <path d="M314 560 L314 410 Q342 372 370 410 L370 560" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <path d="M630 560 L630 410 Q658 372 686 410 L686 560" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <path d="M714 560 L714 410 Q742 372 770 410 L770 560" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="222" y="258" width="55" height="65" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="308" y="258" width="55" height="65" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="637" y="258" width="55" height="65" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <rect x="723" y="258" width="55" height="65" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <line x1="95" y1="560" x2="105" y2="340" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="100" cy="318" rx="48" ry="26" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="78" cy="302" rx="36" ry="18" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
            <ellipse cx="122" cy="302" rx="36" ry="18" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
            <line x1="905" y1="560" x2="895" y2="340" stroke="#0a1628" strokeWidth="2"/>
            <ellipse cx="900" cy="318" rx="48" ry="26" fill="none" stroke="#0a1628" strokeWidth="1.5"/>
            <ellipse cx="878" cy="302" rx="36" ry="18" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
            <ellipse cx="922" cy="302" rx="36" ry="18" fill="none" stroke="#0a1628" strokeWidth="1.2"/>
          </svg>

          {/* B mark behind everything */}
          <div className="hero-b-watermark" aria-hidden="true">
            <Image src="/clipart765116.png" alt="" fill style={{ objectFit: 'contain' }} />
          </div>

          <div className="hero-content">
            {/* Seal centered at top of hero */}
            <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit" width={110} height={110} style={{ objectFit: 'contain', marginBottom: '1rem' }} />

            <div className="gold-rule" />

            <div className="hero-amdg">Ad Majorem Dei Gloriam</div>

            <h1 className="hero-title">
              Wolverines<br />
              <span className="hero-title-gold">Peer-to-Peer</span><br />
              Tutoring
            </h1>

            <p className="hero-sub">
              A student-built platform connecting Belen Jesuit students with volunteer tutors — automatically matched, confirmed by email, and tracked by the Proctor.
            </p>

            {/* Perfectly symmetric 3-column role grid */}
            <div className="role-grid">
              <div className="role-cell">
                <Link href="/student/login" className="role-btn-main">I'm a Student</Link>
                <Link href="/student/register" className="role-btn-register">Register</Link>
              </div>
              <div className="role-cell">
                <Link href="/tutor/login" className="role-btn-main green">Volunteer Tutor</Link>
                <Link href="/tutor/register" className="role-btn-register">Register</Link>
              </div>
              <div className="role-cell">
                <Link href="/proctor/login" className="role-btn-main red">Proctor Access</Link>
                <div className="role-btn-spacer" />
              </div>
            </div>

            <div className="scroll-hint">
              <div className="scroll-hint-line" />
              <span className="scroll-hint-text">Scroll to discover</span>
              <div className="scroll-hint-line" />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="section-eyebrow" />
          <h2 className="section-title" style={{ color: '#fff' }}>How It Works</h2>
          <div className="steps-grid" style={{ maxWidth: '960px', margin: '3.5rem auto 0' }}>
            {[
              { num: '01', title: 'Student Requests', body: 'Register, select your course, and pick an available time slot on the calendar.' },
              { num: '02', title: 'Tutor Registers', body: 'List every course you can teach and set your weekly availability.' },
              { num: '03', title: 'Automatic Match', body: 'The platform pairs student and tutor instantly, sending confirmation emails to both.' },
              { num: '04', title: 'Proctor Tracks', body: 'The Proctor monitors sessions, grade progress, and service hours in real time.' },
            ].map(s => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="stats-bar">
          <div className="stats-grid">
            {[
              { n: '20+', label: 'Math Courses' },
              { n: '17+', label: 'Science Courses' },
              { n: '30 min', label: 'Per Session' },
              { n: '100%', label: 'Free to Wolverines' },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">{s.n}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* QUOTE */}
        <section className="quote-section">
          {/* Four symmetric crosses at corners */}
          <div className="quote-cross" style={{ top: '2rem', left: '2rem' }}>
            <svg width="28" height="28" viewBox="0 0 28 28"><line x1="14" y1="0" x2="14" y2="28" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="14" x2="28" y2="14" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div className="quote-cross" style={{ top: '2rem', right: '2rem' }}>
            <svg width="28" height="28" viewBox="0 0 28 28"><line x1="14" y1="0" x2="14" y2="28" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="14" x2="28" y2="14" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div className="quote-cross" style={{ bottom: '2rem', left: '2rem' }}>
            <svg width="28" height="28" viewBox="0 0 28 28"><line x1="14" y1="0" x2="14" y2="28" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="14" x2="28" y2="14" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>
          <div className="quote-cross" style={{ bottom: '2rem', right: '2rem' }}>
            <svg width="28" height="28" viewBox="0 0 28 28"><line x1="14" y1="0" x2="14" y2="28" stroke="#0a1628" strokeWidth="2"/><line x1="0" y1="14" x2="28" y2="14" stroke="#0a1628" strokeWidth="2"/></svg>
          </div>

          {/* Large B watermark */}
          <div className="quote-b-bg">
            <Image src="/clipart765116.png" alt="" width={420} height={460} style={{ objectFit: 'contain' }} aria-hidden="true" />
          </div>

          <div className="quote-inner">
            <div className="gold-rule" style={{ marginBottom: '2rem' }} />
            <blockquote className="quote-text">
              "Built by a Wolverine, for Wolverines — gifted permanently to Belen Jesuit so that every class after mine benefits from it."
            </blockquote>
            <div className="quote-attr">Diego A. Núñez &nbsp;·&nbsp; Class of 2027</div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Seal" width={64} height={64} style={{ objectFit: 'contain', opacity: 0.5 }} />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-left">
              <Image src="/clipart765116.png" alt="Belen B" width={34} height={38} style={{ objectFit: 'contain' }} />
              <div>
                <div className="footer-brand">WP2PT</div>
                <div className="footer-sub">Wolverines Peer-to-Peer Tutoring</div>
              </div>
            </div>
            <div className="footer-center">
              <div className="footer-amdg">Ad Majorem Dei Gloriam</div>
              <div className="footer-school">Belen Jesuit Preparatory School · Miami, Florida</div>
            </div>
            <div className="footer-right">
              <Link href="/student/login" className="footer-link">Students</Link>
              <Link href="/tutor/login" className="footer-link">Tutors</Link>
              <Link href="/proctor/login" className="footer-link">Proctor</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
