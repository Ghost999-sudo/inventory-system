import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionHeader } from '../components/SectionHeader';
import { reportData } from '../data/mockData';

export function ReportsPage() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Reports" description="Daily, weekly, and monthly business analytics." />
      <div className="panel">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
            <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={3} />
            <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
