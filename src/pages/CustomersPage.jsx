import { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { DataTable } from '../components/DataTable';
import { useForm } from 'react-hook-form';
import { customerService } from '../services/customerService';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: ''
    }
  });

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    customerService
      .fetchAll()
      .then(records => {
        if (mounted) {
          setCustomers(records);
          setError('');
        }
      })
      .catch(requestError => {
        if (mounted) {
          setError(requestError.response?.data?.message || 'Customers could not be loaded.');
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
      const customer = await customerService.create(values);
      setCustomers(current => [customer, ...current]);
      reset();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Customer could not be saved.');
    }
  };

  const columns = [
    { key: 'name', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'totalPurchases', label: 'Purchases', render: row => `KES ${Number(row.totalPurchases || 0).toLocaleString()}` },
    { key: 'loyaltyPoints', label: 'Points' },
    { key: 'balance', label: 'Balance', render: row => `KES ${Number(row.balance || 0).toLocaleString()}` }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Customers" description="Track loyalty, balances, and purchase history." />
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Add Customer</h3>
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
          <div style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">
              Save Customer
            </button>
          </div>
        </form>
      </div>
      {status === 'loading' ? <p className="muted">Loading customers...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <DataTable columns={columns} rows={customers} emptyMessage="No customers yet. Register your first customer above." />
    </div>
  );
}
