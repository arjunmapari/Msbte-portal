export default function Footer({ nav }) {
  return (
    <footer style={{ background: '#0f172a', color: '#64748b', padding: 'clamp(1.5rem,4vw,2.5rem) var(--pad)', marginTop: '2rem' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.875rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0d3278,#1a4fa0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📚</div>
              <span style={{ color: '#fff', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>MSBTE Study Portal</span>
            </div>
            <p style={{ fontSize: '.875rem', lineHeight: 1.6 }}>Free model answer papers, practical manuals, and syllabus for all MSBTE diploma branches.</p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.875rem' }}>Navigation</p>
            {[['home', 'Home'], ['browse', 'Browse'], ['manual', 'Manual'], ['syllabus', 'Syllabus'], ['manualpdf', 'Manual PDF'], ['contact', 'Contact'], ['about', 'About Us'], ['privacy', 'Privacy Policy']].map(([p, l]) => (
              <div key={p} onClick={() => nav(p)}
                style={{ color: '#64748b', fontSize: '.875rem', marginBottom: '.5rem', cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '.8125rem' }}>&copy; 2025 MSBTE Study Portal. Free forever.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span onClick={() => nav('privacy')} style={{ fontSize: '.8125rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '.35rem', transition: 'color .15s' }} onMouseEnter={e => e.currentTarget.style.color = '#f97316'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>👥 Privacy Policy</span>
            <span onClick={() => nav('about')} style={{ fontSize: '.8125rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '.35rem', transition: 'color .15s' }} onMouseEnter={e => e.currentTarget.style.color = '#f97316'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>ℹ️ About Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
