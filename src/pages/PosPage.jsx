import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, createSale, removeFromCart, updateCartQuantity } from '../store/slices/salesSlice';
import { fetchProducts } from '../store/slices/inventorySlice';
import { SectionHeader } from '../components/SectionHeader';

export function PosPage() {
  const dispatch = useDispatch();
  const { products, status: productStatus } = useSelector(state => state.inventory);
  const cart = useSelector(state => state.sales.cart);
  const user = useSelector(state => state.auth.user);
  const [query, setQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [error, setError] = useState('');

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productStatus]);

  const filteredProducts = useMemo(() => {
    const value = query.toLowerCase();
    return products.filter(product => product.name.toLowerCase().includes(value) || product.barcode.includes(value));
  }, [products, query]);

  const total = cart.reduce((sum, item) => sum + item.qty * Number(item.product.sellingPrice), 0);

  const handleAddToCart = product => {
    if (product.quantity <= 0) {
      return;
    }
    dispatch(addToCart({ product, qty: 1 }));
  };

  const handleCheckout = async () => {
    setError('');
    try {
      await dispatch(
        createSale({
          customerName: '',
          cashierName: user?.fullName || user?.email || 'Cashier',
          paymentMethod,
          discount: 0,
          tax: 0,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.qty
          }))
        })
      ).unwrap();
      dispatch(fetchProducts());
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Sale could not be completed.');
    }
  };

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="POS" description="Fast checkout, barcode lookup, and payments." />

      <div className="grid pos-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 style={{ margin: 0 }}>Products</h3>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                Search and add items to the cart.
              </p>
            </div>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search by name or barcode"
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)' }}
            />
          </div>
          <div className="grid" style={{ gap: 12 }}>
            {productStatus === 'loading' ? <p className="muted">Loading products...</p> : null}
            {filteredProducts.length === 0 && productStatus !== 'loading' ? (
              <p className="muted">No products available yet. Add products from Inventory first.</p>
            ) : null}
            {filteredProducts.map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <strong>{product.name}</strong>
                  <div className="muted">
                    {product.category} · Barcode {product.barcode} · {product.quantity} in stock
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>KES {Number(product.sellingPrice).toLocaleString()}</div>
                  <button className="button" onClick={() => handleAddToCart(product)} disabled={product.quantity <= 0}>
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Cart</h3>
          <div className="grid" style={{ gap: 10 }}>
            {cart.length === 0 ? <p className="muted">No items in cart yet.</p> : null}
            {cart.map(item => (
              <div key={item.product.id} className="card">
                <strong>{item.product.name}</strong>
                <div className="muted">KES {Number(item.product.sellingPrice).toLocaleString()} each</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                  <input
                    type="number"
                    min="1"
                    max={item.product.quantity}
                    value={item.qty}
                    onChange={event => dispatch(updateCartQuantity({ id: item.product.id, qty: Number(event.target.value) }))}
                    style={{ width: 80, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)' }}
                  />
                  <button className="button secondary" onClick={() => dispatch(removeFromCart(item.product.id))}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="field">
              <span>Payment method</span>
              <select value={paymentMethod} onChange={event => setPaymentMethod(event.target.value)}>
                <option>Cash</option>
                <option>Card</option>
                <option>M-Pesa</option>
              </select>
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <strong>Total</strong>
              <strong>KES {total.toLocaleString()}</strong>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
            <button className="button" style={{ width: '100%', marginTop: 16 }} onClick={handleCheckout} disabled={cart.length === 0}>
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
