export const statusBadgeClass = (status) => ({
  'Open':        'badge badge-open',
  'In Progress': 'badge badge-inprog',
  'Waiting':     'badge badge-waiting',
  'Resolved':    'badge badge-resolved',
  'Closed':      'badge badge-closed',
}[status] ?? 'badge badge-closed');

export const priorityBadgeClass = (priority) => ({
  'P1 - Critical': 'badge badge-p1',
  'P2 - High':     'badge badge-p2',
  'P3 - Medium':   'badge badge-p3',
  'P4 - Low':      'badge badge-p4',
}[priority] ?? 'badge badge-p4');

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const fmtRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const priorityColor = (p) => ({
  'P1 - Critical': '#E24B4A',
  'P2 - High':     '#D85A30',
  'P3 - Medium':   '#BA7517',
  'P4 - Low':      '#888780',
}[p] ?? '#888780');

export const statusColor = (s) => ({
  'Open':        '#185FA5',
  'In Progress': '#BA7517',
  'Waiting':     '#534AB7',
  'Resolved':    '#3B6D11',
  'Closed':      '#888780',
}[s] ?? '#888780');
