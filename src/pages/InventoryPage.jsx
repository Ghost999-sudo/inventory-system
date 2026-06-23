import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '../components/DataTable';
import { SectionHeader } from '../components/SectionHeader';
import { createProduct, fetchProducts } from '../store/slices/inventorySlice';
import { useForm } from 'react-hook-form';

export function InventoryPage() {
  const { products, status, error } = useSelector(state => state.inventory);
  const dispatch = useDispatch();
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      category: '',
      barcode: '',
      sellingPrice: 0,
      buyingPrice: 0,
      quantity: 0,
      supplierName: '',
      reorderLevel: 20,
      expiryDate: ''
    }
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const onSubmit = async values => {
    setFormError('');
    try {
      await dispatch(
        createProduct({
          name: values.name,
          category: values.category,
          barcode: values.barcode,
          sellingPrice: Number(values.sellingPrice),
          buyingPrice: Number(values.buyingPrice),
          quantity: Number(values.quantity),
          supplierName: values.supplierName,
          reorderLevel: Number(values.reorderLevel) || 20,
          expiryDate: values.expiryDate || null
        })
      ).unwrap();
      reset();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || requestError.message || 'Product could not be saved.');
    }
  };

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'sellingPrice', label: 'Price', render: row => `KES ${Number(row.sellingPrice).toLocaleString()}` },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Inventory" description="Track stock, pricing, and supplier info." />
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Add Product</h3>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Product Name</span>
            <input {...register('name', { required: true })} />
          </label>
          <label className="field">
            <span>Category</span>
            <input {...register('category', { required: true })} />
          </label>
          <label className="field">
            <span>Barcode</span>
            <input {...register('barcode', { required: true })} />
          </label>
          <label className="field">
            <span>Selling Price</span>
            <input type="number" min="0" step="0.01" {...register('sellingPrice', { required: true })} />
          </label>
          <label className="field">
            <span>Buying Price</span>
            <input type="number" min="0" step="0.01" {...register('buyingPrice', { required: true })} />
          </label>
          <label className="field">
            <span>Quantity</span>
            <input type="number" min="0" {...register('quantity', { required: true })} />
          </label>
          <label className="field">
            <span>Supplier</span>
            <input {...register('supplierName', { required: true })} />
          </label>
          <label className="field">
            <span>Reorder Level</span>
            <input type="number" min="0" {...register('reorderLevel')} />
          </label>
          <label className="field">
            <span>Expiry Date</span>
            <input type="date" {...register('expiryDate')} />
          </label>
          <div style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">
              Save Product
            </button>
          </div>
        </form>
        {formError ? <p className="error-text">{formError}</p> : null}
      </div>
      {status === 'loading' ? <p className="muted">Loading products...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <DataTable columns={columns} rows={products} emptyMessage="No products yet. Add your first product above." />
    </div>
  );
}
