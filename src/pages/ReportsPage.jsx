import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SectionHeader } from '../components/SectionHeader';
import { StatsCard } from '../components/StatsCard';
import { fetchSales } from '../store/slices/salesSlice';
import { reportService } from '../services/reportService';

function money(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function buildSalesTrend(orders) {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toDateString(),
      name: formatter.format(date),
      sales: 0
    };
  });

  orders.forEach(order => {
    const bucket = days.find(day => day.key === new Date(order.createdAt).toDateString());
    if (bucket) {
      bucket.sales += Number(order.total || 0);
    }
  });

  return days;
}

export function ReportsPage() {
  const dispatch = useDispatch();
  const { orders, status, error: salesError } = useSelector(state => state.sales);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSales());
    }
  }, [dispatch, status]);

  useEffect(() => {
    reportService
      .fetchDashboard()
      .then(data => {
        setReport(data);
        setReportError('');
      })
      .catch(() => setReportError('Dashboard report could not be loaded.'));
  }, []);

  const salesTrend = useMemo(() => buildSalesTrend(orders), [orders]);

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Reports" description="Daily, weekly, and monthly business analytics from real transactions." />
      <div className="grid cards">
        <StatsCard label="Today's Sales" value={money(report?.todaySales)} detail="Revenue recorded today" tone="success" />
        <StatsCard label="Profit" value={money(report?.profit)} detail="Estimated current margin" tone="success" />
        <StatsCard label="Stock Alerts" value={report?.lowStockCount ?? 0} detail="Products at reorder level" tone="danger" />
        <StatsCard label="Pending Payments" value={report?.pendingOrders ?? 0} detail="Requires payment follow-up" tone="warning" />
      </div>
      {status === 'loading' ? <p className="muted">Loading sales...</p> : null}
      {salesError ? <p className="error-text">{salesError}</p> : null}
      {reportError ? <p className="error-text">{reportError}</p> : null}
      <div className="panel">
        {orders.length === 0 ? (
          <p className="muted">No sales have been recorded yet. Reports will appear after checkout activity starts.</p>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
