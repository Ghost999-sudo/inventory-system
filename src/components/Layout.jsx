import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { formatRole, hasRole, navLinks } from '../auth/roles';

export function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const user = useSelector(state => state.auth.user);
  const availableLinks = navLinks.filter(link => hasRole(user?.role, link.roles));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Inventory & Sales</div>
        <nav className="nav-list">
          {availableLinks.map(link => (
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
              {online ? 'Online and syncing' : 'Offline mode active'} · {formatRole(user?.role)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <strong>{user?.fullName || user?.name || 'Authenticated User'}</strong>
              <div className="muted">{user?.email}</div>
            </div>
            <button className="button secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
