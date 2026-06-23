import { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { useForm } from 'react-hook-form';
import { supplierService } from '../services/supplierService';

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      deliveryStatus: 'Active',
      notes: ''
    }
  });

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    supplierService
      .fetchAll()
      .then(records => {
        if (mounted) {
          setSuppliers(records);
          setError('');
        }
      })
      .catch(requestError => {
        if (mounted) {
          setError(requestError.response?.data?.message || 'Suppliers could not be loaded.');
        }
      })
      .finally(() => {
        if (mounted) {
          setStatus('succeeded');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async values => {
    setError('');
    try {
      const supplier = await supplierService.create(values);
      setSuppliers(current => [supplier, ...current]);
      reset();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Supplier could not be saved.');
    }
  };

  const columns = [
    { key: 'name', label: 'Supplier' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'deliveryStatus', label: 'Delivery Status' },
    { key: 'notes', label: 'Notes' }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Suppliers" description="Manage supplier profiles and deliveries." />
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Add Supplier</h3>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Name</span>
            <input {...register('name', { required: true })} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input {...register('phone')} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" {...register('email')} />
          </label>
          <label className="field">
            <span>Address</span>
            <input {...register('address')} />
          </label>
          <label className="field">
            <span>Delivery Status</span>
            <select {...register('deliveryStatus')}>
              <option>Active</option>
              <option>Pending</option>
              <option>Delayed</option>
              <option>Suspended</option>
            </select>
          </label>
          <label className="field">
            <span>Notes</span>
            <input {...register('notes')} />
          </label>
          <div style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">
              Save Supplier
            </button>
          </div>
        </form>
      </div>
      {status === 'loading' ? <p className="muted">Loading suppliers...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <DataTable columns={columns} rows={suppliers} emptyMessage="No suppliers yet. Add your first supplier above." />
    </div>
  );
}
