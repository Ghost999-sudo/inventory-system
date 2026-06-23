import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { DashboardPage } from './pages/DashboardPage';
import { PosPage } from './pages/PosPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PAGE_ACCESS } from './auth/roles';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pos" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.pos}><PosPage /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.inventory}><InventoryPage /></ProtectedRoute>} />
        <Route path="products" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.products}><ProductsPage /></ProtectedRoute>} />
        <Route path="customers" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.customers}><CustomersPage /></ProtectedRoute>} />
        <Route path="suppliers" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.suppliers}><SuppliersPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.reports}><ReportsPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute allowedRoles={PAGE_ACCESS.settings}><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
