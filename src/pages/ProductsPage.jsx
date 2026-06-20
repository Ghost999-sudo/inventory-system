import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { useSelector } from 'react-redux';

export function ProductsPage() {
  const products = useSelector(state => state.inventory.products);
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'barcode', label: 'Barcode' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'cost', label: 'Buying Price', render: row => `KES ${row.cost}` },
    { key: 'price', label: 'Selling Price', render: row => `KES ${row.price}` }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Products" description="Master product records and pricing." />
      <DataTable columns={columns} rows={products} />
    </div>
  );
}
