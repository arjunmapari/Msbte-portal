import { useState, useEffect } from 'react';
import { MBRANCHES, SEMS, embedUrl, schemeColor } from '../constants.js';
import { fbLoadMPdf, fbAddMPdf, fbUpdateMPdf, fbDelMPdf } from '../firebase.js';
import { toast } from '../toast.jsx';

export default function ManualPdfPage({ isAdmin }) {
  const [selB, setSelB] = useState(null);
  const [selS, setSelS] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [af, setAf] = useState({ subjectName: '', subjectCode: '', scheme: 'K', pdfFiles: [] });
  const [aBusy, setABusy] = useState(false);
  const [pdfView, setPdfView] = useState(null);
  const b = selB ? MBRANCHES.find(x => x.code === selB) : null;

  useEffect(() => {
    if (!selB || !selS) return;
    setLoading(true);
    fbLoadMPdf(selB, selS).then(list => { setSubjects(list); setLoading(false); });
  }, [selB, selS]);

  const openAdd = () => { setAf({ subjectName: '', subjectCode: '', scheme: 'K', pdfFiles: [] }); setEditItem(null); setShowAdd(true); };
  const openEdit = (item) => { setAf({ subjectName: item.subjectName || '', subjectCode: item.subjectCode || '', scheme: item.scheme || 'K', pdfFiles: item.pdfFiles || [] }); setEditItem(item); setShowAdd(true); };
  const addPdfFile = () => setAf({ ...af, pdfFiles: [...af.pdfFiles, { url: '' }] });
  const updatePdfFile = (i, v) => { const p = [...af.pdfFiles]; p[i] = { url: v }; setAf({ ...af, pdfFiles: p }); };
  const removePdfFile = (i) => { const p = [...af.pdfFiles]; p.splice(i, 1); setAf({ ...af, pdfFiles: p }); };

  const saveSubject = async () => {
    if (!af.subjectName || !af.subjectCode) { toast('Name and code required', 'e'); return; }
    setABusy(true);
    try {
      if (editItem) {
        await fbUpdateMPdf(editItem.id, { ...af, branch: selB, sem: selS });
        setSubjects(p => p.map(x => x.id === editItem.id ? { ...x, ...af } : x));
        toast('Updated!', 's');
      } else {
        const item = await fbAddMPdf({ ...af, branch: selB, sem: selS });
        setSubjects(p => [...p, item]);
        toast('Added!', 's');
      }
      setShowAdd(false); setEditItem(null);
    } catch (e) { toast(e.message, 'e'); }
    setABusy(false);
  };

  const delSubject = async (id) => {
    if (!window.confirm('Delete?')) return;
    await fbDelMPdf(id);
    setSubjects(p => p.filter(x => x.id !== id));
    toast('Deleted', 'i');
  };

  const getDlLink = url => {
    if (!url) return '';
    const m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
    return url;
  };

  if (!selB) return (
    <div className="page-wrap-sm">
      <div className="page-hd"><p className="page-hd-tag">K SCHEME - DOWNLOADABLE SUBJECT MANUALS</p><h1 className="page-hd-title">📥 Manual PDFs</h1><p className="page-hd-sub">Download subject manual PDFs — branch and semester wise</p></div>

      {/* ── How to use instruction banner ── */}
      <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1.5px solid #fcd34d', borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '.1rem' }}>💡</span>
        <div>
          <p style={{ fontWeight: 800, color: '#92400e', fontSize: '.875rem', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.5rem' }}>How to download your Manual PDF</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {[
              { n: '1', text: 'Pick your Branch below' },
              { n: '2', text: 'Select your Semester' },
              { n: '3', text: 'Choose a Subject' },
              { n: '4', text: 'Download the PDF 🎉' },
            ].map(step => (
              <div key={step.n} style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: '#fff', border: '1.5px solid #fcd34d', borderRadius: 9999, padding: '.3rem .875rem' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#f97316', color: '#fff', fontWeight: 900, fontSize: '.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.n}</span>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#78350f' }}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--g100)', boxShadow: 'var(--sh-sm)', padding: 'clamp(.875rem,3vw,1.5rem)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.875rem', marginBottom: '1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', padding: '.5rem 1.25rem', borderRadius: 9999, boxShadow: '0 4px 16px rgba(13,50,120,.25)', flexShrink: 0 }}>
            <span style={{ fontSize: '1rem' }}>🏫</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '.875rem', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '.5px' }}>Select Your Branch</span>
          </div>
          <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,#dbeafe,transparent)' }} />
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search branch e.g. CO, Civil, Computer..." />
          {searchQ && <button className="search-clear" onClick={() => setSearchQ('')}>✕</button>}
          {searchQ && (() => {
            const filtered = MBRANCHES.filter(br => br.name.toLowerCase().includes(searchQ.toLowerCase()) || br.code.toLowerCase().includes(searchQ.toLowerCase()));
            return (
              <div className="search-dropdown">
                {filtered.length === 0
                  ? <div style={{ padding: '.875rem 1rem', color: 'var(--g400)', fontSize: '.875rem', textAlign: 'center' }}>No branch found</div>
                  : filtered.map(br => (
                    <div key={br.code} className="search-item" onClick={() => { setSelB(br.code); setSearchQ(''); }}>
                      <span style={{ fontSize: '1.25rem' }}>{br.icon}</span>
                      <span style={{ fontWeight: 800, color: '#1a4fa0', fontSize: '.88rem', fontFamily: "'Space Grotesk',sans-serif", marginRight: '.375rem' }}>{br.code}</span>
                      <span style={{ color: 'var(--g600)', fontSize: '.85rem' }}>{br.name}</span>
                    </div>
                  ))}
              </div>
            );
          })()}
        </div>
        {!searchQ && <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(140px,45%),1fr))', gap: '.75rem' }}>
          {MBRANCHES.map((br, i) => (
            <div key={br.code} onClick={() => setSelB(br.code)}
              style={{ background: 'linear-gradient(135deg,#f8fafc,#eff6ff)', borderRadius: 14, padding: '1.125rem .875rem', cursor: 'pointer', textAlign: 'center', border: '2px solid var(--g100)', transition: 'all .2s', animation: `fadeUp ${.3 + i * .07}s ease` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#dbeafe,#bfdbfe)'; e.currentTarget.style.borderColor = '#1a4fa0'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#f8fafc,#eff6ff)'; e.currentTarget.style.borderColor = 'var(--g100)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto .625rem' }}>{br.icon}</div>
              <div style={{ fontWeight: 800, color: '#0d3278', fontSize: '.875rem', fontFamily: "'Space Grotesk',sans-serif" }}>{br.code}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--g500)', marginTop: 3 }}>{br.name}</div>
              <div style={{ marginTop: '.5rem', background: '#dbeafe', color: '#0d3278', fontSize: '.62rem', fontWeight: 700, padding: '3px 9px', borderRadius: 9999, display: 'inline-block' }}>6 Sems</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );

  if (!selS) return (
    <div className="page-wrap-sm">
      <div className="page-hd"><p className="page-hd-tag">K SCHEME - DOWNLOADABLE SUBJECT MANUALS</p><h1 className="page-hd-title">📥 Manual PDFs</h1></div>
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, hsl(${210 + i * 15},85%,45%), hsl(${220 + i * 15},80%,60%))`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .875rem', boxShadow: '0 4px 12px rgba(26,79,160,.15)' }}>
              <span style={{ fontWeight: 900, fontSize: '1.375rem', color: '#0d3278', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{s}</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.0625rem', color: '#0f172a', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.25rem' }}>Semester {s}</div>
            <div style={{ fontSize: '.72rem', color: '#64748b', fontWeight: 600, letterSpacing: '.3px' }}>
              {s <= 2 ? '1st Year' : s <= 4 ? '2nd Year' : '3rd Year'}
            </div>
            <div style={{ marginTop: '.875rem', display: 'inline-flex', alignItems: 'center', gap: '.3rem', background: '#eff6ff', color: '#1a4fa0', fontSize: '.72rem', fontWeight: 700, padding: '4px 14px', borderRadius: 9999, border: '1.5px solid #bfdbfe' }}>
              View PDFs →
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
            <div style={{ flex: 1, minHeight: 500, background: '#374151' }}><iframe src={embedUrl(pdfView.url)} style={{ width: '100%', height: '100%', minHeight: 500, border: 'none' }} title={pdfView.title} allowFullScreen /></div>
          </div>
        </div>
      )}
      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div><div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif" }}>{editItem ? 'Edit Subject PDF' : 'Add Subject PDF'}</div></div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1/3' }}><label className="form-label">Subject Name *</label><input className="form-input" value={af.subjectName || ''} onChange={e => setAf({ ...af, subjectName: e.target.value })} placeholder="e.g. Data Structures Using C" /></div>
                <div><label className="form-label">Subject Code *</label><input className="form-input" value={af.subjectCode || ''} onChange={e => setAf({ ...af, subjectCode: e.target.value })} placeholder="e.g. 22317" /></div>
                <div><label className="form-label">Scheme</label><select className="form-select" value={af.scheme || 'K'} onChange={e => setAf({ ...af, scheme: e.target.value })}>{['K', 'I', 'J', 'G'].map(o => <option key={o}>{o}</option>)}</select></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                <label style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--g700)' }}>PDF Files</label>
                <button onClick={addPdfFile} style={{ background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#0d3278', border: 'none', padding: '.4rem .875rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.8rem' }}>+ Add PDF</button>
              </div>
              {(af.pdfFiles || []).length === 0 && <div style={{ background: 'var(--g50)', border: '2px dashed var(--g200)', borderRadius: 12, padding: '1.5rem', textAlign: 'center', color: 'var(--g400)' }}><div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📄</div><p style={{ fontSize: '.875rem', fontWeight: 600 }}>No PDFs added yet</p></div>}
              {(af.pdfFiles || []).map((f, i) => (
                <div key={i} style={{ background: 'var(--g50)', border: '2px solid var(--g200)', borderRadius: 12, padding: '1rem', marginBottom: '.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.625rem' }}><span style={{ fontWeight: 700, fontSize: '.85rem', color: '#0d3278' }}>PDF {i + 1}</span><button onClick={() => removePdfFile(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '2px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '.75rem', fontWeight: 700 }}>Remove</button></div>
                  <input className="form-input" value={f.url || ''} onChange={e => updatePdfFile(i, e.target.value)} placeholder="Google Drive URL" />
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
          <div><h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{b.icon} {b.name} — Semester {selS}</h2><p style={{ color: 'var(--g500)', fontSize: '.875rem', marginTop: 2 }}>{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p></div>
        </div>
        {isAdmin && <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', padding: '.75rem 1.5rem', borderRadius: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.9rem' }}>+ Add Subject PDF</button>}
      </div>
      {loading
        ? <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /><p style={{ color: 'var(--g400)', marginTop: '1rem' }}>Loading...</p></div>
        : subjects.length === 0
          ? <div className="empty"><div className="empty-icon">📥</div><p style={{ fontWeight: 700, color: 'var(--g600)' }}>No manual PDFs yet</p><p style={{ color: 'var(--g400)', fontSize: '.875rem', marginTop: '.5rem' }}>{isAdmin ? 'Click "+ Add Subject PDF" above.' : 'Check back later.'}</p></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {subjects.map((item, idx) => {
              const pdfCount = (item.pdfFiles || []).length;
              const sc = schemeColor(item.scheme || 'K');
              return (
                <div key={item.id} style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${sc[2]}`, boxShadow: `0 2px 12px ${sc[1]}14`, overflow: 'hidden', transition: 'all .3s', animation: 'fadeUp .3s ease both', animationDelay: `${idx * 40}ms` }} onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${sc[1]}28`} onMouseLeave={e => e.currentTarget.style.boxShadow = `0 2px 12px ${sc[1]}14`}>
                  <div style={{ height: 4, background: `linear-gradient(90deg,${sc[0]},${sc[1]},#f97316)` }} />
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap' }}>
                    <div style={{ width: 72, background: `linear-gradient(160deg,${sc[0]},${sc[1]})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '.75rem .4rem', flexShrink: 0 }}>
                      <div style={{ fontSize: '.38rem', fontWeight: 800, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1, textAlign: 'center' }}>{item.scheme || 'K'} SCH</div>
                      <div style={{ fontSize: '.82rem', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginTop: 4, textAlign: 'center' }}>{item.subjectCode}</div>
                      <div style={{ width: 28, height: 1.5, background: 'rgba(255,255,255,.25)', borderRadius: 2, margin: '4px auto' }} />
                      <div style={{ fontSize: '.35rem', fontWeight: 700, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: '.8px', textAlign: 'center' }}>MANUAL</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 150, padding: '.875rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: `1px solid ${sc[2]}` }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--g900)', lineHeight: 1.25, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.4rem' }}>{item.subjectName}</h3>
                      <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ background: sc[2], color: sc[0], fontSize: '.65rem', fontWeight: 800, padding: '2px 9px', borderRadius: 9999, border: `1px solid ${sc[3]}` }}>{item.scheme || 'K'} Scheme</span>
                        <span style={{ background: pdfCount > 0 ? '#dcfce7' : '#fef9c3', color: pdfCount > 0 ? '#166534' : '#854d0e', fontSize: '.65rem', fontWeight: 700, padding: '2px 9px', borderRadius: 9999 }}>{pdfCount > 0 ? `✅ ${pdfCount} PDF${pdfCount > 1 ? 's' : ''}` : '⏳ Pending'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '.75rem 1rem', gap: '.5rem', minWidth: 220, flex: '0 0 auto' }}>
                      {pdfCount > 0
                        ? (item.pdfFiles || []).map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: sc[4], borderRadius: 12, padding: '.5rem .75rem', border: `1px solid ${sc[3]}`, transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.background = sc[2]} onMouseLeave={e => e.currentTarget.style.background = sc[4]}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${sc[0]},${sc[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>📄</div>
                            <span style={{ flex: 1, fontSize: '.78rem', fontWeight: 700, color: sc[0] }}>Manual PDF {i + 1}</span>
                            <button onClick={() => setPdfView({ title: item.subjectName, url: f.url })} style={{ background: `linear-gradient(135deg,${sc[0]},${sc[1]})`, color: '#fff', border: 'none', padding: '.35rem .75rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.72rem', whiteSpace: 'nowrap' }}>👁 View</button>
                            <a href={getDlLink(f.url)} target="_blank" rel="noreferrer" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', padding: '.35rem .75rem', borderRadius: 8, fontWeight: 700, fontSize: '.72rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>⬇</a>
                          </div>
                        ))
                        : <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', background: '#f8fafc', borderRadius: 12, padding: '.625rem .875rem', border: '1px dashed var(--g200)' }}><span style={{ fontSize: '1.1rem' }}>📭</span><span style={{ fontSize: '.78rem', color: 'var(--g400)', fontWeight: 600 }}>{isAdmin ? 'No PDFs yet — click Edit' : 'PDF coming soon'}</span></div>
                      }
                    </div>
                    {isAdmin && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '.375rem', padding: '.75rem .875rem', borderLeft: `1px solid ${sc[2]}`, background: `${sc[4]}66`, flexShrink: 0 }}>
                      <button onClick={() => openEdit(item)} style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', padding: '.375rem .75rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>✏️ Edit</button>
                      <button onClick={() => delSubject(item.id)} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '.375rem .75rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>🗑 Delete</button>
                    </div>}
                  </div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}
