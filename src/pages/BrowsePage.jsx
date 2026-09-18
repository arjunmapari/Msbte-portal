import { useState } from 'react';
import { MODEL_ANSWER_BRANCHES, SEMS, bOf } from '../constants.js';

export default function BrowsePage({ papers, onView, isAdmin, onDel }) {
  const [selB, setSelB] = useState(null);
  const [selS, setSelS] = useState(null);
  const [selSubject, setSelSubject] = useState(null);
  const b = selB ? bOf(selB) : null;

  if (!selB) return (
    <div className="page-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 800, color: '#1a4fa0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '.375rem' }}>Model Answer Papers</p>
        <h2 style={{ fontSize: 'clamp(1.25rem,4vw,1.75rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a' }}>Browse by Branch</h2>
        <p style={{ color: '#64748b', fontSize: '.875rem', marginTop: '.25rem' }}>Select your engineering branch to get started</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1.125rem' }} className="branches-grid">
        {MODEL_ANSWER_BRANCHES.map((br, i) => {
          const cnt = papers.filter(p => p.branch === br.code).length;
          return (
            <div key={br.code} onClick={() => setSelB(br.code)}
              className="branch-card"
              style={{ background: '#fff', borderRadius: 20, padding: '1.25rem .875rem 1.125rem', cursor: 'pointer', textAlign: 'center', border: '2px solid #e8f0fe', boxShadow: '0 2px 12px rgba(13,50,120,.06)', transition: 'all .22s cubic-bezier(.4,0,.2,1)', animation: `fadeUp ${.25 + i * .05}s ease both`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(13,50,120,.14)'; e.currentTarget.style.background = '#f8fbff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f0fe'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,50,120,.06)'; e.currentTarget.style.background = '#fff'; }}>
              <div className="branch-icon" style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(145deg,#e8f4ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.875rem', marginBottom: '.75rem', boxShadow: '0 4px 14px rgba(26,79,160,.1)', flexShrink: 0 }}>{br.icon}</div>
              <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1, marginBottom: '.3rem' }}>{br.code}</div>
              <div className="branch-name" style={{ fontSize: '.7rem', color: '#64748b', lineHeight: 1.35, marginBottom: '.75rem', minHeight: '2rem' }}>{br.name}</div>
              <div style={{ background: '#eff6ff', color: '#1a4fa0', fontSize: '.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: 9999, border: '1.5px solid #bfdbfe', letterSpacing: '.3px', whiteSpace: 'nowrap' }}>
                {cnt > 0 ? `${cnt} papers` : 'View'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!selS) return (
    <div className="page-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <button className="back-btn" onClick={() => setSelB(null)}>← Back</button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{b.icon} {b.name}</h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.625rem' }}>
        {SEMS.map(s => (
          <button key={s} onClick={() => setSelS(s)}
            style={{ background: '#fff', border: '2px solid var(--g200)', borderRadius: 14, padding: '1rem', cursor: 'pointer', fontFamily: 'Inter', flex: '1 1 calc(33% - .5rem)', minWidth: 80, maxWidth: 160, textAlign: 'center', transition: 'all .2s', boxShadow: 'var(--sh-sm)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--g200)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: b.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--g500)', marginTop: 4 }}>Semester {s}</div>
            <div style={{ marginTop: 8, background: b.bg, color: b.dark, fontSize: '.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 9999, display: 'inline-block' }}>{papers.filter(p => p.branch === selB && p.sem === s).length} papers</div>
          </button>
        ))}
      </div>
    </div>
  );

  const filtered = papers.filter(p => p.branch === selB && p.sem === selS);
  const grouped = {};
  filtered.forEach(p => { if (!grouped[p.subject]) grouped[p.subject] = []; grouped[p.subject].push(p); });
  const subjects = Object.keys(grouped).sort();

  if (!selSubject) return (
    <div className="page-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <button className="back-btn" onClick={() => setSelS(null)}>← Back</button>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{b.icon} {b.name} — Semester {selS}</h2>
      </div>
      {subjects.length === 0
        ? <div className="empty"><div className="empty-icon">📂</div><p style={{ fontWeight: 700, color: 'var(--g600)' }}>No subjects found</p></div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(260px,100%),1fr))', gap: '1.25rem' }}>
          {subjects.map((subject, i) => {
            const sp = grouped[subject];
            return (
              <div key={subject} onClick={() => setSelSubject(subject)}
                style={{ background: '#fff', borderRadius: 22, padding: 0, cursor: 'pointer', border: '1.5px solid #e8f0fe', boxShadow: '0 4px 20px rgba(13,50,120,.08)', transition: 'all .25s cubic-bezier(.4,0,.2,1)', animation: `fadeUp ${.3 + i * .05}s ease`, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a4fa0'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(13,50,120,.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f0fe'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(13,50,120,.08)'; }}>
                <div style={{ height: 5, background: `linear-gradient(90deg,${['#1a4fa0', '#2563eb', '#0d3278', '#3b82f6', '#1e40af', '#0369a1', '#0891b2', '#7c3aed'][i % 8]},${['#60a5fa', '#93c5fd', '#3b82f6', '#6366f1', '#38bdf8', '#818cf8', '#a78bfa', '#34d399'][i % 8]})`, flexShrink: 0 }} />
                <div style={{ padding: '1.375rem 1.375rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: 18, background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(26,79,160,.12)', position: 'relative', overflow: 'hidden' }}>
                    <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                      <rect x="2" y="2" width="32" height="40" rx="4" fill="white" stroke="#bfdbfe" strokeWidth="1.2" />
                      <rect x="2" y="2" width="32" height="11" rx="4" fill={`url(#ga${i})`} />
                      <defs>
                        <linearGradient id={`ga${i}`} x1="2" y1="2" x2="34" y2="13">
                          <stop stopColor={['#1a4fa0', '#2563eb', '#0d3278', '#7c3aed', '#0369a1', '#0891b2', '#1e40af', '#3b82f6'][i % 8]} />
                          <stop offset="1" stopColor={['#60a5fa', '#93c5fd', '#3b82f6', '#a78bfa', '#38bdf8', '#6366f1', '#818cf8', '#2dd4bf'][i % 8]} />
                        </linearGradient>
                      </defs>
                      <rect x="7" y="17" width="22" height="2" rx="1" fill="#bfdbfe" />
                      <rect x="7" y="22" width="16" height="2" rx="1" fill="#dbeafe" />
                      <rect x="7" y="27" width="19" height="2" rx="1" fill="#e0f2fe" />
                      <rect x="7" y="32" width="12" height="2" rx="1" fill="#f0f9ff" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '.9375rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>{subject}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '.75rem', borderTop: '1px solid #f0f6ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                      <span style={{ color: '#475569', fontSize: '.78rem', fontWeight: 600 }}>{sp.length} Model Answer{sp.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ background: '#eff6ff', color: '#1a4fa0', fontSize: '.75rem', fontWeight: 700, padding: '5px 14px', borderRadius: 9999, border: '1.5px solid #dbeafe', whiteSpace: 'nowrap' }}>View →</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );

  const subjectPapers = grouped[selSubject] || [];
  return (
    <div className="page-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="back-btn" onClick={() => setSelSubject(null)}>← Back</button>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: 'var(--g900)' }}>{selSubject}</h2>
          <p style={{ color: 'var(--g500)', fontSize: '.875rem', marginTop: 2 }}>{b.icon} {b.name} · Semester {selS} · {subjectPapers.length} Model Answer{subjectPapers.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: '1rem' }}>
        {subjectPapers.map((p, i) => (
          <div key={p.id}
            style={{ background: '#fafbfc', borderRadius: 14, padding: '1.25rem', border: '2px solid var(--g100)', transition: 'all .25s', animation: `fadeUp ${.3 + i * .05}s ease` }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#1a4fa0aa'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fafbfc'; e.currentTarget.style.borderColor = 'var(--g100)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.875rem', gap: '.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#dbeafe', color: '#0d3278', fontSize: '.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{p.year}</span>
                <span style={{ background: 'var(--g100)', color: 'var(--g600)', fontSize: '.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>Scheme {p.scheme}</span>
                {p.season && <span style={{ background: p.season === 'Summer' ? '#fed7aa' : '#bae6fd', color: p.season === 'Summer' ? '#9a3412' : '#0c4a6e', fontSize: '.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{p.season}</span>}
              </div>
              <span style={{ color: 'var(--g400)', fontSize: '.75rem', fontFamily: 'monospace' }}>{p.code}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--g900)', marginBottom: '.875rem' }}>
              <span style={{ background: p.paperType === 'Question Paper' ? '#fef3c7' : p.paperType === 'Solving Paper' ? '#e0f2fe' : '#dcfce7', color: p.paperType === 'Question Paper' ? '#92400e' : p.paperType === 'Solving Paper' ? '#075985' : '#166534', fontSize: '.8rem', fontWeight: 700, padding: '5px 12px', borderRadius: 9999 }}>{p.paperType || 'Model Answer'}</span>
            </div>
            <div style={{ display: 'flex', gap: '.625rem', flexWrap: 'wrap' }}>
              <button onClick={() => onView(p)} style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.5rem 1rem', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '.8rem', fontFamily: 'Inter', flex: 1 }}>👁 View PDF</button>
              <a href={p.dlUrl || p.pdfUrl} target="_blank" rel="noreferrer" style={{ background: '#fff', border: '2px solid #1a4fa044', color: '#0d3278', padding: '.5rem 1rem', borderRadius: 9, fontWeight: 700, fontSize: '.8rem', textDecoration: 'none' }}>⬇</a>
              {isAdmin && <button onClick={() => onDel(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '.5rem .75rem', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: '.8rem', fontFamily: 'Inter' }}>🗑</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
