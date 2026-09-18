import { useState, useEffect } from 'react';
import { auth, fbLoad, fbDel } from './firebase.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Toasts, toast } from './toast.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PdfModal from './components/PdfModal.jsx';
import HomePage from './pages/HomePage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import ManualPage from './pages/ManualPage.jsx';
import SyllabusPage from './pages/SyllabusPage.jsx';
import ManualPdfPage from './pages/ManualPdfPage.jsx';
import { ContactPage, LoginPage, AdminPanel, PrivacyPage, AboutPage } from './pages/OtherPages.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [papers, setPapers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewPaper, setViewPaper] = useState(null);

  const nav = p => setPage(p);

  const logout = async () => {
    try { await signOut(auth); } catch (e) { }
    setUser(null);
    nav('home');
    toast('Logged out', 'i');
  };

  useEffect(() => {
    fbLoad().then(p => { setPapers(p); setLoading(false); });
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#eef2f9' }}>
      <div style={{ width: 48, height: 48, border: '5px solid #dbeafe', borderTopColor: '#1a4fa0', borderRadius: '50%', animation: 'spin .75s linear infinite' }} />
      <p style={{ color: '#1a4fa0', fontWeight: 700 }}>Loading MSBTE Portal...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Navbar page={page} nav={nav} user={user} logout={logout} />
      {viewPaper && <PdfModal paper={viewPaper} onClose={() => setViewPaper(null)} />}
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {page === 'home' && <HomePage papers={papers} nav={nav} />}
        {page === 'browse' && (
          <BrowsePage
            papers={papers}
            onView={setViewPaper}
            isAdmin={!!user}
            onDel={id => { fbDel(id); setPapers(p => p.filter(x => x.id !== id)); }}
          />
        )}
        {page === 'contact' && <ContactPage />}
        {page === 'login' && <LoginPage onLogin={u => { setUser(u); nav('admin'); }} />}
        {(page === 'admin' && !user) && <LoginPage onLogin={u => { setUser(u); nav('admin'); }} />}
        {(page === 'admin' && !!user) && (
          <AdminPanel
            papers={papers}
            onAdd={p => setPapers(prev => [p, ...prev])}
            onDel={id => setPapers(p => p.filter(x => x.id !== id))}
          />
        )}
        {page === 'manual' && <ManualPage isAdmin={!!user} />}
        {page === 'syllabus' && <SyllabusPage isAdmin={!!user} />}
        {page === 'manualpdf' && <ManualPdfPage isAdmin={!!user} />}
        {page === 'privacy' && <PrivacyPage nav={nav} />}
        {page === 'about' && <AboutPage nav={nav} />}
      </main>
      <Footer nav={nav} />
      <Toasts />
    </div>
  );
}
