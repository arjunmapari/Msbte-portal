import { useState, useEffect } from 'react';
import { MBRANCHES, SEMS, embedUrl } from '../constants.js';
import { fbLoadManual, fbAddManual, fbUpdateManual, fbDelManual } from '../firebase.js';
import { toast } from '../toast.jsx';

export default function ManualPage({ isAdmin }) {
  const [selB, setSelB] = useState(null);
  const [selS, setSelS] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selSubject, setSelSubject] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [af, setAf] = useState({ subject: '', code: '', description: '', scheme: 'K', date: '', practicals: [] });
  const [aBusy, setABusy] = useState(false);
  const [pdfView, setPdfView] = useState(null);
  const [inlinePrs, setInlinePrs] = useState(null);
  const b = selB ? MBRANCHES.find(x => x.code === selB) : null;

  useEffect(() => {
    if (!selB || !selS) return;
    setLoading(true);
    fbLoadManual(selB, selS).then(list => { setSubjects(list); setLoading(false); });
  }, [selB, selS]);

  const openAdd = () => { setAf({ subject: '', code: '', description: '', scheme: 'K', date: '', practicals: [] }); setEditItem(null); setShowAdd(true); };
  const openEdit = (item) => { setAf({ subject: item.subject || '', code: item.code || '', description: item.description || '', scheme: item.scheme || 'K', date: item.date || '', practicals: item.practicals || [] }); setEditItem(item); setShowAdd(true); };

  const saveSubject = async () => {
    if (!af.subject) { toast('Subject name required', 'e'); return; }
    setABusy(true);
    try {
      if (editItem) {
        await fbUpdateManual(editItem.id, { ...af, branch: selB, sem: selS });
        setSubjects(p => p.map(x => x.id === editItem.id ? { ...x, ...af } : x));
        toast('Updated!', 's');
      } else {
        const item = await fbAddManual({ ...af, branch: selB, sem: selS });
        setSubjects(p => [...p, item]);
        toast('Added!', 's');
      }
      setShowAdd(false); setEditItem(null);
    } catch (e) { toast(e.message, 'e'); }
    setABusy(false);
  };

  const delSubject = async (id) => {
    if (!window.confirm('Delete?')) return;
    await fbDelManual(id);
    setSubjects(p => p.filter(x => x.id !== id));
    if (selSubject && selSubject.id === id) setSelSubject(null);
    toast('Deleted', 'i');
  };

  const addPractical = () => setAf({ ...af, practicals: [...af.practicals, { title: '', pdfUrl: '', dlUrl: '' }] });
  const updPractical = (i, k, v) => { const p = [...af.practicals]; p[i] = { ...p[i], [k]: v }; setAf({ ...af, practicals: p }); };
  const delPractical = (i) => { const p = [...af.practicals]; p.splice(i, 1); setAf({ ...af, practicals: p }); };

  const startInline = (item) => setInlinePrs({ id: item.id, prs: [...(item.practicals || []).map(p => ({ ...p }))], saving: false });
  const addInlinePr = () => setInlinePrs(p => ({ ...p, prs: [...p.prs, { title: '', pdfUrl: '' }] }));
  const updInlinePr = (i, k, v) => setInlinePrs(p => { const prs = [...p.prs]; prs[i] = { ...prs[i], [k]: v }; return { ...p, prs }; });
  const delInlinePr = (i) => setInlinePrs(p => { const prs = [...p.prs]; prs.splice(i, 1); return { ...p, prs }; });

  const saveInlinePrs = async () => {
    setInlinePrs(p => ({ ...p, saving: true }));
    try {
      await fbUpdateManual(inlinePrs.id, { practicals: inlinePrs.prs });
      setSubjects(prev => prev.map(x => x.id === inlinePrs.id ? { ...x, practicals: inlinePrs.prs } : x));
      setSelSubject(prev => ({ ...prev, practicals: inlinePrs.prs }));
      setInlinePrs(null);
      toast('Practicals saved!', 's');
    } catch (e) { toast(e.message, 'e'); setInlinePrs(p => ({ ...p, saving: false })); }
  };

  if (!selB) return (
    <div className="page-wrap-sm">
      <div style={{ background: 'linear-gradient(100deg,#0d3278,#1a4fa0)', borderRadius: 20, padding: '1.5rem 1.75rem', marginBottom: '1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.07)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '.65rem', fontWeight: 800, color: '#fed7aa', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '.5rem' }}>K SCHEME — PRACTICAL MANUAL ANSWERS</p>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.2rem,3vw,1.625rem)', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.375rem' }}>📖 Manual Answer Papers</h1>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.875rem', marginBottom: '1.25rem' }}>K Scheme practical manual answers — branch and semester wise</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.875rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', padding: '.5rem 1.25rem', borderRadius: 9999, boxShadow: '0 4px 16px rgba(13,50,120,.25)', flexShrink: 0 }}>
          <span style={{ fontSize: '1rem' }}>🏫</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '.875rem', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '.5px' }}>Select Your Branch</span>
        </div>
        <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,#dbeafe,transparent)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(180px,45%),1fr))', gap: '1rem' }}>
        {MBRANCHES.map((br, i) => (
          <div key={br.code} onClick={() => setSelB(br.code)}
            style={{ background: '#fff', borderRadius: 20, padding: '1.5rem 1rem', cursor: 'pointer', textAlign: 'center', border: '2px solid #eef2ff', boxShadow: '0 2px 12px rgba(13,50,120,.06)', transition: 'all .22s', animation: `fadeUp ${.25 + i * .07}s ease both` }}
            onMouseEnter={e => { e.currentTarget.style.border = '2px solid #93c5fd'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,50,120,.14)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = '2px solid #eef2ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,50,120,.06)'; }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.875rem', margin: '0 auto .875rem', boxShadow: '0 4px 12px rgba(26,79,160,.12)' }}>{br.icon}</div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.25rem' }}>{br.code}</div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.625rem', lineHeight: 1.3 }}>{br.name}</div>
            <span style={{ background: '#eff6ff', color: '#1a4fa0', fontSize: '.7rem', fontWeight: 700, padding: '3px 12px', borderRadius: 9999, border: '1px solid #bfdbfe' }}>6 Sems</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (!selS) return (
    <div className="page-wrap-sm">
      <div className="page-hd"><p className="page-hd-tag">K SCHEME — PRACTICAL MANUAL ANSWERS</p><h1 className="page-hd-title">📖 Manual Answer Papers</h1></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className="back-btn" onClick={() => setSelB(null)}>← Back</button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{b.icon} {b.name}</h2>
      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.875rem', marginBottom: '1.5rem' }}>
        <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,#dbeafe,transparent)' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', padding: '.5rem 1.25rem', borderRadius: 9999, boxShadow: '0 4px 16px rgba(13,50,120,.25)' }}>
          <span style={{ fontSize: '1rem' }}>📅</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '.875rem', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '.5px' }}>Select Your Semester</span>
        </div>
        <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,transparent,#dbeafe)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }} className="sem-grid">
        {SEMS.map((s, i) => (
          <button key={s} onClick={() => setSelS(s)}
            style={{ background: '#fff', border: '2px solid #e8f0fe', borderRadius: 18, padding: '1.5rem 1rem', cursor: 'pointer', fontFamily: 'Inter', textAlign: 'center', transition: 'all .22s cubic-bezier(.4,0,.2,1)', boxShadow: '0 2px 12px rgba(13,50,120,.07)', animation: `fadeUp ${.2 + i * .07}s ease both`, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a4fa0'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(13,50,120,.18)'; e.currentTarget.style.background = '#f0f6ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f0fe'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,50,120,.07)'; e.currentTarget.style.background = '#fff'; }}>
            {/* Decorative top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, hsl(${210 + i * 15},85%,45%), hsl(${220 + i * 15},80%,60%))`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .875rem', boxShadow: '0 4px 12px rgba(26,79,160,.15)' }}>
              <span style={{ fontWeight: 900, fontSize: '1.375rem', color: '#0d3278', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{s}</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.0625rem', color: '#0f172a', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.25rem' }}>Semester {s}</div>
            <div style={{ fontSize: '.72rem', color: '#64748b', fontWeight: 600, letterSpacing: '.3px' }}>
              {s <= 2 ? '1st Year' : s <= 4 ? '2nd Year' : '3rd Year'}
            </div>
            <div style={{ marginTop: '.875rem', display: 'inline-flex', alignItems: 'center', gap: '.3rem', background: '#eff6ff', color: '#1a4fa0', fontSize: '.72rem', fontWeight: 700, padding: '4px 14px', borderRadius: 9999, border: '1.5px solid #bfdbfe' }}>
              View Subjects →
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-wrap-sm">
      {pdfView && (
        <div className="overlay" onClick={() => setPdfView(null)}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 900, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--sh-xl)' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(100deg,#0d3278,#1a4fa0)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700 }}>{pdfView.title}</div>
              <button onClick={() => setPdfView(null)} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div style={{ flex: 1, minHeight: 500, background: '#374151' }}><iframe src={embedUrl(pdfView.url)} style={{ width: '100%', height: '100%', minHeight: 500, border: 'none' }} title={pdfView.title} /></div>
          </div>
        </div>
      )}
      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div><div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif" }}>{editItem ? '✏️ Edit Subject' : '➕ Add Subject'}</div><div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', marginTop: 2 }}>{b.icon} {b.name} · Semester {selS}</div></div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1/3' }}><label className="form-label">Subject Name *</label><input className="form-input" value={af.subject} onChange={e => setAf({ ...af, subject: e.target.value })} placeholder="e.g. Data Structures" /></div>
                <div><label className="form-label">Subject Code</label><input className="form-input" value={af.code} onChange={e => setAf({ ...af, code: e.target.value })} placeholder="e.g. 22317" /></div>
                <div><label className="form-label">Scheme</label><select className="form-select" value={af.scheme} onChange={e => setAf({ ...af, scheme: e.target.value })}>{['K', 'I', 'J', 'G'].map(o => <option key={o}>{o}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: '1rem' }}><label className="form-label">Description</label><input className="form-input" value={af.description} onChange={e => setAf({ ...af, description: e.target.value })} placeholder="Brief description" /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                <label style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--g700)' }}>Practicals</label>
                <button onClick={addPractical} style={{ background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#0d3278', border: 'none', padding: '.4rem .875rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.8rem' }}>+ Add</button>
              </div>
              {af.practicals.map((pr, i) => (
                <div key={i} style={{ background: 'var(--g50)', border: '2px solid var(--g200)', borderRadius: 12, padding: '1rem', marginBottom: '.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.625rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '.85rem', color: '#0d3278' }}>Practical {i + 1}</span>
                    <button onClick={() => delPractical(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '2px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '.75rem', fontWeight: 700 }}>Remove</button>
                  </div>
                  <input className="form-input" value={pr.title} onChange={e => updPractical(i, 'title', e.target.value)} placeholder="Practical title" style={{ marginBottom: '.5rem' }} />
                  <input className="form-input" value={pr.pdfUrl} onChange={e => updPractical(i, 'pdfUrl', e.target.value)} placeholder="PDF URL (Google Drive)" style={{ marginBottom: '.5rem' }} />
                  <input className="form-input" value={pr.dlUrl} onChange={e => updPractical(i, 'dlUrl', e.target.value)} placeholder="Download URL (optional)" />
                </div>
              ))}
            </div>
            <div className="modal-ft">
              <button onClick={saveSubject} disabled={aBusy} style={{ flex: 1, background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', opacity: aBusy ? .6 : 1 }}>{aBusy ? 'Saving...' : editItem ? 'Save Changes' : 'Add Subject'}</button>
              <button onClick={() => setShowAdd(false)} style={{ background: 'var(--g100)', color: 'var(--g700)', border: 'none', padding: '.875rem 1.5rem', borderRadius: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="back-btn" onClick={() => setSelS(null)}>← Back</button>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{b.icon} {b.name} — Semester {selS}</h2>
            <p style={{ color: 'var(--g500)', fontSize: '.875rem', marginTop: 2 }}>{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {isAdmin && <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', padding: '.75rem 1.5rem', borderRadius: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.9rem' }}>+ Add Subject</button>}
      </div>
      {loading
        ? <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /><p style={{ color: 'var(--g400)', marginTop: '1rem' }}>Loading...</p></div>
        : subjects.length === 0
          ? <div className="empty"><div className="empty-icon">📖</div><p style={{ fontWeight: 700, color: 'var(--g600)' }}>No subjects yet</p><p style={{ color: 'var(--g400)', fontSize: '.875rem', marginTop: '.5rem' }}>{isAdmin ? 'Click "+ Add Subject" above.' : 'Check back later.'}</p></div>
          : selSubject
            ? <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button className="back-btn" onClick={() => { setSelSubject(null); setInlinePrs(null); }}>← Back to Subjects</button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: 'var(--g900)', lineHeight: 1.3 }}>{selSubject.subject}</h2>
                  <p style={{ color: 'var(--g500)', fontSize: '.8rem', marginTop: 3 }}>{b && b.icon} {b && b.name} · Semester {selS}</p>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(13,50,120,.08)', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                  <div style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', borderRadius: 12, padding: '.75rem 1rem', flexShrink: 0, textAlign: 'center', minWidth: 96 }}>
                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.45rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1 }}>K SCHEME</p>
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: '.9rem', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.2, margin: '3px 0' }}>{selSubject.code}</p>
                    <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.42rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>MANUAL ANS</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 'clamp(.875rem,2vw,1.0625rem)', color: '#0f172a', lineHeight: 1.3 }}>{selSubject.code} — {selSubject.subject}</p>
                    <p style={{ color: '#64748b', fontSize: '.78rem', marginTop: 2 }}>Manual Answer</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', flexShrink: 0 }}>
                    {isAdmin && <button onClick={() => delSubject(selSubject.id)} style={{ background: '#fff0f0', color: '#dc2626', border: '1.5px solid #fca5a5', padding: '.375rem .75rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.78rem', fontFamily: 'Inter' }}>Del</button>}
                    <span style={{ color: '#64748b', fontSize: '.82rem', fontWeight: 600 }}>{(selSubject.practicals || []).length} Practical{(selSubject.practicals || []).length !== 1 ? 's' : ''}</span>
                    {isAdmin && !inlinePrs && <button onClick={() => startInline(selSubject)} style={{ background: 'none', border: 'none', color: '#1a4fa0', fontWeight: 700, cursor: 'pointer', fontSize: '.82rem', fontFamily: 'Inter', textDecoration: 'underline', textDecorationColor: '#bfdbfe', textUnderlineOffset: 3 }}>✎ Edit practicals</button>}
                    {inlinePrs && <button onClick={() => setInlinePrs(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '.78rem', fontFamily: 'Inter' }}>▲ Hide</button>}
                  </div>
                </div>
                {inlinePrs && (
                  <div style={{ padding: '1rem 1.25rem', background: '#fafbff', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem', marginBottom: '.875rem' }}>
                      {inlinePrs.prs.map((pr, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '.625rem', background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '.625rem .875rem', flexWrap: 'wrap' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '.78rem', flexShrink: 0 }}>{j + 1}</div>
                          <input value={pr.title} onChange={e => updInlinePr(j, 'title', e.target.value)} placeholder={`Practical ${j + 1} title`} style={{ flex: 2, minWidth: 120, padding: '.45rem .75rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.82rem', fontFamily: 'Inter', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#1a4fa0'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                          <input value={pr.pdfUrl} onChange={e => updInlinePr(j, 'pdfUrl', e.target.value)} placeholder="Google Drive PDF URL" style={{ flex: 3, minWidth: 160, padding: '.45rem .75rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.82rem', fontFamily: 'Inter', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#1a4fa0'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                          <button onClick={() => delInlinePr(j)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🗑</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addInlinePr} style={{ width: '100%', background: 'none', border: '2px dashed #c7d7fe', color: '#6366f1', padding: '.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', marginBottom: '.875rem' }} onMouseEnter={e => { e.currentTarget.style.background = '#eff0ff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>+ Add Practical</button>
                    <div style={{ display: 'flex', gap: '.625rem' }}>
                      <button onClick={saveInlinePrs} disabled={inlinePrs.saving} style={{ flex: 1, background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.75rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.9rem', opacity: inlinePrs.saving ? .6 : 1 }}>{inlinePrs.saving ? 'Saving...' : '💾 Save Practicals'}</button>
                      <button onClick={() => setInlinePrs(null)} style={{ background: 'var(--g100)', color: 'var(--g700)', border: 'none', padding: '.75rem 1.25rem', borderRadius: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>Cancel</button>
                    </div>
                  </div>
                )}
                {(selSubject.practicals || []).length === 0 && !inlinePrs
                  ? <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--g400)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔬</p>
                    <p style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--g600)', marginBottom: '.375rem' }}>No practicals yet</p>
                    {isAdmin && <button onClick={() => startInline(selSubject)} style={{ marginTop: '.75rem', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.625rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.85rem' }}>➕ Add Practicals</button>}
                  </div>
                  : (selSubject.practicals || []).map((pr, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.5rem', borderBottom: j < (selSubject.practicals || []).length - 1 ? '1px solid #f1f5f9' : 'none', background: '#fff', transition: 'background .15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fbff'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4fa0', fontWeight: 800, fontSize: '.875rem', flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif" }}>{j + 1}</div>
                      <p style={{ flex: 1, fontWeight: 600, fontSize: 'clamp(.875rem,2vw,1rem)', color: '#1e293b', lineHeight: 1.5, minWidth: 0 }}>{pr.title || `Practical ${j + 1}`}</p>
                      {pr.pdfUrl
                        ? <button onClick={() => setPdfView({ title: pr.title || `Practical ${j + 1}`, url: pr.pdfUrl })} style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.55rem 1.375rem', borderRadius: 9999, fontWeight: 700, cursor: 'pointer', fontSize: 'clamp(.78rem,1.8vw,.9rem)', fontFamily: 'Inter', whiteSpace: 'nowrap', flexShrink: 0 }}>👁 View PDF</button>
                        : <span style={{ color: '#cbd5e1', fontSize: '.75rem', fontWeight: 600, flexShrink: 0 }}>—</span>
                      }
                    </div>
                  ))
                }
              </div>
            </div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: '1.125rem' }}>
              {subjects.map((item, i) => (
                <div key={item.id} onClick={() => setSelSubject(item)}
                  style={{ background: '#fff', borderRadius: 20, padding: '1.375rem', border: '2px solid #eef2ff', boxShadow: '0 2px 12px rgba(13,50,120,.06)', cursor: 'pointer', transition: 'all .2s cubic-bezier(.4,0,.2,1)', animation: `fadeUp ${.25 + i * .06}s ease both`, display: 'flex', flexDirection: 'column', gap: '.875rem' }}
                  onMouseEnter={e => { e.currentTarget.style.border = '2px solid #93c5fd'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,50,120,.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '2px solid #eef2ff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,50,120,.06)'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.875rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📖</div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', lineHeight: 1.3, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.2rem' }}>{item.subject}</h3>
                      <p style={{ color: '#64748b', fontSize: '.75rem', fontWeight: 600 }}>Code: {item.code}</p>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '.82rem' }}>Manual Answer</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ color: '#334155', fontSize: '.875rem', fontWeight: 700 }}>{(item.practicals || []).length} practical{(item.practicals || []).length !== 1 ? 's' : ''}</span>
                    <div style={{ background: '#eff6ff', color: '#1a4fa0', fontSize: '.82rem', fontWeight: 700, padding: '.4rem 1.125rem', borderRadius: 9999, border: '1.5px solid #bfdbfe' }}>View →</div>
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '.5rem', paddingTop: '.625rem', borderTop: '1px solid #f1f5f9' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEdit(item)} style={{ flex: 1, background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', padding: '.375rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter' }}>✏️ Edit</button>
                      <button onClick={() => delSubject(item.id)} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '.375rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter' }}>🗑 Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
      }
    </div>
  );
}
