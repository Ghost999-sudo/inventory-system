import { SectionHeader } from '../components/SectionHeader';

export function SettingsPage() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Settings" description="Configure system preferences, API endpoints, and user roles." />
      <div className="panel">
        <p className="muted" style={{ marginTop: 0 }}>
          Environment variables for this Vite starter:
        </p>
        <pre style={{ background: '#0f172a', color: 'white', padding: 16, borderRadius: 16, overflowX: 'auto' }}>
{`VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws`}
        </pre>
      </div>
    </div>
  );
}
