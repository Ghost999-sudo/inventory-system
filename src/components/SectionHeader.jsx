export function SectionHeader({ title, description, action }) {
  return (
    <div className="panel-header">
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p className="muted" style={{ margin: '4px 0 0' }}>
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
