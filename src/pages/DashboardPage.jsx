import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSelector } from 'react-redux';
import { reportData } from '../data/mockData';
import { StatsCard } from '../components/StatsCard';
import { SectionHeader } from '../components/SectionHeader';

const stockColors = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

export function DashboardPage() {
  const products = useSelector(state => state.inventory.products);
  const orders = useSelector(state => state.sales.orders);
  const todaySales = orders.reduce((total, order) => total + order.total, 0);
  const lowStockCount = products.filter(product => product.quantity < 20).length;
  const topProducts = products.slice(0, 4).map(product => ({ name: product.name, value: product.quantity }));

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Dashboard" description="Business overview at a glance." />
      <div className="grid cards">
        <StatsCard label="Today's Sales" value={`KES ${todaySales.toLocaleString()}`} detail="Completed transactions" tone="success" />
        <StatsCard label="Profit" value="KES 1,845" detail="Estimated margin" />
        <StatsCard label="Stock Alerts" value={lowStockCount} detail="Products need restocking" tone="danger" />
        <StatsCard label="Pending Orders" value="4" detail="Supplier follow-up needed" tone="warning" />
      </div>

      <div className="chart-grid">
        <div className="panel">
          <SectionHeader title="Weekly Performance" description="Sales, profit, and expense trends." />
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <SectionHeader title="Top Stock" description="Products with the most availability." />
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={topProducts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} paddingAngle={3}>
                {topProducts.map((entry, index) => (
                  <Cell key={entry.name} fill={stockColors[index % stockColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
