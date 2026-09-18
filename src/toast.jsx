import { useState, useEffect } from 'react';

let _toasts = [];
let _setToasts = null;

export const toast = (msg, type = 's') => {
  const id = Date.now();
  _toasts = [..._toasts, { id, msg, type }];
  if (_setToasts) _setToasts([..._toasts]);
  setTimeout(() => {
    _toasts = _toasts.filter(t => t.id !== id);
    if (_setToasts) _setToasts([..._toasts]);
  }, 3500);
};

const COLORS = { s: '#16a34a', e: '#dc2626', i: '#0369a1', w: '#d97706' };

export function Toasts() {
  const [ts, setTs] = useState([]);
  useEffect(() => { _setToasts = setTs; }, []);
  return (
    <div className="toast-wrap">
      {ts.map(t => (
        <div key={t.id} className="toast" style={{ background: COLORS[t.type] || COLORS.s }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
