'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'var(--navy)',
        color: 'white',
        textAlign: 'center',
        padding: '4rem 2rem 5rem',
        borderBottom: '3px solid var(--gold)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            border: '2px solid var(--gold)',
            borderRadius: '999px',
            padding: '0.3rem 1.2rem',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.5rem',
          }}>
            Belen Jesuit Preparatory School · Miami, Florida
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            color: 'var(--gold)',
            margin: '0 0 0.5rem',
            letterSpacing: '0.02em',
          }}>
            WOLVERINES
          </h1>
          <h2 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 'normal',
            color: 'white',
            margin: '0 0 1.5rem',
            letterSpacing: '0.05em',
          }}>
            Peer-to-Peer Tutoring
          </h2>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '1.05rem',
            color: '#b0bec5',
            maxWidth: '560px',
            margin: '0 auto 0.75rem',
            lineHeight: 1.7,
          }}>
            A dedicated platform for Belen Jesuit students, tutors, and proctors
            to coordinate peer tutoring sessions — organized, efficient, and built
            by a Wolverine, for Wolverines.
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8rem',
            color: 'var(--gold-light)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
          }}>
            Ad Majorem Dei Gloriam
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.82rem',
            color: '#78909c',
            marginTop: '1rem',
          }}>
            Registration is open to Belen Jesuit students only who have a school-issued email address.
          </p>
        </div>
      </div>

      {/* Role cards */}
      <div className="page">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginTop: '-2rem',
        }}>
          {/* Student card */}
          <RoleCard
            icon="🎓"
            title="I'm a Student"
            description="Request tutoring in Math or Science, pick a time, and get matched with a peer tutor automatically."
            color="var(--navy)"
            loginHref="/student/login"
            registerHref="/student/register"
          />

          {/* VT card */}
          <RoleCard
            icon="✋"
            title="I'm a Volunteer Tutor"
            description="Register your subjects and availability, and help a fellow Wolverine succeed and grow."
            color="#155e3b"
            loginHref="/tutor/login"
            registerHref="/tutor/register"
          />

          {/* Proctor card */}
          <RoleCard
            icon="📋"
            title="I'm a Proctor"
            description="Access the admin dashboard to view sessions and track student grade progress over time."
            color="#7c2d12"
            loginHref="/proctor/login"
            registerHref={null}
            registerLabel="Admin access only"
          />
        </div>

        {/* How it works */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
            How It Works
          </h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Three simple steps to a matched tutoring session.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '1', title: 'Choose Your Course', desc: 'Select your subject and the specific course you need help with.' },
              { num: '2', title: 'Pick a Time', desc: 'Choose an available 15- or 30-minute slot from the calendar.' },
              { num: '3', title: 'Get Matched', desc: 'The system finds a qualified Volunteer Tutor. You\'ll both get a confirmation email.' },
            ].map(s => (
              <div key={s.num} style={{ textAlign: 'left' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--navy)', color: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem',
                }}>
                  {s.num}
                </div>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--navy)', fontSize: '1rem' }}>{s.title}</h3>
                <p style={{ margin: 0, fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer motto */}
        <div style={{ textAlign: 'center', marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Ad Majorem Dei Gloriam · www.wp2pt.com · Belen Jesuit Preparatory School
          </p>
        </div>
      </div>
    </>
  )
}

function RoleCard({ icon, title, description, color, loginHref, registerHref, registerLabel }: {
  icon: string
  title: string
  description: string
  color: string
  loginHref: string
  registerHref: string | null
  registerLabel?: string
}) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>

      <div style={{
        display: 'inline-block',
        width: '3px',
        height: '24px',
        background: color,
        borderRadius: '2px',
        marginBottom: '0.75rem',
      }} />

      <h3 style={{ margin: '0 0 0.75rem', color: 'var(--navy)', fontSize: '1.15rem' }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        margin: '0 0 1.5rem',
        flex: 1,
      }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link href={loginHref} style={{
          background: color,
          color: 'white',
          padding: '0.6rem 1.25rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '0.88rem',
          transition: 'opacity 0.2s',
        }}>
          Sign In
        </Link>
        {registerHref ? (
          <Link href={registerHref} style={{
            background: 'transparent',
            color: color,
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: `1px solid ${color}`,
          }}>
            Register
          </Link>
        ) : (
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            alignSelf: 'center',
          }}>
            {registerLabel}
          </span>
        )}
      </div>
    </div>
  )
}
