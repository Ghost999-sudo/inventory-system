import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pos', label: 'POS' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' }
];

export function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Inventory & Sales</div>
        <nav className="nav-list">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <div className="topbar">
          <div>
            <h1 style={{ margin: 0 }}>Business Control Center</h1>
            <p className="muted" style={{ margin: '4px 0 0' }}>
              {online ? 'Online and syncing' : 'Offline mode active'}
            </p>
          </div>
          <button className="button secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
