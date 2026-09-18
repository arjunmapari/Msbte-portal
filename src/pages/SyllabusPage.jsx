import { useState, useEffect } from 'react';
import { SYLLABUS_BRANCHES, SEMS } from '../constants.js';
import { fbLoadSyl, fbAddSyl, fbDelSyl, fbUpdateSyl } from '../firebase.js';
import { toast } from '../toast.jsx';

export default function SyllabusPage({ isAdmin }) {
  const [selB, setSelB] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [allData, setAllData] = useState({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [selSubject, setSelSubject] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [addSem, setAddSem] = useState(1);
  const [af, setAf] = useState({ subjectName: '', subjectCode: '', scheme: 'K', pdfUrl: '', dlUrl: '' });
  const [aBusy, setABusy] = useState(false);
  const b = selB ? SYLLABUS_BRANCHES.find(x => x.code === selB) : null;

  const embed = url => {
    if (!url) return '';
    const m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  useEffect(() => {
    if (!selB) { setAllData({}); return; }
    setLoadingAll(true);
    Promise.all(SEMS.map(s => fbLoadSyl(selB, s).then(list => ({ s, list })))).then(results => {
      const d = {};
      results.forEach(({ s, list }) => d[s] = list);
      setAllData(d);
      setLoadingAll(false);
    });
  }, [selB]);

  const reloadSem = async (s) => {
    const list = await fbLoadSyl(selB, s);
    setAllData(p => ({ ...p, [s]: list }));
  };

  const openAdd = (sem) => { setAf({ subjectName: '', subjectCode: '', scheme: 'K', pdfUrl: '', dlUrl: '' }); setAddSem(sem); setEditItem(null); setShowAdd(true); };
  const openEdit = (item) => { setAf({ subjectName: item.subjectName || '', subjectCode: item.subjectCode || '', scheme: item.scheme || 'K', pdfUrl: item.pdfUrl || '', dlUrl: item.dlUrl || '' }); setEditItem(item); setAddSem(item.sem); setShowAdd(true); };

  const saveSubject = async () => {
    if (!af.subjectName || !af.subjectCode) { toast('Name and code required', 'e'); return; }
    setABusy(true);
    try {
      if (editItem) {
        await fbUpdateSyl(editItem.id, { ...af, branch: selB, sem: editItem.sem });
        await reloadSem(editItem.sem);
        if (selSubject && selSubject.id === editItem.id) setSelSubject({ ...selSubject, ...af });
        toast('Updated!', 's');
      } else {
        await fbAddSyl({ ...af, branch: selB, sem: addSem });
        await reloadSem(addSem);
        toast('Added!', 's');
      }
      setShowAdd(false); setEditItem(null);
    } catch (e) { toast(e.message, 'e'); }
    setABusy(false);
  };

  const delSubject = async (item) => {
    if (!window.confirm('Delete?')) return;
    await fbDelSyl(item.id);
    await reloadSem(item.sem);
    if (selSubject && selSubject.id === item.id) setSelSubject(null);
    toast('Deleted', 'i');
  };

  return (
    <div className="page-wrap-sm">
      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div><div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif" }}>{editItem ? '✏️ Edit Subject' : '➕ Add Subject'}</div><div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', marginTop: 2 }}>{b && b.icon} {b && b.name} · Semester {addSem}</div></div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label className="form-label">Subject Name *</label><input className="form-input" value={af.subjectName} onChange={e => setAf({ ...af, subjectName: e.target.value })} placeholder="e.g. Data Structures Using C" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="form-label">Subject Code *</label><input className="form-input" value={af.subjectCode} onChange={e => setAf({ ...af, subjectCode: e.target.value })} placeholder="e.g. 22317" /></div>
                <div><label className="form-label">Scheme</label><select className="form-select" value={af.scheme} onChange={e => setAf({ ...af, scheme: e.target.value })}>{['K', 'I', 'J', 'G'].map(o => <option key={o}>{o}</option>)}</select></div>
              </div>
              <div style={{ background: '#f0f7ff', border: '2px solid #bfdbfe', borderRadius: 12, padding: '1rem' }}>
                <label className="form-label" style={{ color: '#0d3278' }}>📄 View PDF URL</label>
                <input className="form-input" value={af.pdfUrl} onChange={e => setAf({ ...af, pdfUrl: e.target.value })} placeholder="https://drive.google.com/file/d/xxx/view" />
              </div>
              <div style={{ background: '#fff7ed', border: '2px solid #fed7aa', borderRadius: 12, padding: '1rem' }}>
                <label className="form-label" style={{ color: '#92400e' }}>⬇ Download PDF URL</label>
                <input className="form-input" value={af.dlUrl} onChange={e => setAf({ ...af, dlUrl: e.target.value })} placeholder="https://drive.google.com/uc?export=download&id=xxx" />
              </div>
            </div>
            <div className="modal-ft">
              <button onClick={saveSubject} disabled={aBusy} style={{ flex: 1, background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', opacity: aBusy ? .6 : 1 }}>{aBusy ? 'Saving...' : editItem ? 'Save Changes' : 'Add Subject'}</button>
              <button onClick={() => setShowAdd(false)} style={{ background: 'var(--g100)', color: 'var(--g700)', border: 'none', padding: '.875rem 1.5rem', borderRadius: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selSubject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#0f172a', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
          <div style={{ background: 'linear-gradient(100deg,#0d3278,#1a4fa0)', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', minWidth: 0, flex: 1 }}>
              <button onClick={() => setSelSubject(null)} style={{ background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.4)', color: '#fff', padding: '.45rem 1rem', borderRadius: 9, fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>← Back</button>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selSubject.subjectName}</p>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.72rem', marginTop: 1 }}>{b && b.icon} {b && b.name} · Sem {selSubject.sem} · {selSubject.subjectCode}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.375rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {isAdmin && <button onClick={() => openEdit(selSubject)} style={{ background: '#fef3c7', color: '#92400e', border: 'none', padding: '.4rem .75rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '.75rem', fontFamily: 'Inter' }}>✏️</button>}
              {(selSubject.dlUrl || selSubject.pdfUrl) && <a href={selSubject.dlUrl || selSubject.pdfUrl} target="_blank" rel="noreferrer" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', padding: '.4rem .75rem', borderRadius: 8, fontWeight: 700, fontSize: '.75rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>⬇</a>}
              <a href={selSubject.pdfUrl} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '.4rem .75rem', borderRadius: 8, fontWeight: 700, fontSize: '.75rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>↗ Open</a>
            </div>
          </div>
          {selSubject.pdfUrl
            ? <iframe key={selSubject.id + '_v'} src={embed(selSubject.pdfUrl)} style={{ flex: 1, width: '100%', border: 'none', display: 'block', background: '#1e293b' }} title={selSubject.subjectName} allowFullScreen loading="lazy" />
            : <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '.875rem' }}>
              <p style={{ fontSize: '3rem' }}>📄</p>
              <p style={{ fontWeight: 700, fontSize: '1.125rem' }}>No PDF uploaded yet</p>
              <p style={{ opacity: .5, fontSize: '.875rem' }}>{isAdmin ? 'Use ✏️ Edit to add a PDF URL.' : 'Check back later.'}</p>
              <button onClick={() => setSelSubject(null)} style={{ marginTop: '.5rem', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '.625rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' }}>← Go Back</button>
            </div>
          }
        </div>
      )}

      <div className="page-hd"><p className="page-hd-tag">MSBTE K SCHEME</p><h1 className="page-hd-title">📋 Syllabus</h1><p className="page-hd-sub">Select your branch to view subject-wise syllabus for all semesters</p></div>

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
            const filtered = SYLLABUS_BRANCHES.filter(br => br.name.toLowerCase().includes(searchQ.toLowerCase()) || br.code.toLowerCase().includes(searchQ.toLowerCase()));
            return (
              <div className="search-dropdown">
                {filtered.length === 0
                  ? <div style={{ padding: '.875rem 1rem', color: 'var(--g400)', fontSize: '.875rem', textAlign: 'center' }}>No branch found</div>
                  : filtered.map(br => (
                    <div key={br.code} className="search-item" onClick={() => { setSelB(br.code); setSearchQ(''); setSelSubject(null); }}>
                      <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{br.icon}</span>
                      <span style={{ fontWeight: 800, color: '#1a4fa0', fontSize: '.88rem', fontFamily: "'Space Grotesk',sans-serif", marginRight: '.375rem' }}>{br.code}</span>
                      <span style={{ color: 'var(--g600)', fontSize: '.85rem' }}>{br.name}</span>
                    </div>
                  ))}
              </div>
            );
          })()}
        </div>
        {selB && !searchQ && (
          <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '.78rem', color: 'var(--g500)', fontWeight: 600 }}>Selected:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.375rem', background: '#f97316', color: '#fff', padding: '.3rem .875rem .3rem .625rem', borderRadius: 9999, fontWeight: 700, fontSize: '.82rem' }}>
              {b && b.icon} {b && b.name}
              <button onClick={() => { setSelB(null); setAllData({}); setSelSubject(null); }} style={{ background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: '.65rem', marginLeft: '.25rem' }}>✕</button>
            </span>
          </div>
        )}
      </div>

      {!selSubject && selB && !loadingAll && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {SEMS.map(s => {
            const list = allData[s] || [];
            return (
              <div key={s} style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--g100)', boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
                <div className="sec-hd">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <div className="sec-num">{s}</div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 800, fontSize: '.9375rem', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>Semester {s}</p>
                      <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.72rem', marginTop: 2 }}>{list.length} subject{list.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {isAdmin && <button onClick={() => openAdd(s)} style={{ background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.35)', color: '#fff', padding: '.35rem .875rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.78rem', whiteSpace: 'nowrap' }}>+ Add</button>}
                </div>
                {list.length === 0
                  ? <div style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--g400)', fontSize: '.85rem', background: '#fafafa' }}>
                    {isAdmin ? <span>No subjects yet — <span onClick={() => openAdd(s)} style={{ color: '#1a4fa0', fontWeight: 700, cursor: 'pointer' }}>+ Add one</span></span> : 'No subjects uploaded yet.'}
                  </div>
                  : <div className="tbl-wrap" style={{ marginTop: 0 }}>
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}>Sr.</th>
                          <th>Course Title</th>
                          <th style={{ width: 110 }}>Course Code</th>
                          <th style={{ width: 100, textAlign: 'center' }}>Syllabus</th>
                          {isAdmin && <th style={{ width: 100, textAlign: 'center' }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, i) => (
                          <tr key={item.id}>
                            <td style={{ color: 'var(--g400)', fontWeight: 700 }}>{i + 1}</td>
                            <td><span onClick={() => setSelSubject({ ...item, sem: s })} style={{ fontWeight: 700, color: '#1a4fa0', fontSize: '.9rem', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", textDecoration: 'underline', textDecorationColor: '#bfdbfe', textUnderlineOffset: 3 }} onMouseEnter={e => e.currentTarget.style.color = '#0d3278'} onMouseLeave={e => e.currentTarget.style.color = '#1a4fa0'}>{item.subjectName}</span></td>
                            <td><span style={{ background: '#f0f7ff', color: '#1a4fa0', fontSize: '.78rem', fontWeight: 800, padding: '3px 9px', borderRadius: 7, fontFamily: "'Space Grotesk',sans-serif" }}>{item.subjectCode}</span></td>
                            <td style={{ textAlign: 'center' }}>{item.pdfUrl ? <button onClick={() => setSelSubject({ ...item, sem: s })} style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.35rem .875rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.75rem', whiteSpace: 'nowrap' }}>📋 View</button> : <span style={{ color: 'var(--g300)', fontSize: '.75rem', fontWeight: 600 }}>—</span>}</td>
                            {isAdmin && <td style={{ textAlign: 'center' }}><div style={{ display: 'flex', gap: '.375rem', justifyContent: 'center' }}><button onClick={() => openEdit({ ...item, sem: s })} style={{ background: '#fef3c7', color: '#92400e', border: 'none', padding: '.3rem .625rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter' }}>✏️</button><button onClick={() => delSubject({ ...item, sem: s })} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '.3rem .625rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'Inter' }}>🗑</button></div></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            );
          })}
        </div>
      )}
      {!selSubject && selB && loadingAll && <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /><p style={{ color: 'var(--g400)', marginTop: '1rem', fontWeight: 600 }}>Loading all semesters...</p></div>}
      {!selSubject && !selB && <div className="empty"><div className="empty-icon">🔍</div><p style={{ fontWeight: 700, color: 'var(--g600)' }}>Search and select a branch above</p><p style={{ color: 'var(--g400)', fontSize: '.875rem', marginTop: '.375rem' }}>Subject-wise syllabus for all 6 semesters will appear here</p></div>}
    </div>
  );
}
