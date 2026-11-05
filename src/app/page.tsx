'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/* ------------------------------------------------------------------
   Background drawing: classical arcade (columns + arches + railing)
   with a palm tree on each side. Generated in code, no image needed.
------------------------------------------------------------------- */
type Shape = { d: string; w: number }

function buildArcade(): Shape[] {
  const out: Shape[] = []
  const f = (n: number) => n.toFixed(1)
  const pa = (d: string, w = 1.4) => out.push({ d, w })
  const ln = (x1: number, y1: number, x2: number, y2: number, w = 1.4) =>
    pa(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, w)
  const ci = (x: number, y: number, r: number, w = 1) =>
    pa(`M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`, w)

  const G = 320
  const x0 = 210, x1 = 1230, n = 10, bay = (x1 - x0) / n, cw = 16, cap = G - 128

  // steps
  ln(x0 - 30, G, x1 + 30, G, 2.4); ln(x0 - 20, G - 6, x1 + 20, G - 6, 1.4); ln(x0 - 10, G - 12, x1 + 10, G - 12, 1.2)

  // columns: base, tapered fluted shaft, capital
  for (let i = 0; i <= n; i++) {
    const cx = x0 + i * bay
    pa(`M${cx - cw / 2 - 5} ${G - 12}V${G - 20}H${cx + cw / 2 + 5}V${G - 12}`, 1.2)
    pa(`M${cx - cw / 2 - 3} ${G - 20}Q${cx} ${G - 27} ${cx + cw / 2 + 3} ${G - 20}`, 1.1)
    pa(`M${cx - cw / 2} ${G - 24}Q${cx - cw / 2 - 1.5} ${(G - 24 + cap) / 2} ${cx - cw / 2 + 1.5} ${cap + 4}`, 1.4)
    pa(`M${cx + cw / 2} ${G - 24}Q${cx + cw / 2 + 1.5} ${(G - 24 + cap) / 2} ${cx + cw / 2 - 1.5} ${cap + 4}`, 1.4)
    for (const k of [-3, 3]) ln(cx + k, G - 28, cx + k * 0.8, cap + 8, 0.7)
    ln(cx - cw / 2 + 1, cap + 4, cx + cw / 2 - 1, cap + 4, 1)
    pa(`M${cx - cw / 2 + 1} ${cap + 4}Q${cx - cw / 2 - 6} ${cap} ${cx - cw / 2 - 8} ${cap - 3}H${cx + cw / 2 + 8}Q${cx + cw / 2 + 6} ${cap} ${cx + cw / 2 - 1} ${cap + 4}`, 1.2)
    pa(`M${cx - cw / 2 - 9} ${cap - 3}V${cap - 9}H${cx + cw / 2 + 9}V${cap - 3}`, 1.2)
  }

  // arches with double outline, keystone, and roundels between arches
  for (let i = 0; i < n; i++) {
    const a = x0 + i * bay + cw / 2 + 9, b = x0 + (i + 1) * bay - cw / 2 - 9
    const r = (b - a) / 2, m = (a + b) / 2, y = cap - 9
    pa(`M${f(a)} ${y}A${f(r)} ${f(r)} 0 0 1 ${f(b)} ${y}`, 1.5)
    pa(`M${f(a - 6)} ${y}A${f(r + 6)} ${f(r + 6)} 0 0 1 ${f(b + 6)} ${y}`, 1)
    const top = y - r - 6
    pa(`M${f(m - 6)} ${f(top - 2)}L${f(m - 4)} ${f(top + 12)}H${f(m + 4)}L${f(m + 6)} ${f(top - 2)}Z`, 1)
    if (i < n - 1) ci(x0 + (i + 1) * bay, y - r - 2, 7, 0.9)
  }

  // entablature, cornice, balustrade
  const ey = cap - 9 - (bay - cw - 18) / 2 - 16
  ln(x0 - 14, ey, x1 + 14, ey, 1.4); ln(x0 - 14, ey - 12, x1 + 14, ey - 12, 1.2)
  ln(x0 - 22, ey - 16, x1 + 22, ey - 16, 1.6); ln(x0 - 26, ey - 20, x1 + 26, ey - 20, 1.2)
  const by = ey - 20
  ln(x0 - 16, by - 30, x1 + 16, by - 30, 1.4)
  for (let bx = x0 - 10; bx <= x1 + 10; bx += 13) {
    pa(`M${f(bx - 2.5)} ${f(by)}Q${f(bx - 6)} ${f(by - 10)} ${f(bx - 2)} ${f(by - 15)}Q${f(bx - 4)} ${f(by - 22)} ${f(bx - 2.5)} ${f(by - 30)}M${f(bx + 2.5)} ${f(by)}Q${f(bx + 6)} ${f(by - 10)} ${f(bx + 2)} ${f(by - 15)}Q${f(bx + 4)} ${f(by - 22)} ${f(bx + 2.5)} ${f(by - 30)}`, 0.8)
  }
  for (let i = 0; i <= n; i += 2) {
    const cx = x0 + i * bay
    pa(`M${cx - 8} ${f(by)}V${f(by - 32)}H${cx + 8}V${f(by)}`, 1.1)
  }

  // palm tree: tapered ringed trunk + drooping leafy fronds
  const palm = (bx: number, h: number, lean: number) => {
    const tx = bx + lean, ty = G - h, wb = 10, wt = 5.5, c1 = bx + lean * 0.15
    pa(`M${bx - wb} ${G}Q${f(c1 - (wb + wt) / 2)} ${f(G - h * 0.55)} ${f(tx - wt)} ${ty + 6}`, 1.5)
    pa(`M${bx + wb} ${G}Q${f(c1 + (wb + wt) / 2)} ${f(G - h * 0.55)} ${f(tx + wt)} ${ty + 6}`, 1.5)
    for (let y = G - 10; y > ty + 18; y -= 13) {
      const t = (G - y) / h
      const xc = (1 - t) ** 2 * bx + 2 * (1 - t) * t * c1 + t * t * tx
      const w = wb + (wt - wb) * t
      pa(`M${f(xc - w)} ${y}Q${f(xc)} ${y - 3} ${f(xc + w)} ${y}`, 0.75)
    }
    const fronds: [number, number, number][] = [
      [-178, 150, 10], [-150, 140, 40], [-120, 105, 55], [-90, 70, 62], [-60, 105, 55],
      [-30, 140, 40], [-2, 150, 10], [160, 110, -20], [20, 110, -20],
    ]
    for (const [ang, L, lift] of fronds) {
      const r = (ang * Math.PI) / 180
      const ex = tx + Math.cos(r) * L
      const eyy = ty + 60 - lift * 0.2 + (Math.abs(Math.cos(r)) > 0.6 ? 25 : 0)
      const cx = tx + Math.cos(r) * L * 0.5, cy = ty - lift
      pa(`M${tx} ${ty}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(eyy)}`, 1.1)
      for (let k = 1; k < 11; k++) {
        const t = k / 11
        const px = (1 - t) ** 2 * tx + 2 * (1 - t) * t * cx + t * t * ex
        const py = (1 - t) ** 2 * ty + 2 * (1 - t) * t * cy + t * t * eyy
        const dx = 2 * (1 - t) * (cx - tx) + 2 * t * (ex - cx)
        const dy = 2 * (1 - t) * (cy - ty) + 2 * t * (eyy - cy)
        const d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d
        const ll = 10 + 26 * Math.sin(Math.PI * t)
        for (const sg of [1, -1]) {
          pa(`M${f(px)} ${f(py)}Q${f(px + ux * ll * 0.15 + sg * -uy * ll * 0.3)} ${f(py + ll * 0.3)} ${f(px + ux * ll * 0.45 + sg * -uy * ll * 0.25)} ${f(py + ll * 0.85)}`, 0.6)
        }
      }
    }
    for (const ox of [-4, 4, 0]) ci(tx + ox, ty + 7, 3.4, 0.9)
  }
  palm(90, 270, 14)
  palm(1350, 270, -14)

  // shrubs at both ends
  for (const sx of [x0 - 48, x1 + 48]) {
    pa(`M${sx - 30} ${G}Q${sx - 26} ${G - 22} ${sx - 10} ${G - 20}Q${sx - 4} ${G - 34} ${sx + 10} ${G - 24}Q${sx + 26} ${G - 26} ${sx + 30} ${G}`, 1)
  }
  return out
}

/* ------------------------------------------------------------------
   Role cards
------------------------------------------------------------------- */
type Role = {
  key: string
  title: string
  desc: string
  frontCta: string
  welcome: string
  signIn: { label: string; href: string }
  register?: { label: string; href: string }
  icon: JSX.Element
}

const iconProps = {
  width: 46, height: 46, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
}

const ROLES: Role[] = [
  {
    key: 'student',
    title: 'Student',
    desc: 'Request a 30-minute session in any math or science course.',
    frontCta: 'Get help',
    welcome: 'Welcome, Wolverine',
    signIn: { label: 'Sign in as Student', href: '/student/login' },
    register: { label: 'Create account', href: '/student/register' },
    icon: (
      <svg {...iconProps}>
        <path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z" />
        <path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z" />
      </svg>
    ),
  },
  {
    key: 'tutor',
    title: 'Volunteer Tutor',
    desc: 'Set your hours and earn service credit for every session.',
    frontCta: 'Start tutoring',
    welcome: 'Welcome, Tutor',
    signIn: { label: 'Sign in as Tutor', href: '/tutor/login' },
    register: { label: 'Create account', href: '/tutor/register' },
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4l1.5 3 3 .4-2.2 2.1.5 3-2.8-1.5" />
      </svg>
    ),
  },
  {
    key: 'proctor',
    title: 'Proctor',
    desc: 'Pairings, classroom, grade progress and tutor hours.',
    frontCta: 'Open dashboard',
    welcome: 'Proctor Access',
    signIn: { label: 'Sign in', href: '/proctor/login' },
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
      </svg>
    ),
  },
]

export default function LandingPage() {
  const [flipped, setFlipped] = useState<string | null>(null)
  const arcade = useMemo(buildArcade, [])

  const toggle = (key: string) => setFlipped(prev => (prev === key ? null : key))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&family=Barlow:wght@400;500&display=swap');
        :root { --navy:#0a1628; --navy2:#13264a; --gold:#c9a84c; --sand:#f5f4f0; --ink:#4b5563; --line:#e7e2d6; }
        html, body { margin:0; padding:0; background:var(--sand); }
        .lp { min-height:100vh; display:flex; flex-direction:column; background:var(--sand); color:var(--navy); font-family:'Barlow', system-ui, sans-serif; overflow-x:hidden; }
        .lp *, .lp *::before, .lp *::after { box-sizing:border-box; }

        /* header */
        .lp-head { height:76px; display:flex; align-items:center; justify-content:space-between; padding:0 56px; background:var(--navy); }
        .lp-side { display:flex; align-items:center; gap:14px; width:320px; }
        .lp-side.r { justify-content:flex-end; text-align:right; }
        .lp-name { font-family:'Barlow Condensed', sans-serif; font-weight:800; font-size:18px; color:#fff; letter-spacing:.06em; text-transform:uppercase; line-height:1; }
        .lp-small { font-size:11px; color:#94a3b8; letter-spacing:.12em; text-transform:uppercase; margin-top:3px; }
        .lp-amdg { font-family:Georgia, serif; font-size:11px; letter-spacing:.32em; color:var(--gold); }

        /* navy band */
        .lp-band { position:relative; overflow:hidden; text-align:center; padding:44px 24px 150px;
          background:linear-gradient(180deg, var(--navy) 0%, var(--navy2) 100%); border-bottom:3px solid var(--gold); }
        .lp-band-b { position:absolute; left:50%; top:-40px; transform:translateX(-50%); opacity:.06; pointer-events:none; }
        .lp-title { position:relative; margin:0; font-family:'Barlow Condensed', sans-serif; font-weight:900; text-transform:uppercase;
          font-size:clamp(40px, 5.8vw, 84px); line-height:.9; color:#fff; }
        .lp-title span { color:var(--gold); }
        .lp-sub { position:relative; margin:14px auto 0; max-width:640px; font-size:17px; line-height:1.6; color:#b8c2d4; }

        /* cards */
        .lp-cards { position:relative; z-index:2; display:grid; grid-template-columns:repeat(3, 370px); gap:30px;
          justify-content:center; margin:-120px auto 0; padding:0 24px; perspective:1600px; }
        .lp-flip { position:relative; height:400px; cursor:pointer; transform-style:preserve-3d; outline:none;
          transition:transform .75s cubic-bezier(.2,.8,.2,1), opacity .4s, filter .4s; }
        .lp-flip:hover:not(.on) { transform:translateY(-6px); }
        .lp-flip:focus-visible .lp-front { box-shadow:0 0 0 3px var(--gold), 0 28px 56px -30px rgba(10,22,40,.42); }
        .lp-flip.on { transform:rotateY(180deg) scale(1.03); }
        .lp-cards.has .lp-flip:not(.on) { opacity:.55; filter:saturate(.6); }
        .lp-face { position:absolute; inset:0; border-radius:185px 185px 28px 28px; backface-visibility:hidden; -webkit-backface-visibility:hidden;
          display:flex; flex-direction:column; align-items:center; text-align:center; padding:56px 38px 30px; overflow:hidden; }
        .lp-front { background:#fff; box-shadow:0 28px 56px -30px rgba(10,22,40,.42), 0 0 0 1px var(--line); }
        .lp-front::before { content:""; position:absolute; inset:10px; border-radius:176px 176px 20px 20px; border:1.5px solid #f4ead0; pointer-events:none; }
        .lp-ic { width:100px; height:100px; border-radius:50%; background:var(--navy); color:var(--gold); display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 0 4px #fff, 0 0 0 6px var(--gold); margin-bottom:24px; flex-shrink:0; }
        .lp-front h3, .lp-back h3 { margin:0; font-family:'Barlow Condensed', sans-serif; font-weight:900; text-transform:uppercase; line-height:1; }
        .lp-front h3 { font-size:38px; }
        .lp-front p { margin:12px 0 0; font-size:15px; line-height:1.55; color:var(--ink); }
        .lp-go { margin-top:auto; display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:var(--navy);
          border-radius:999px; padding:10px 20px; background:var(--sand); transition:background .2s; }
        .lp-flip:hover .lp-go { background:#efe6cc; }
        .lp-back { background:var(--navy); color:#fff; transform:rotateY(180deg); justify-content:center; padding-top:40px;
          box-shadow:0 34px 70px -28px rgba(10,22,40,.75), 0 0 0 2px var(--gold); }
        .lp-back-b { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:.07; pointer-events:none; }
        .lp-back h3 { position:relative; font-size:36px; color:var(--gold); }
        .lp-pill { position:relative; display:flex; align-items:center; justify-content:center; width:100%; margin-top:12px; padding:16px; border-radius:999px;
          font-size:16px; font-weight:500; text-decoration:none; transition:transform .15s, background .2s, color .2s; }
        .lp-pill:hover { transform:translateY(-1px); }
        .lp-pill.first { margin-top:28px; }
        .lp-pill.gold { background:var(--gold); color:var(--navy); }
        .lp-pill.gold:hover { background:#d8ba63; }
        .lp-pill.ghost { color:#fff; box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.5); }
        .lp-pill.ghost:hover { background:rgba(255,255,255,.08); }
        .lp-back-link { position:relative; margin-top:18px; background:none; border:none; font:inherit; font-size:13px; color:#8b97ad; cursor:pointer; }
        .lp-back-link:hover { color:#fff; }

        /* bottom: arcade drawing + signature */
        .lp-bottom { position:relative; flex:1; min-height:190px; display:flex; align-items:flex-end; justify-content:center; padding:36px 24px 22px; overflow:hidden; }
        .lp-arcade { position:absolute; left:50%; bottom:0; width:1440px; max-width:none; height:320px; transform:translateX(-50%); opacity:.14; pointer-events:none; }
        .lp-glow { position:absolute; left:0; right:0; bottom:0; height:420px; pointer-events:none;
          background:radial-gradient(ellipse 60% 70% at 50% 100%, rgba(201,168,76,.22), transparent 70%); }
        .lp-patch { position:absolute; left:50%; bottom:0; width:760px; max-width:100%; height:150px; transform:translateX(-50%); pointer-events:none;
          background:radial-gradient(ellipse 50% 60% at 50% 70%, rgba(245,244,240,.95), rgba(245,244,240,0) 75%); }
        .lp-sig { position:relative; display:flex; align-items:center; gap:28px; }
        .lp-rule { width:1px; height:46px; background:#d9d2bf; }
        .lp-quote { font-family:Georgia, serif; font-style:italic; font-size:19px; color:var(--navy); text-align:center; }
        .lp-attr { font-family:'Barlow Condensed', sans-serif; font-weight:800; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:#8a8f98; margin-top:6px; text-align:center; }

        @media (max-width: 1240px) {
          .lp-cards { grid-template-columns:repeat(3, minmax(0, 330px)); gap:22px; }
          .lp-face { padding:56px 26px 30px; }
          .lp-front h3 { font-size:32px; }
        }
        @media (max-width: 900px) {
          .lp-head { padding:0 18px; height:72px; }
          .lp-side { width:auto; }
          .lp-amdg, .lp-side.r .lp-text { display:none; }
          .lp-band { padding:40px 18px 150px; }
          .lp-cards { grid-template-columns:minmax(0, 360px); gap:22px; margin-top:-120px; }
          .lp-flip { height:380px; }
          .lp-sig { gap:16px; }
          .lp-sig .lp-rule, .lp-sig-logo { display:none; }
          .lp-quote { font-size:17px; }
          .lp-attr { letter-spacing:.14em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-flip, .lp-pill { transition:none; }
        }
      `}</style>

      <div className="lp">
        {/* HEADER — school identity only, no sign-in links */}
        <header className="lp-head">
          <div className="lp-side">
            <Image src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit seal" width={50} height={50} />
            <div>
              <div className="lp-name">Belen Jesuit</div>
              <div className="lp-small">Preparatory School</div>
            </div>
          </div>
          <div className="lp-amdg">+ &nbsp;AMDG&nbsp; +</div>
          <div className="lp-side r">
            <div className="lp-text">
              <div className="lp-name">WP2PT</div>
              <div className="lp-small">Peer-to-Peer Tutoring</div>
            </div>
            <Image src="/clipart765116.png" alt="Belen B" width={39} height={50} />
          </div>
        </header>

        {/* NAVY BAND */}
        <section className="lp-band">
          <Image className="lp-band-b" src="/clipart765116.png" alt="" width={434} height={560} aria-hidden="true" />
          <h1 className="lp-title">Wolverines <span>Peer&#8209;to&#8209;Peer</span> Tutoring</h1>
          <p className="lp-sub">Belen students get matched with a volunteer tutor before they walk into the room.</p>
        </section>

        {/* FLIP CARDS */}
        <div className={`lp-cards${flipped ? ' has' : ''}`}>
          {ROLES.map(role => {
            const on = flipped === role.key
            return (
              <div
                key={role.key}
                className={`lp-flip${on ? ' on' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${role.title}: ${on ? 'showing sign-in options' : 'show sign-in options'}`}
                onClick={() => toggle(role.key)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(role.key) } }}
              >
                <div className="lp-face lp-front" aria-hidden={on}>
                  <div className="lp-ic">{role.icon}</div>
                  <h3>{role.title}</h3>
                  <p>{role.desc}</p>
                  <span className="lp-go">{role.frontCta} →</span>
                </div>
                <div className="lp-face lp-back" aria-hidden={!on}>
                  <Image className="lp-back-b" src="/clipart765116.png" alt="" width={263} height={340} aria-hidden="true" />
                  <h3>{role.welcome}</h3>
                  <Link href={role.signIn.href} className="lp-pill gold first" tabIndex={on ? 0 : -1} onClick={e => e.stopPropagation()}>
                    {role.signIn.label}
                  </Link>
                  {role.register && (
                    <Link href={role.register.href} className="lp-pill ghost" tabIndex={on ? 0 : -1} onClick={e => e.stopPropagation()}>
                      {role.register.label}
                    </Link>
                  )}
                  <button
                    type="button"
                    className="lp-back-link"
                    tabIndex={on ? 0 : -1}
                    onClick={e => { e.stopPropagation(); setFlipped(null) }}
                  >
                    ↺ Choose a different role
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* BOTTOM — arcade drawing + signature */}
        <section className="lp-bottom">
          <svg className="lp-arcade" viewBox="0 0 1440 320" aria-hidden="true">
            <g fill="none" stroke="#0a1628" strokeLinecap="round" strokeLinejoin="round">
              {arcade.map((s, i) => <path key={i} d={s.d} strokeWidth={s.w} />)}
            </g>
          </svg>
          <div className="lp-glow" />
          <div className="lp-patch" />
          <div className="lp-sig">
            <Image className="lp-sig-logo" src="/Belen_Jesuit_Preparatory_School_seal.png" alt="Belen Jesuit seal" width={58} height={58} />
            <div className="lp-rule" />
            <div>
              <div className="lp-quote">“Built by a Wolverine, for Wolverines.”</div>
              <div className="lp-attr">Diego A. Núñez · Class of 2027</div>
            </div>
            <div className="lp-rule" />
            <Image className="lp-sig-logo" src="/clipart765116.png" alt="Belen B" width={46} height={60} />
          </div>
        </section>
      </div>
    </>
  )
}
