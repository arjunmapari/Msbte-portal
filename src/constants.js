export const BRANCHES = [
  { code: 'AU', name: 'Automobile Engineering', short: 'Auto', icon: '🚗', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'CE', name: 'Civil Engineering', short: 'Civil', icon: '🏗️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'CH', name: 'Chemical Engineering', short: 'Chemical', icon: '⚗️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'CO', name: 'Computer Engineering', short: 'Computer', icon: '💻', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'EE', name: 'Electrical Engineering', short: 'Electrical', icon: '⚡', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'ET', name: 'Electronics & Telecommunication', short: 'E&TC', icon: '📶', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'ME', name: 'Mechanical Engineering', short: 'Mechanical', icon: '⚙️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'IC', name: 'Instrumentation', short: 'Instrum.', icon: '🎛️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'IE', name: 'Industrial Electronics', short: 'Ind.Elec', icon: '🏭', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'DE', name: 'Digital Electronics', short: 'Digital', icon: '📡', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'FC', name: 'Fashion Technology', short: 'Fashion', icon: '👗', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'MU', name: 'Medical Electronics', short: 'MedElec', icon: '🏥', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'PG', name: 'Production Engineering', short: 'Production', icon: '🔧', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'TX', name: 'Textile Technology', short: 'Textile', icon: '🧵', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'PE', name: 'Production Engineering', short: 'Prod.', icon: '⚙️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'AE', name: 'Agricultural Engineering', short: 'Agri', icon: '🌾', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
];

export const MODEL_ANSWER_BRANCHES = BRANCHES.filter(b =>
  !['CT', 'IC', 'IE', 'DE', 'AE', 'MN', 'FC', 'MU', 'PG', 'TX', 'PE', 'TM'].includes(b.code)
);

export const MBRANCHES = [
  { code: 'CO', name: 'Computer Engineering', icon: '💻', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'CE', name: 'Civil Engineering', icon: '🏗️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'ME', name: 'Mechanical Engineering', icon: '⚙️', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'EJ', name: 'Electronics Engineering', icon: '🔌', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'EE', name: 'Electrical Engineering', icon: '⚡', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
  { code: 'AI', name: 'Artificial Intelligence', icon: '🤖', color: '#1a4fa0', bg: '#dbeafe', dark: '#0d3278' },
];

export const SYLLABUS_BRANCHES = [
  { code: 'CO', name: 'Computer Engineering', icon: '💻' },
  { code: 'CH', name: 'Chemical Engineering', icon: '⚗️' },
  { code: 'AU', name: 'Automobile Engineering', icon: '🚗' },
  { code: 'CE', name: 'Civil Engineering', icon: '🏗️' },
  { code: 'ME', name: 'Mechanical Engineering', icon: '⚙️' },
  { code: 'EE', name: 'Electrical Engineering', icon: '⚡' },
  { code: 'ET', name: 'Electronics & Telecommunication Engineering', icon: '📶' },
];

export const SEMS = [1, 2, 3, 4, 5, 6];

export const bOf = (code) =>
  BRANCHES.find(b => b.code === code) || { color: '#64748b', bg: '#f1f5f9', dark: '#334155', icon: '📄' };

export const embedUrl = (url) => {
  if (!url) return '';
  const m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
};

export const dlUrlFn = (url) => {
  if (!url) return '';
  const m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  return url;
};

export const schemeColor = (sc) => ({
  K: ['#0d3278', '#1a4fa0', '#dbeafe', '#93c5fd', '#eff6ff'],
  I: ['#065f46', '#059669', '#d1fae5', '#6ee7b7', '#ecfdf5'],
  J: ['#92400e', '#d97706', '#fef3c7', '#fcd34d', '#fffbeb'],
  G: ['#581c87', '#7c3aed', '#ede9fe', '#c4b5fd', '#f5f3ff'],
}[sc] || ['#0d3278', '#1a4fa0', '#dbeafe', '#93c5fd', '#eff6ff']);
