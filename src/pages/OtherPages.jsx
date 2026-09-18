import { useState, useEffect } from 'react';
import { db, auth } from '../firebase.js';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MODEL_ANSWER_BRANCHES } from '../constants.js';
import { fbAdd } from '../firebase.js';
import { toast } from '../toast.jsx';

/* ══════════════════ CONTACT PAGE ══════════════════ */
export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) { toast('Please fill all required fields', 'e'); return; }
    setBusy(true);
    try {
      await addDoc(collection(db, 'contactMessages'), { ...form, ts: Date.now(), status: 'new' });
      setSent(true); toast('Message sent!', 's');
    } catch (e) { toast(e.message, 'e'); }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem var(--pad)' }}>
      {sent
        ? <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '3rem 2rem', boxShadow: 'var(--sh-md)', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.5rem' }}>Message Sent!</h2>
          <p style={{ color: 'var(--g500)', fontSize: '.9rem', lineHeight: 1.6 }}>Thank you for contacting us. We'll get back to you soon.</p>
          <button onClick={() => setSent(false)} style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.75rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' }}>Send Another</button>
        </div>
        : <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(1.25rem,4vw,2rem)', boxShadow: 'var(--sh-md)', width: '100%', maxWidth: 560 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.25rem' }}>📧 Contact Us</h2>
          <p style={{ color: 'var(--g500)', fontSize: '.875rem', marginBottom: '1.5rem' }}>Have questions? We'd love to hear from you.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
            <div><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" /></div>
          </div>
          <div style={{ marginBottom: '1rem' }}><label className="form-label">Subject</label><input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" /></div>
          <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Message *</label><textarea className="form-input" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} style={{ resize: 'vertical' }} /></div>
          <button onClick={submit} disabled={busy} style={{ width: '100%', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', opacity: busy ? .6 : 1 }}>{busy ? 'Sending...' : 'Send Message'}</button>
        </div>
      }
    </div>
  );
}

/* ══════════════════ LOGIN PAGE ══════════════════ */
export function LoginPage({ onLogin }) {
  const [em, setEm] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!em || !pw) { toast('Enter email and password', 'e'); return; }
    setBusy(true);
    try {
      const r = await signInWithEmailAndPassword(auth, em, pw);
      onLogin(r.user); toast('Logged in', 's');
    } catch (e) { toast(e.message, 'e'); }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem var(--pad)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(1.5rem,5vw,2.5rem)', boxShadow: 'var(--sh-md)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.25rem' }}>Admin Login</h2>
        <p style={{ color: 'var(--g500)', fontSize: '.875rem', marginBottom: '1.5rem' }}>Sign in to manage content</p>
        <div style={{ marginBottom: '1rem' }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="admin@email.com" />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="••••••••" />
        </div>
        <button onClick={go} disabled={busy} style={{ width: '100%', background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', opacity: busy ? .6 : 1 }}>{busy ? 'Signing in...' : 'Sign In'}</button>
      </div>
    </div>
  );
}

/* ══════════════════ ADMIN PANEL ══════════════════ */
export function AdminPanel({ papers, onAdd, onDel }) {
  const [tab, setTab] = useState('add');
  const [f, setF] = useState({ branch: 'AU', sem: 1, subject: '', code: '', pdfUrl: '', dlUrl: '', year: '2025', scheme: 'K', paperType: 'Model Answer', season: 'Winter' });
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (tab === 'messages')
      getDocs(query(collection(db, 'contactMessages'), orderBy('ts', 'desc'))).then(s => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [tab]);

  const submit = async () => {
    if (!f.subject || !f.pdfUrl) { toast('Subject and PDF URL required', 'e'); return; }
    setBusy(true);
    try {
      const p = await fbAdd(f);
      onAdd(p);
      toast('Paper added!', 's');
      setF(prev => ({ ...prev, subject: '', code: '', pdfUrl: '', dlUrl: '' }));
    } catch (e) { toast(e.message, 'e'); }
    setBusy(false);
  };

  return (
    <div className="page-wrap-sm">
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '1.5rem' }}>Admin Panel</h2>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '.25rem', scrollbarWidth: 'none' }}>
        {[['add', 'Add Paper'], ['list', 'All Papers'], ['syllabus', 'Syllabi'], ['manualpdf', 'Manual PDFs'], ['messages', 'Messages']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? 'linear-gradient(135deg,#0d3278,#1a4fa0)' : '#fff', color: tab === t ? '#fff' : 'var(--g700)', border: '2px solid ' + (tab === t ? 'transparent' : 'var(--g200)'), padding: '.625rem 1.25rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', fontSize: '.875rem', position: 'relative', whiteSpace: 'nowrap' }}>
            {l}
            {t === 'messages' && messages.filter(m => m.status === 'new').length > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', fontSize: '.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: 9999, minWidth: 20, textAlign: 'center' }}>{messages.filter(m => m.status === 'new').length}</span>}
          </button>
        ))}
      </div>
      {tab === 'add' && (
        <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', boxShadow: 'var(--sh-sm)', maxWidth: 640 }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '1.5rem', fontFamily: "'Space Grotesk',sans-serif" }}>Add New Paper</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0 1rem' }}>
            {[['Branch', 'branch', MODEL_ANSWER_BRANCHES.map(b => b.code)], ['Semester', 'sem', [1, 2, 3, 4, 5, 6]], ['Year', 'year', ['2025', '2024', '2023', '2022', '2021']], ['Scheme', 'scheme', ['K', 'I', 'J', 'G']], ['Paper Type', 'paperType', ['Model Answer', 'Question Paper', 'Solving Paper']], ['Season', 'season', ['Winter', 'Summer']]].map(([lbl, key, opts]) => (
              <div key={key} style={{ marginBottom: '.875rem' }}>
                <label className="form-label">{lbl}</label>
                <select className="form-select" value={f[key]} onChange={e => setF({ ...f, [key]: key === 'sem' ? +e.target.value : e.target.value })}>{opts.map(o => <option key={o}>{o}</option>)}</select>
              </div>
            ))}
          </div>
          {[['Subject Name *', 'subject'], ['Subject Code', 'code'], ['PDF URL *', 'pdfUrl'], ['Download URL (optional)', 'dlUrl']].map(([lbl, key]) => (
            <div key={key} style={{ marginBottom: '.875rem' }}>
              <label className="form-label">{lbl}</label>
              <input className="form-input" value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} />
            </div>
          ))}
          <button onClick={submit} disabled={busy} style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem 2rem', borderRadius: 11, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter', opacity: busy ? .6 : 1 }}>{busy ? 'Adding...' : 'Add Paper'}</button>
        </div>
      )}
      {tab === 'list' && (
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>{['Branch', 'Sem', 'Subject', 'Code', 'Year', 'Type', 'Season', ''].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{papers.map(p => <tr key={p.id}><td>{p.branch}</td><td>{p.sem}</td><td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.subject}</td><td>{p.code}</td><td>{p.year}</td><td>{p.paperType}</td><td>{p.season}</td><td><button onClick={() => onDel(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '.3rem .625rem', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '.75rem', fontFamily: 'Inter' }}>🗑</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'syllabus' && <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', boxShadow: 'var(--sh-sm)' }}><p style={{ color: 'var(--g500)' }}>Manage syllabus entries from the 📋 Syllabus section directly.</p></div>}
      {tab === 'manualpdf' && <div style={{ background: '#fff', borderRadius: 18, padding: '1.5rem', boxShadow: 'var(--sh-sm)' }}><p style={{ color: 'var(--g500)' }}>Manage Manual PDFs from the 📥 Manual PDF section directly.</p></div>}
      {tab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0
            ? <div className="empty"><div className="empty-icon">📧</div><p style={{ fontWeight: 700, color: 'var(--g600)' }}>No messages yet</p></div>
            : messages.map(m => (
              <div key={m.id} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', boxShadow: 'var(--sh-sm)', border: `2px solid ${m.status === 'new' ? '#bfdbfe' : 'var(--g100)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', flexWrap: 'wrap', gap: '.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{m.name} <span style={{ color: 'var(--g500)', fontWeight: 400 }}>({m.email})</span></span>
                  <span style={{ fontSize: '.75rem', color: 'var(--g400)' }}>{new Date(m.ts).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--g600)', fontSize: '.875rem', lineHeight: 1.6 }}>{m.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════ PRIVACY PAGE ══════════════════ */
export function PrivacyPage({ nav }) {
  return (
    <div className="page-wrap-sm">
      <button className="back-btn" onClick={() => nav('home')} style={{ marginBottom: '1.25rem' }}>← Back to Home</button>
      <div className="card" style={{ padding: 'clamp(1.25rem,4vw,2rem)' }}>
        <h1 style={{ fontSize: 'clamp(1.375rem,3vw,1.875rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: 'var(--g900)', marginBottom: '.5rem' }}>👥 Privacy Policy</h1>
        <p style={{ color: 'var(--g400)', fontSize: '.8rem', marginBottom: '2rem' }}>Last updated: March 2025</p>
        {[
          ['Information We Collect', 'We do not collect any personal information from students. This portal is completely free and does not require any login or registration for accessing study materials.'],
          ['How We Use Information', 'Contact form messages submitted by users are stored securely in our database solely for the purpose of responding to queries. We do not share, sell, or distribute any user information to third parties.'],
          ['Cookies', 'This website does not use tracking cookies. Firebase services may use essential session cookies for authentication purposes only.'],
          ['Third-Party Services', 'We use Google Drive for hosting PDF files and Google Firebase for database services. These services have their own privacy policies. PDF files are publicly accessible and do not require any user authentication.'],
          ['Student Data', 'No student data, academic records, or personal information is collected or stored. All study materials provided on this portal are for educational purposes only.'],
          ['Contact', 'If you have any questions about this Privacy Policy, please contact us through the Contact page.'],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--g900)', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--g600)', fontSize: '.9rem', lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ ABOUT PAGE ══════════════════ */
export function AboutPage({ nav }) {
  const [activeWhy, setActiveWhy] = useState(0);
  const whyItems = [
    { title: 'Learn Anywhere, Anytime', desc: 'Access all study materials from any device — mobile, tablet, or laptop. Study at your own pace, anytime you want, without any restrictions.', icon: '📱' },
    { title: '100% Free Forever', desc: 'No registration, no subscription, no hidden charges. Every model answer paper, manual, and syllabus is completely free for all MSBTE diploma students.', icon: '🆓' },
    { title: 'K Scheme Updated', desc: 'All content is updated as per the latest MSBTE K Scheme curriculum. Get the most up-to-date syllabus, papers, and manual answers.', icon: '🔄' },
    { title: 'All Branches Covered', desc: 'Covers all major diploma engineering branches including Computer, Civil, Mechanical, Electrical, E&TC, Automobile, and Chemical Engineering.', icon: '🎓' },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: '#e8f4fd', padding: 'clamp(3rem,8vw,6rem) var(--pad)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: '.8rem', color: '#1a4fa0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>About Us</p>
            <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', lineHeight: 1.2, marginBottom: '1.25rem' }}>Committed To Excellence In Online Education</h1>
            <p style={{ color: '#475569', fontSize: 'clamp(.9rem,2vw,1.0625rem)', lineHeight: 1.8, marginBottom: '2rem' }}>Msbte Study Portal is a website for all MSBTE students who are struggling to get notes, Manual answers, and Model answer papers for studying.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => nav('browse')} style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', color: '#fff', border: 'none', padding: '.875rem 1.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '.9375rem', fontFamily: 'Inter' }}>Browse Papers</button>
              <button onClick={() => nav('contact')} style={{ background: '#fff', color: '#1a4fa0', border: '2px solid #1a4fa0', padding: '.875rem 1.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '.9375rem', fontFamily: 'Inter' }}>Contact Us</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1/3', background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>📋</div>
              <div>
                <p style={{ fontSize: '.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>K SCHEME</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', lineHeight: 1.1 }}>MANUAL<br />ANSWER</p>
              </div>
            </div>
            {[['700+', 'Model Answer Papers'], ['6', 'Semesters'], ['7', 'Branches'], ['Free', 'Always']].map(([v, l]) => (
              <div key={l} style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,.06)', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'all .2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#0d3278,#1a4fa0)'; e.currentTarget.querySelectorAll('p').forEach(p => { p.style.color = 'rgba(255,255,255,.85)'; }); e.currentTarget.querySelector('.stat-val').style.color = '#fb923c'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.querySelectorAll('p').forEach(p => { p.style.color = ''; }); e.currentTarget.querySelector('.stat-val').style.color = '#1a4fa0'; }}>
                <p className="stat-val" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a4fa0', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: '.72rem', color: '#64748b', marginTop: 4, lineHeight: 1.3 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div style={{ padding: 'clamp(3rem,8vw,5rem) var(--pad)', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontWeight: 800, fontSize: '.8rem', color: '#1a4fa0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '.75rem' }}>All Study Material</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', marginBottom: '1rem' }}>Everything You Need To Score Better</h2>
            <p style={{ color: '#64748b', fontSize: 'clamp(.875rem,2vw,1rem)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>All model answer papers, practical manuals, K-scheme syllabus, and downloadable PDFs — organized by branch and semester.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(240px,100%),1fr))', gap: '1.5rem' }}>
            {[
              { icon: '📂', color: '#dbeafe', accent: '#1a4fa0', title: 'Model Answer Papers', desc: 'Year-wise and semester-wise model answer papers for all diploma branches. Download or view online.' },
              { icon: '📖', color: '#d1fae5', accent: '#059669', title: 'Practical Manuals', desc: 'Complete K-Scheme practical manual answers for all subjects. Lab-ready solutions organized neatly.' },
              { icon: '📋', color: '#ede9fe', accent: '#7c3aed', title: 'Updated Syllabus', desc: 'Official MSBTE K-Scheme syllabus for all branches and semesters. Always up to date.' },
              { icon: '📥', color: '#fef3c7', accent: '#d97706', title: 'Downloadable PDFs', desc: 'Save any manual or paper as PDF offline. Study without internet on your phone or laptop.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fafbfc', borderRadius: 20, padding: '1.75rem', border: '2px solid #f1f5f9', transition: 'all .25s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = item.accent; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${item.accent}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fafbfc'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.0625rem', fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', marginBottom: '.625rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '.875rem', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: '#f8fafc', padding: 'clamp(3rem,8vw,5rem) var(--pad)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', borderRadius: 24, padding: '2.5rem', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(249,115,22,.15)', pointerEvents: 'none' }} />
              <div>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.5rem' }}>MSBTE STUDENTS</p>
                <h3 style={{ color: '#fff', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', lineHeight: 1.3 }}>Study Smarter,<br />Not Harder</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.875rem', marginTop: '2rem' }}>
                {[['700+', 'Papers'], ['7', 'Branches'], ['6', 'Sems'], ['Free', 'Always']].map(([v, l]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '.875rem', textAlign: 'center', border: '1px solid rgba(255,255,255,.15)' }}>
                    <p style={{ color: '#fb923c', fontWeight: 900, fontSize: '1.25rem', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{v}</p>
                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.7rem', marginTop: 3 }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '.8rem', color: '#1a4fa0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '.75rem' }}>Why Choose Us</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#0f172a', marginBottom: '.875rem', lineHeight: 1.25 }}>We Make Learning Accessible, Flexible</h2>
            <p style={{ color: '#64748b', fontSize: '.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>Our platform ensures students can study anywhere, anytime, with resources that make every lesson engaging, practical, and impactful.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {whyItems.map((item, i) => (
                <div key={i} style={{ border: `2px solid ${activeWhy === i ? '#1a4fa0' : '#e2e8f0'}`, borderRadius: 16, overflow: 'hidden', transition: 'all .2s', background: activeWhy === i ? '#eff6ff' : '#fff', cursor: 'pointer' }} onClick={() => setActiveWhy(activeWhy === i ? -1 : i)}>
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '.875rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: activeWhy === i ? '#1a4fa0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, transition: 'all .2s' }}>{item.icon}</div>
                    <span style={{ fontWeight: 700, fontSize: '.9375rem', color: activeWhy === i ? '#0d3278' : '#334155', flex: 1 }}>{item.title}</span>
                    <span style={{ color: activeWhy === i ? '#1a4fa0' : '#94a3b8', fontSize: '1.1rem', fontWeight: 700, transition: 'transform .2s', transform: activeWhy === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
                  </div>
                  {activeWhy === i && <div style={{ padding: '0 1.25rem 1rem 4.125rem', color: '#475569', fontSize: '.875rem', lineHeight: 1.7, animation: 'fadeUp .2s ease' }}>{item.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', padding: 'clamp(3rem,6vw,4rem) var(--pad)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2rem)', fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: '#fff', marginBottom: '.875rem' }}>Start Studying For Free Today</h2>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 'clamp(.875rem,2vw,1rem)', lineHeight: 1.7, marginBottom: '2rem' }}>Join thousands of MSBTE diploma students who use our portal to prepare for their exams. No signup needed.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('browse')} style={{ background: '#f97316', border: 'none', color: '#fff', padding: '.875rem 2rem', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter' }}>📂 Browse Papers</button>
            <button onClick={() => nav('syllabus')} style={{ background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.35)', color: '#fff', padding: '.875rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Inter' }}>📋 View Syllabus</button>
          </div>
        </div>
      </div>
    </div>
  );
}
