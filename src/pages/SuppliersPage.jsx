import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { initialSuppliers } from '../data/mockData';

export function SuppliersPage() {
  const columns = [
    { key: 'name', label: 'Supplier' },
    { key: 'contact', label: 'Contact' },
    { key: 'items', label: 'Items Supplied' },
    { key: 'deliveries', label: 'Delivery Status' }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Suppliers" description="Manage supplier profiles and deliveries." />
      <DataTable columns={columns} rows={initialSuppliers} />
    </div>
  );
}
