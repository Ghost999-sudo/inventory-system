export const initialProducts = [
  { id: 'p1', name: 'Milk 500ml', category: 'Dairy', barcode: '123456', price: 70, cost: 55, quantity: 50, status: 'Available', supplier: 'Fresh Farms' },
  { id: 'p2', name: 'Bread Loaf', category: 'Bakery', barcode: '654321', price: 80, cost: 60, quantity: 18, status: 'Low Stock', supplier: 'Bake House' },
  { id: 'p3', name: 'Laundry Soap', category: 'Household', barcode: '884422', price: 120, cost: 95, quantity: 32, status: 'Available', supplier: 'Clean Plus' }
];

export const initialCustomers = [
  { id: 'c1', name: 'John Doe', purchases: 35000, points: 300, balance: 0 },
  { id: 'c2', name: 'Mary Wambui', purchases: 12500, points: 120, balance: 500 }
];

export const initialSuppliers = [
  { id: 's1', name: 'Fresh Farms', contact: '+254700000001', items: 18, deliveries: 'On time' },
  { id: 's2', name: 'Bake House', contact: '+254700000002', items: 9, deliveries: 'Due today' }
];

export const initialSales = [
  {
    id: 'o1',
    createdAt: new Date().toISOString(),
    paymentMethod: 'Cash',
    total: 220,
    items: [
      { productId: 'p1', name: 'Milk 500ml', qty: 2, price: 70 },
      { productId: 'p2', name: 'Bread Loaf', qty: 1, price: 80 }
    ]
  }
];

export const reportData = [
  { name: 'Mon', sales: 3200, profit: 900, expenses: 500 },
  { name: 'Tue', sales: 4100, profit: 1200, expenses: 650 },
  { name: 'Wed', sales: 2900, profit: 800, expenses: 400 },
  { name: 'Thu', sales: 5300, profit: 1500, expenses: 700 },
  { name: 'Fri', sales: 6100, profit: 1800, expenses: 850 }
];
