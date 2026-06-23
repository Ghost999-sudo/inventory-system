import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatsCard } from '../components/StatsCard';
import { SectionHeader } from '../components/SectionHeader';
import { dashboardProfiles, formatRole, hasRole, PAGE_ACCESS, ROLES } from '../auth/roles';
import { fetchProducts } from '../store/slices/inventorySlice';
import { fetchSales } from '../store/slices/salesSlice';
import { reportService } from '../services/reportService';

const stockColors = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed'];
const salesReaders = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.CASHIER];

function money(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function buildSalesTrend(orders) {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (4 - index));
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

function buildCards(role, metrics) {
  const cards = {
    [ROLES.ADMIN]: [
      ['Today\'s Sales', money(metrics.todaySales), 'Completed transactions', 'success'],
      ['Profit', money(metrics.profit), 'Estimated margin from sales', 'success'],
      ['Stock Alerts', metrics.lowStockCount, 'Products need restocking', 'danger'],
      ['Pending Payments', metrics.pendingOrders, 'Follow-up needed', 'warning']
    ],
    [ROLES.SUPER_ADMIN]: [
      ['Today\'s Sales', money(metrics.todaySales), 'Completed transactions', 'success'],
      ['Profit', money(metrics.profit), 'Estimated margin from sales', 'success'],
      ['Stock Alerts', metrics.lowStockCount, 'Products need restocking', 'danger'],
      ['Pending Users', metrics.pendingUsers, 'Awaiting admin approval', 'warning']
    ],
    [ROLES.MANAGER]: [
      ['Today\'s Sales', money(metrics.todaySales), 'Cashier activity', 'success'],
      ['Products', metrics.productCount, 'Active catalog records'],
      ['Stock Alerts', metrics.lowStockCount, 'Needs store action', 'danger'],
      ['Pending Payments', metrics.pendingOrders, 'Operations follow-up', 'warning']
    ],
    [ROLES.ACCOUNTANT]: [
      ['Today\'s Sales', money(metrics.todaySales), 'Revenue posted today', 'success'],
      ['Profit', money(metrics.profit), 'Estimated margin', 'success'],
      ['Pending Payments', metrics.pendingOrders, 'Verify payment status', 'warning'],
      ['Sales Records', metrics.salesCount, 'Transactions available']
    ],
    [ROLES.CASHIER]: [
      ['Cart Items', metrics.cartItems, 'Current checkout queue'],
      ['Products', metrics.productCount, 'Available for sale'],
      ['Today\'s Sales', money(metrics.todaySales), 'Processed sales', 'success'],
      ['Low Stock', metrics.lowStockCount, 'Ask store keeper to restock', 'danger']
    ],
    [ROLES.STORE_KEEPER]: [
      ['Products', metrics.productCount, 'Items under stock control'],
      ['Stock Alerts', metrics.lowStockCount, 'Low or reorder level reached', 'danger'],
      ['Available Units', metrics.totalUnits, 'Units currently recorded', 'success'],
      ['Focus', 'Inventory', 'Receiving, counting, and batches']
    ],
  };

  return cards[role] || cards[ROLES.CASHIER];
}

export function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const products = useSelector(state => state.inventory.products);
  const productStatus = useSelector(state => state.inventory.status);
  const orders = useSelector(state => state.sales.orders);
  const salesStatus = useSelector(state => state.sales.status);
  const cart = useSelector(state => state.sales.cart);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState('');
  const canReadReports = hasRole(user?.role, PAGE_ACCESS.reports);
  const canReadSales = hasRole(user?.role, salesReaders);
  const profile = dashboardProfiles[user?.role] || dashboardProfiles[ROLES.CASHIER];

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productStatus]);

  useEffect(() => {
    if (canReadSales && salesStatus === 'idle') {
      dispatch(fetchSales());
    }
  }, [canReadSales, dispatch, salesStatus]);

  useEffect(() => {
    if (!canReadReports) {
      return;
    }

    reportService
      .fetchDashboard()
      .then(data => {
        setReport(data);
        setReportError('');
      })
      .catch(() => setReportError('Financial report metrics could not be loaded.'));
  }, [canReadReports]);

  const todayKey = new Date().toDateString();
  const todaySalesFromOrders = orders
    .filter(order => new Date(order.createdAt).toDateString() === todayKey)
    .reduce((total, order) => total + Number(order.total || 0), 0);
  const lowStockCount = products.filter(product => Number(product.quantity || 0) <= Number(product.reorderLevel || 20)).length;

  const metrics = {
    todaySales: report?.todaySales ?? todaySalesFromOrders,
    profit: report?.profit ?? 0,
    lowStockCount: report?.lowStockCount ?? lowStockCount,
    pendingOrders: report?.pendingOrders ?? orders.filter(order => order.paymentStatus === 'PENDING').length,
    productCount: products.length,
    salesCount: orders.length,
    cartItems: cart.reduce((total, item) => total + item.qty, 0),
    totalUnits: products.reduce((total, product) => total + Number(product.quantity || 0), 0)
    ,
    pendingUsers: 0
  };

  const cards = buildCards(user?.role, metrics);
  const salesTrend = useMemo(() => buildSalesTrend(orders), [orders]);
  const topProducts = report?.topProducts?.length
    ? report.topProducts.map(product => ({ name: product.name, value: Number(product.quantity || 0) }))
    : products.slice(0, 5).map(product => ({ name: product.name, value: Number(product.quantity || 0) }));

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title={profile.title} description={`${profile.description} Signed in as ${formatRole(user?.role)}.`} />
      <div className="grid cards">
        {cards.map(([label, value, detail, tone]) => (
          <StatsCard key={label} label={label} value={value} detail={detail} tone={tone} />
        ))}
      </div>

      {reportError ? <p className="error-text">{reportError}</p> : null}

      <div className="chart-grid">
        <div className="panel">
          <SectionHeader title="Recent Sales" description={canReadSales ? 'Live sales from recorded transactions.' : profile.focus} />
          {canReadSales ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">This role focuses on {profile.focus.toLowerCase()} and does not access sales money.</p>
          )}
        </div>

        <div className="panel">
          <SectionHeader title="Stock Snapshot" description="Current product quantities." />
          {topProducts.length > 0 ? (
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
          ) : (
            <p className="muted">No stock records yet. Add products to build this dashboard.</p>
          )}
        </div>
      </div>
    </div>
  );
}
