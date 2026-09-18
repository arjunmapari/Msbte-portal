export default function Navbar({ page, nav, user, logout }) {
  const tabs = [
    ['home', '🏠', 'Home'],
    ['browse', '📂', 'Browse'],
    ['manual', '📖', 'Manual'],
    ['syllabus', '📋', 'Syllabus'],
    ['manualpdf', '📥', 'Manual PDF'],
  ];
  return (
    <nav className="nav-root">
      <div className="nav-top">
        <div className="nav-logo" onClick={() => nav('home')}>
          <div className="nav-logo-icon">📚</div>
          <div className="nav-logo-text">MSBTE<span className="nav-logo-sub">Study Portal</span></div>
        </div>
        <div className="nav-tabs">
          {tabs.map(([p, icon, label]) => (
            <button key={p} onClick={() => nav(p)} className={`nav-tab${page === p ? ' active' : ''}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          {user
            ? <>
                <button onClick={() => nav('admin')} className="nav-btn">⚙ Admin</button>
                <button onClick={logout} style={{ background: 'rgba(220,38,38,.2)', border: '1px solid rgba(220,38,38,.35)', color: '#fca5a5', padding: '.35rem .75rem', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: '.75rem', fontFamily: 'Inter' }}>✕ Out</button>
              </>
            : <button onClick={() => nav('login')} className="nav-btn-orange">Admin Login</button>
          }
        </div>
      </div>
      <div className="mob-tabbar">
        <div className="mob-tabbar-inner">
          {tabs.map(([p, icon, label]) => (
            <button key={p} onClick={() => nav(p)} className={`mob-tab${page === p ? ' active' : ''}`}>
              <span className="mob-tab-icon">{icon}</span>{label}
            </button>
          ))}
          {user && (
            <button onClick={() => nav('admin')} className={`mob-tab${page === 'admin' ? ' active' : ''}`}>
              <span className="mob-tab-icon">⚙</span>Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
