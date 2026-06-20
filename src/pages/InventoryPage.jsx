import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '../components/DataTable';
import { SectionHeader } from '../components/SectionHeader';
import { addProduct } from '../store/slices/inventorySlice';
import { useForm } from 'react-hook-form';

export function InventoryPage() {
  const products = useSelector(state => state.inventory.products);
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      category: '',
      barcode: '',
      price: 0,
      cost: 0,
      quantity: 0,
      supplier: ''
    }
  });

  const onSubmit = values => {
    dispatch(
      addProduct({
        ...values,
        price: Number(values.price),
        cost: Number(values.cost),
        quantity: Number(values.quantity),
        status: Number(values.quantity) < 20 ? 'Low Stock' : 'Available'
      })
    );
    reset();
  };

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price', render: row => `KES ${row.price}` },
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
            <input type="number" {...register('price', { required: true })} />
          </label>
          <label className="field">
            <span>Buying Price</span>
            <input type="number" {...register('cost', { required: true })} />
          </label>
          <label className="field">
            <span>Quantity</span>
            <input type="number" {...register('quantity', { required: true })} />
          </label>
          <label className="field">
            <span>Supplier</span>
            <input {...register('supplier', { required: true })} />
          </label>
          <div style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">
              Save Product
            </button>
          </div>
        </form>
      </div>
      <DataTable columns={columns} rows={products} />
    </div>
  );
}
