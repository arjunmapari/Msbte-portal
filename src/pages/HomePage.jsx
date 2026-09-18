import { useState, useEffect } from 'react';

export default function HomePage({ papers, nav }) {
  const [activeStep, setActiveStep] = useState(null);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTicker(x => { if (x >= 100) { clearInterval(t); return 100; } return x + 2; }), 16);
    return () => clearInterval(t);
  }, []);

  const sections = [
    { key: 'browse', icon: '📂', title: 'Model Answer Papers', color: '#1a4fa0', grad: 'linear-gradient(135deg,#0d3278,#1a4fa0)', bg: '#dbeafe', desc: 'Year-wise model answer papers for all branches with full solutions.', tag: '700+ Papers', count: papers.length },
    { key: 'manual', icon: '📖', title: 'Practical Manuals', color: '#065f46', grad: 'linear-gradient(135deg,#064e3b,#059669)', bg: '#d1fae5', desc: 'K-Scheme practical manual answers—lab ready and organized by semester.', tag: 'All Subjects' },
    { key: 'syllabus', icon: '📋', title: 'K-Scheme Syllabus', color: '#5b21b6', grad: 'linear-gradient(135deg,#3b0764,#7c3aed)', bg: '#ede9fe', desc: 'Official syllabus with subject codes, units and course outcomes.', tag: 'Updated 2024' },
    { key: 'manualpdf', icon: '📥', title: 'Manual PDFs', color: '#92400e', grad: 'linear-gradient(135deg,#78350f,#d97706)', bg: '#fef3c7', desc: 'Downloadable PDFs — study offline anytime, no internet needed.', tag: 'Free Downloads' },
  ];

  const steps = [
    { n: '01', icon: '🏫', title: 'Pick Your Branch', desc: 'Choose from 7 diploma engineering branches' },
    { n: '02', icon: '📅', title: 'Select Semester', desc: 'Semesters 1 through 6 — all covered' },
    { n: '03', icon: '📚', title: 'Find Your Subject', desc: 'Search or browse subjects in your semester' },
    { n: '04', icon: '⬇️', title: 'View or Download', desc: 'Open online or save the PDF offline' },
  ];

  const stats = [
    { val: '700+', label: 'Papers', icon: '📄' },
    { val: '7', label: 'Branches', icon: '🏛' },
    { val: '6', label: 'Semesters', icon: '📅' },
    { val: '100%', label: 'Free', icon: '🎁' },
  ];

  return (
    <div style={{ background: '#f0f4fb', minHeight: '100vh', fontFamily: "'Inter',sans-serif" }}>

      {/* ═══ HERO ═══ */}
      <div className="hero-section" style={{ background: 'linear-gradient(145deg,#a8d8f0 0%,#c8eafa 15%,#e8f6ff 35%,#f8fdff 55%,#f0eaff 75%,#ffd6b3 100%)', padding: 'clamp(2.5rem,8vw,5rem) var(--pad) clamp(2rem,6vw,4rem)', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-blob" style={{ position: 'absolute', top: '-15%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,.55) 0%,rgba(125,216,248,.28) 40%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', top: '-5%', right: '-5%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,.35) 0%,rgba(196,181,253,.18) 45%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', bottom: '-10%', right: '-4%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(253,186,116,.5) 0%,rgba(251,146,60,.22) 45%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', bottom: '5%', left: '5%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,.15) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', top: '20%', left: '25%', right: '25%', bottom: '20%', background: 'radial-gradient(ellipse,rgba(255,255,255,.7) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(14,165,233,.04) 1px,transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
        <div className="hero-blob" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top,rgba(240,244,251,.6),transparent)', pointerEvents: 'none' }} />

        <style>{`
          @keyframes heroPulse1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(45px,-30px) scale(1.1)}}
          @keyframes heroPulse2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-35px,28px) scale(1.08)}}
          @keyframes heroPulse3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,35px) scale(1.12)}}
          @keyframes floatDot{0%,100%{opacity:.6;transform:translateY(0) scale(1)}50%{opacity:1;transform:translateY(-6px) scale(1.2)}}
          @keyframes badgePop{0%{opacity:0;transform:scale(.9) translateY(-8px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        `}</style>

        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'rgba(255,255,255,.75)', border: '1.5px solid rgba(56,189,248,.3)', padding: '.45rem 1.25rem', borderRadius: 9999, marginBottom: '1.75rem', animation: 'badgePop .55s cubic-bezier(.34,1.56,.64,1) both', backdropFilter: 'blur(14px)', boxShadow: '0 2px 20px rgba(56,189,248,.15),0 1px 4px rgba(0,0,0,.04)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(56,189,248,.2)', animation: 'floatDot 2.5s ease-in-out infinite' }} />
              <span style={{ fontSize: '.68rem', fontWeight: 800, color: '#0369a1', letterSpacing: '1.8px', textTransform: 'uppercase', fontFamily: "'Space Grotesk',sans-serif" }}>FREE · ALL BRANCHES · K SCHEME 2024</span>
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: 'clamp(2.25rem,6vw,4rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0c1a3a', lineHeight: 1.08, marginBottom: '1.125rem', animation: 'fadeUp .6s ease', letterSpacing: '-1.5px' }}>
              MSBTE<br />
              <span style={{ color: '#f97316', letterSpacing: '-1px' }}>Study</span>{' '}
              <span style={{ color: '#0c1a3a' }}>Portal</span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: 'clamp(.9rem,2vw,1.075rem)', color: '#475569', lineHeight: 1.75, marginBottom: '2.25rem', animation: 'fadeUp .7s ease', maxWidth: 560, margin: '0 auto 2.25rem' }}>
              Model answers, practicals, syllabus &amp; manuals — everything MSBTE diploma students need, organized and always free.
            </p>

            {/* CTA Buttons */}
            <div className="hero-btns" style={{ display: 'flex', gap: '.625rem', justifyContent: 'center', flexWrap: 'nowrap', marginBottom: '2rem', animation: 'fadeUp .8s ease' }}>
              <button onClick={() => nav('browse')}
                style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', border: 'none', color: '#fff', padding: '.9rem 2rem', borderRadius: 14, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', boxShadow: '0 8px 24px rgba(13,50,120,.35)', transition: 'all .2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,50,120,.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,50,120,.35)'; }}>
                📂 Browse Papers
              </button>
              <button onClick={() => nav('manual')}
                style={{ background: 'linear-gradient(135deg,#064e3b,#059669)', border: 'none', color: '#fff', padding: '.9rem 2rem', borderRadius: 14, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', boxShadow: '0 8px 24px rgba(6,78,59,.35)', transition: 'all .2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                📖 View Manuals
              </button>
            </div>

            {/* Stats row */}
            <div className="stats-row" style={{ display: 'flex', gap: '.875rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp .9s ease' }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.8)', borderRadius: 14, padding: '.625rem 1.125rem', display: 'flex', alignItems: 'center', gap: '.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '.9375rem', color: '#0c1a3a', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: '.6rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTIONS GRID ═══ */}
      <div style={{ padding: 'clamp(2rem,5vw,3.5rem) var(--pad)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontWeight: 800, fontSize: '.75rem', color: '#1a4fa0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '.5rem' }}>Study Resources</p>
          <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a' }}>Everything You Need</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }} className="sections-grid">
          {sections.map((sec, i) => (
            <div key={sec.key} onClick={() => nav(sec.key)}
              style={{ background: '#fff', borderRadius: 22, padding: '1.75rem', border: '2px solid #dbeafe', cursor: 'pointer', transition: 'all .25s', animation: `fadeUp ${.3 + i * .08}s ease both`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = sec.color; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 48px ${sec.color}22`; const btn = e.currentTarget.querySelector('.view-btn'); if(btn){ btn.style.background = sec.bg; btn.style.borderColor = sec.color; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dbeafe'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; const btn = e.currentTarget.querySelector('.view-btn'); if(btn){ btn.style.background = '#f0f4ff'; btn.style.borderColor = '#dbeafe'; } }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: sec.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>{sec.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.0625rem', fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', marginBottom: '.5rem' }}>{sec.title}</h3>
              <p style={{ color: '#64748b', fontSize: '.875rem', lineHeight: 1.65, flex: 1 }}>{sec.desc}</p>
              <div style={{ marginTop: '1.25rem' }}>
                <span className="view-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', background: '#f0f4ff', color: '#1a4fa0', fontSize: '.8rem', fontWeight: 700, padding: '.45rem 1.1rem', borderRadius: 9999, border: '1.5px solid #dbeafe', transition: 'all .2s', fontFamily: 'Inter' }}>
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div style={{ background: '#fff', padding: 'clamp(2.5rem,6vw,4rem) var(--pad)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontWeight: 800, fontSize: '.75rem', color: '#f97316', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '.5rem' }}>Simple Steps</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a' }}>How It Works</h2>
          </div>
          <div style={{ position: 'relative' }} className="steps-grid-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }} className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* Arrow connector between steps (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="step-arrow" style={{ position: 'absolute', right: '-0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2, color: '#cbd5e1', fontSize: '1.25rem', fontWeight: 900, pointerEvents: 'none' }}>→</div>
                )}
              <div onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{ background: activeStep === i ? 'linear-gradient(135deg,#0d3278,#1a4fa0)' : '#f8fafc', borderRadius: 20, padding: '1.5rem', border: `2px solid ${activeStep === i ? '#1a4fa0' : '#e8f0fe'}`, cursor: 'pointer', transition: 'all .2s', height: '100%' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: activeStep === i ? 'rgba(255,255,255,.2)' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '.875rem' }}>{step.icon}</div>
                <div style={{ fontSize: '.65rem', fontWeight: 800, color: activeStep === i ? 'rgba(255,255,255,.5)' : '#94a3b8', letterSpacing: '1px', marginBottom: '.25rem' }}>STEP {step.n}</div>
                <h3 style={{ fontWeight: 800, fontSize: '.9375rem', fontFamily: "'Space Grotesk',sans-serif", color: activeStep === i ? '#fff' : '#0f172a', marginBottom: '.375rem' }}>{step.title}</h3>
                <p style={{ color: activeStep === i ? 'rgba(255,255,255,.7)' : '#64748b', fontSize: '.8125rem', lineHeight: 1.6 }}>{step.desc}</p>
                {activeStep === i && <div style={{ marginTop: '.75rem', color: '#fb923c', fontWeight: 800, fontSize: '.875rem' }}>✓ Done!</div>}
              </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* ═══ CTA BANNER ═══ */}
      <div style={{ padding: '0 var(--pad) clamp(2.5rem,5vw,4rem)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg,#ea580c,#f97316,#fb923c)', borderRadius: 24, padding: 'clamp(2rem,5vw,3rem) clamp(1.5rem,4vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 16px 48px rgba(249,115,22,.3)' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.875rem' }}>🎓</div>
            <h2 style={{ fontSize: 'clamp(1.375rem,3.5vw,2rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#fff', marginBottom: '.75rem', lineHeight: 1.2 }}>Start Studying — No Signup Needed</h2>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 'clamp(.875rem,2vw,.9375rem)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2rem' }}>Join thousands of MSBTE diploma students who use this portal to ace their exams. Open and free, forever.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => nav('manualpdf')}
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', color: '#fff', padding: '.875rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                📥 Manual PDFs
              </button>
              <button onClick={() => nav('syllabus')}
                style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', border: 'none', color: '#fff', padding: '.875rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                📋 View Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
