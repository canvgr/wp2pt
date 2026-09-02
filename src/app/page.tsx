'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Barlow', sans-serif; }
        .wp2pt-wrap { min-height: 100vh; background: #fff; overflow-x: hidden; }
        .main-header {
          background: #0a1628;
          padding: 0 3rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 3px solid #c9a84c;
        }
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .header-school-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: #fff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .header-school-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.62rem;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .header-right { display: flex; align-items: center; gap: 2rem; }
        .header-nav { display: flex; gap: 1.75rem; }
        .header-nav a {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e2e8f0;
          text-decoration: none;
          transition: color 0.15s;
        }
        .header-nav a:hover { color: #c9a84c; }
        .hero {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #f3f4f6;
          overflow: hidden;
          padding: 2.5rem 2rem 3rem;
          min-height: calc(100vh - 68px);
        }
        .hero-watermark {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          pointer-events: none;
        }
        .hero-b-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.04;
          pointer-events: none;
          user-select: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 680px;
          width: 100%;
        }
        .gold-rule { width: 48px; height: 2px; background: #c9a84c; }
        .hero-amdg {
          font-family: Georgia, serif;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: #6b7280;
          text-transform: uppercase;
          margin: 0.9rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-amdg::before, .hero-amdg::after { content: '+'; color: #c9a84c; font-size: 0.85rem; }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(3rem, 8vw, 5.5rem);
          color: #0a1628;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin: 1rem 0 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.06em;
        }
        .hero-title-row { display: block; line-height: 0.88; }
        .hero-title-gold { color: #c9a84c; }

        .hero-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.92rem;
          color: #4b5563;
          line-height: 1.7;
          max-width: 420px;
          margin: 0.9rem auto 1.75rem;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: 100%;
          max-width: 580px;
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
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          line-height: 1.3;
          text-transform: uppercase;
          padding: 0.85rem 0.5rem;
          text-decoration: none;
          text-align: center;
          border-bottom: 1px solid #1e3a5f;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 3.4rem;
        }
        .role-btn-main:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-main.green { background: #155e3b; color: #fff; }
        .role-btn-main.green:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-main.red { background: #7c2d12; color: #fff; border-bottom: none; }
        .role-btn-main.red:hover { background: #c9a84c; color: #0a1628; }
        .role-btn-register {
          background: #fff;
          color: #0a1628;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.55rem 0.5rem;
          text-decoration: none;
          text-align: center;
          display: block;
          transition: background 0.15s;
        }
        .role-btn-register:hover { background: #f3f4f6; }
        .role-btn-spacer { padding: 0.55rem; background: #fff; }
        .stats-bar { background: #c9a84c; padding: 2.25rem 3rem; }
        .stats-grid {
          max-width: 860px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          text-align: center;
        }
        .stat-item { padding: 0 1rem; border-right: 1px solid rgba(10,22,40,0.2); }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2.5rem;
          color: #0a1628;
          line-height: 1;
        }
        .stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.62rem;
          color: #0a1628;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-top: 0.25rem;
          opacity: 0.7;
        }
        .quote-section {
          background: #f3f4f6;
          padding: 5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .quote-cross { position: absolute; opacity: 0.1; }
        .quote-b-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.035;
          pointer-events: none;
        }
        .quote-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
        .quote-text {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #0a1628;
          line-height: 1.85;
        }
        .quote-attr {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: 1.5rem;
        }
        .footer { background: #0a1628; border-top: 4px solid #c9a84c; padding: 2rem 3rem; }
        .footer-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
        }
        .footer-left { display: flex; align-items: center; gap: 0.75rem; }
        .footer-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          color: #c9a84c;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .footer-sub { font-family: 'Barlow', sans-serif; font-size: 0.62rem; color: #475569; }
        .footer-center { text-align: center; }
        .footer-amdg {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.25rem;
        }
        .footer-school { font-family: 'Barlow', sans-serif; font-size: 0.6rem; color: #475569; }
        .footer-right { display: flex; gap: 1.5rem; justify-content: flex-end; }
        .footer-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #c9a84c; }
        @media (max-width: 768px) {
          .main-header { padding: 0 1.25rem; }
          .header-nav { display: none; }
          .hero { padding: 1.5rem 1.25rem 2rem; }
          .role-grid { grid-template-columns: 1fr; border: none; gap: 0.5rem; max-width: 320px; }
          .role-cell { border-right: none; border: 2px solid #0a1628; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .stat-item { border-right: none; }
          .footer-inner { grid-template-columns: 1fr; text-align: center; }
          .footer-left { justify-content: center; }
          .footer-right { justify-content: center; }
        }
      `}</style>

      <div className="wp2pt-wrap">

        {/* ONE HEADER ONLY */}
        <header className="main-header">
          <div className="header-left">
            <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit Seal" width={48} height={48} style={{ objectFit: 'contain' }} />
            <div>
              <div className="header-school-name">Belen Jesuit</div>
              <div className="header-school-sub">Preparatory School</div>
            </div>
          </div>
          <div className="header-right">
            <nav className="header-nav">
              <Link href="/student/login">Student</Link>
              <Link href="/tutor/login">Volunteer Tutor</Link>
              <Link href="/proctor/login">Proctor</Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
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
          <div className="hero-b-watermark" aria-hidden="true">
            <Image src="/clipart765116.png" alt="" width={480} height={530} style={{ objectFit: 'contain' }} />
          </div>
          <div className="hero-content">
            <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit" width={90} height={90} style={{ objectFit: 'contain', marginBottom: '0.75rem' }} />
            <div className="gold-rule" />
            <div className="hero-amdg">Ad Majorem Dei Gloriam</div>
            <h1 className="hero-title">
              <span className="hero-title-row">Wolverines</span>
              <span className="hero-title-row hero-title-gold">Peer-to-Peer</span>
              <span className="hero-title-row">Tutoring</span>
            </h1>
            <p className="hero-sub">
              A student-built platform connecting Belen Jesuit students with volunteer tutors — automatically matched, confirmed by email, and tracked by the Proctor.
            </p>
            <div className="role-grid">
              <div className="role-cell">
                <Link href="/student/login" className="role-btn-main">Student Sign In</Link>
                <Link href="/student/register" className="role-btn-register">Register</Link>
              </div>
              <div className="role-cell">
                <Link href="/tutor/login" className="role-btn-main green">Volunteer Tutor Sign In</Link>
                <Link href="/tutor/register" className="role-btn-register">Register</Link>
              </div>
              <div className="role-cell">
                <Link href="/proctor/login" className="role-btn-main red">Proctor Sign In</Link>
                <div className="role-btn-spacer" />
              </div>
            </div>
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
          <div className="quote-b-bg">
            <Image src="/clipart765116.png" alt="" width={400} height={440} style={{ objectFit: 'contain' }} aria-hidden="true" />
          </div>
          <div className="quote-inner">
            <div className="gold-rule" style={{ margin: '0 auto 1.75rem' }} />
            <blockquote className="quote-text">"Built by a Wolverine, for Wolverines."</blockquote>
            <div className="quote-attr">Diego A. Núñez &nbsp;·&nbsp; Class of 2027</div>
            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center' }}>
              <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Seal" width={56} height={56} style={{ objectFit: 'contain', opacity: 0.45 }} />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-left">
              <Image src="/clipart765116.png" alt="Belen B" width={32} height={36} style={{ objectFit: 'contain' }} />
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
