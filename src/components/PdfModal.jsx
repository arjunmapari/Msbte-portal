import { bOf, embedUrl } from '../constants.js';

export default function PdfModal({ paper, onClose }) {
  const b = bOf(paper.branch);
  return (
    <div className="overlay" onClick={onClose}>
      <div
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 900, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--sh-xl)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ background: `linear-gradient(100deg,${b.dark},${b.color})`, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: '.75rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paper.subject}</div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: '.75rem', marginTop: 2 }}>{paper.branch} · Sem {paper.sem} · {paper.year} · {paper.code}</div>
          </div>
          <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0 }}>
            <a href={paper.pdfUrl} target="_blank" rel="noreferrer"
              style={{ background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '.4rem .75rem', borderRadius: 8, fontWeight: 700, fontSize: '.78rem', textDecoration: 'none' }}>↗</a>
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 500, background: '#e5e7eb' }}>
          <iframe src={embedUrl(paper.pdfUrl)} style={{ width: '100%', height: '100%', minHeight: 500, border: 'none' }} title="PDF Viewer" loading="eager" />
        </div>
      </div>
    </div>
  );
}
