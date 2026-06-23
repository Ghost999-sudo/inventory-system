import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/inventorySlice';

export function ProductsPage() {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector(state => state.inventory);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'barcode', label: 'Barcode' },
    { key: 'supplierName', label: 'Supplier' },
    { key: 'buyingPrice', label: 'Buying Price', render: row => `KES ${Number(row.buyingPrice).toLocaleString()}` },
    { key: 'sellingPrice', label: 'Selling Price', render: row => `KES ${Number(row.sellingPrice).toLocaleString()}` }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Products" description="Master product records and pricing." />
      {status === 'loading' ? <p className="muted">Loading products...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <DataTable columns={columns} rows={products} emptyMessage="No products have been added yet." />
    </div>
  );
}
