export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
  CASHIER: 'CASHIER',
  STORE_KEEPER: 'STORE_KEEPER'
};

export const roleOptions = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.ACCOUNTANT,
  ROLES.CASHIER,
  ROLES.STORE_KEEPER
];

export const roleLabels = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Business Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.ACCOUNTANT]: 'Accountant',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.STORE_KEEPER]: 'Store Keeper'
};

export const PAGE_ACCESS = {
  dashboard: null,
  pos: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  inventory: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_KEEPER],
  products: null,
  customers: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER],
  suppliers: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_KEEPER],
  reports: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNTANT],
  settings: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
};

export const navLinks = [
  { to: '/dashboard', label: 'Dashboard', roles: PAGE_ACCESS.dashboard },
  { to: '/pos', label: 'POS', roles: PAGE_ACCESS.pos },
  { to: '/inventory', label: 'Inventory', roles: PAGE_ACCESS.inventory },
  { to: '/products', label: 'Products', roles: PAGE_ACCESS.products },
  { to: '/customers', label: 'Customers', roles: PAGE_ACCESS.customers },
  { to: '/suppliers', label: 'Suppliers', roles: PAGE_ACCESS.suppliers },
  { to: '/reports', label: 'Reports', roles: PAGE_ACCESS.reports },
  { to: '/settings', label: 'Settings', roles: PAGE_ACCESS.settings }
];

export const dashboardProfiles = {
  [ROLES.SUPER_ADMIN]: {
    title: 'Super Admin Dashboard',
    description: 'Full system administration, users, settings, integrations, stock, sales, payments, and reports.',
    focus: 'System administration'
  },
  [ROLES.ADMIN]: {
    title: 'Business Admin Dashboard',
    description: 'Business operations, user approvals, stock, sales, finance, and reports.',
    focus: 'Business control'
  },
  [ROLES.MANAGER]: {
    title: 'Manager Dashboard',
    description: 'Daily operations, stock supervision, cashier activity, suppliers, and performance reports.',
    focus: 'Operations and stock'
  },
  [ROLES.ACCOUNTANT]: {
    title: 'Accountant Dashboard',
    description: 'Revenue, profit, payment verification, expenses, taxes, and financial summaries.',
    focus: 'Financial information'
  },
  [ROLES.CASHIER]: {
    title: 'Cashier Dashboard',
    description: 'POS checkout, customer registration, receipts, and payment processing.',
    focus: 'POS and customers'
  },
  [ROLES.STORE_KEEPER]: {
    title: 'Store Keeper Dashboard',
    description: 'Receiving goods, stock counting, damaged goods, batches, expiry dates, and low-stock alerts.',
    focus: 'Inventory only'
  },
};

// Permissions
export const PERMISSIONS = {
  // User Management
  APPROVE_USERS: 'APPROVE_USERS',
  CREATE_USERS: 'CREATE_USERS',
  MANAGE_ROLES: 'MANAGE_ROLES',
  
  // Inventory
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  MANAGE_STOCK: 'MANAGE_STOCK',
  VIEW_STOCK: 'VIEW_STOCK',
  
  // Sales
  MAKE_SALES: 'MAKE_SALES',
  MANAGE_SALES: 'MANAGE_SALES',
  
  // Suppliers
  MANAGE_SUPPLIERS: 'MANAGE_SUPPLIERS',
  
  // Reports
  VIEW_REPORTS: 'VIEW_REPORTS',
  VIEW_PROFIT: 'VIEW_PROFIT',
  
  // Settings
  MANAGE_SETTINGS: 'MANAGE_SETTINGS'
};

export const PERMISSION_MATRIX = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.APPROVE_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.MAKE_SALES,
    PERMISSIONS.MANAGE_SALES,
    PERMISSIONS.MANAGE_SUPPLIERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_PROFIT,
    PERMISSIONS.MANAGE_SETTINGS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.APPROVE_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.MAKE_SALES,
    PERMISSIONS.MANAGE_SALES,
    PERMISSIONS.MANAGE_SUPPLIERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_PROFIT
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.MANAGE_SALES,
    PERMISSIONS.MANAGE_SUPPLIERS,
    PERMISSIONS.VIEW_REPORTS
  ],
  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_PROFIT
  ],
  [ROLES.CASHIER]: [
    PERMISSIONS.MAKE_SALES,
    PERMISSIONS.VIEW_STOCK
  ],
  [ROLES.STORE_KEEPER]: [
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.VIEW_STOCK
  ]
};

export function hasRole(userRole, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(userRole);
}

export function hasPermission(userRole, permission) {
  const permissions = PERMISSION_MATRIX[userRole] || [];
  return permissions.includes(permission);
}

export function canManageUsers(userRole) {
  return hasPermission(userRole, PERMISSIONS.APPROVE_USERS);
}

export function canApproveUsers(userRole) {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole);
}

export function canAccessPage(userRole, pageName) {
  const allowedRoles = PAGE_ACCESS[pageName];
  if (!allowedRoles) return true;
  return allowedRoles.includes(userRole);
}

export function formatRole(role) {
  return roleLabels[role] || role || 'User';
}
