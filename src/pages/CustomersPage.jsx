import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { initialCustomers } from '../data/mockData';

export function CustomersPage() {
  const columns = [
    { key: 'name', label: 'Customer' },
    { key: 'purchases', label: 'Purchases', render: row => `KES ${row.purchases.toLocaleString()}` },
    { key: 'points', label: 'Points' },
    { key: 'balance', label: 'Balance', render: row => `KES ${row.balance.toLocaleString()}` }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Customers" description="Track loyalty, balances, and purchase history." />
      <DataTable columns={columns} rows={initialCustomers} />
    </div>
  );
}
