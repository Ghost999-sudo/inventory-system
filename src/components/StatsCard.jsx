export function StatsCard({ label, value, detail, tone = 'default' }) {
  return (
    <div className="card">
      <p className="muted" style={{ marginTop: 0 }}>
        {label}
      </p>
      <h2 style={{ margin: '8px 0' }}>{value}</h2>
      <p style={{ marginBottom: 0, color: tone === 'danger' ? 'var(--danger)' : tone === 'success' ? 'var(--success)' : 'var(--muted)' }}>
        {detail}
      </p>
    </div>
  );
}
