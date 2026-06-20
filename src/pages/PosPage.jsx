import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, completeSale, removeFromCart, updateCartQuantity } from '../store/slices/salesSlice';
import { adjustStock } from '../store/slices/inventorySlice';
import { SectionHeader } from '../components/SectionHeader';

export function PosPage() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.inventory.products);
  const cart = useSelector(state => state.sales.cart);
  const [query, setQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const filteredProducts = useMemo(() => {
    const value = query.toLowerCase();
    return products.filter(product => product.name.toLowerCase().includes(value) || product.barcode.includes(value));
  }, [products, query]);

  const total = cart.reduce((sum, item) => sum + item.qty * item.product.price, 0);

  const handleAddToCart = product => {
    dispatch(addToCart({ product, qty: 1 }));
  };

  const handleCheckout = () => {
    dispatch(
      completeSale({
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          qty: item.qty,
          price: item.product.price
        })),
        paymentMethod,
        total
      })
    );
    cart.forEach(item => {
      dispatch(adjustStock({ id: item.product.id, delta: -item.qty }));
    });
  };

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="POS" description="Fast checkout, barcode lookup, and payments." />

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
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
            {filteredProducts.map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <strong>{product.name}</strong>
                  <div className="muted">{product.category} • Barcode {product.barcode}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>KES {product.price}</div>
                  <button className="button" onClick={() => handleAddToCart(product)}>
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
                <div className="muted">KES {item.product.price} each</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                  <input
                    type="number"
                    min="1"
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
            <button className="button" style={{ width: '100%', marginTop: 16 }} onClick={handleCheckout} disabled={cart.length === 0}>
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
