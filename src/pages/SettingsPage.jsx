import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { DataTable } from '../components/DataTable';
import { SectionHeader } from '../components/SectionHeader';
import { approveUser, fetchUsers, registerUser, rejectUser, disableUser, changePassword } from '../services/authService';
import { formatRole, roleOptions, ROLES, canManageUsers } from '../auth/roles';


export function SettingsPage() {
  const user = useSelector(state => state.auth.user);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // pending, active, all, password
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState('idle');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changePasswordSubmitting, setChangePasswordSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: ROLES.CASHIER
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors }, watch } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');
  const assignableRoles = roleOptions.filter(role => role !== ROLES.SUPER_ADMIN);

  const loadUsers = async () => {
    setUsersStatus('loading');
    try {
      const pending = await fetchUsers('PENDING');
      const active = await fetchUsers('ACTIVE');
      const all = await fetchUsers();
      setPendingUsers(pending);
      setActiveUsers(active);
      setAllUsers(all);
      setUsersStatus('succeeded');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'Users could not be loaded.');
      setUsersStatus('failed');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async values => {
    setMessage('');
    setError('');

    const confirmed = window.confirm(`Create ${values.fullName} as ${formatRole(values.role)}?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await registerUser(values);
      setMessage(
        response.status === 'ACTIVE'
          ? `${response.fullName} was created as ${formatRole(response.role)}.`
          : `${response.fullName}'s account request was submitted.`
      );
      reset();
      loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be created.');
    }
  };

  const handleChangePassword = async values => {
    setPasswordMessage('');
    setPasswordError('');
    setChangePasswordSubmitting(true);

    try {
      await changePassword(values.currentPassword, values.newPassword);
      setPasswordMessage('Password changed successfully.');
      resetPassword();
    } catch (requestError) {
      setPasswordError(requestError.response?.data?.message || requestError.response?.data?.error || 'Could not change password.');
    } finally {
      setChangePasswordSubmitting(false);
    }
  };

  const handleApprove = async userRecord => {
    setMessage('');
    setError('');
    try {
      const approved = await approveUser(userRecord.id, userRecord.role);
      setMessage(`${approved.fullName} was approved as ${formatRole(approved.role)}.`);
      loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be approved.');
    }
  };

  const handleReject = async userRecord => {
    setMessage('');
    setError('');
    try {
      const rejected = await rejectUser(userRecord.id);
      setMessage(`${rejected.fullName}'s account request was rejected.`);
      loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be rejected.');
    }
  };

  const handleDisable = async userRecord => {
    const confirmed = window.confirm(`Disable ${userRecord.fullName}'s account?`);
    if (!confirmed) return;

    setMessage('');
    setError('');
    try {
      const disabled = await disableUser(userRecord.id);
      setMessage(`${disabled.fullName}'s account was disabled.`);
      loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be disabled.');
    }
  };

  const pendingColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Requested Role', render: row => formatRole(row.role) },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button" type="button" onClick={() => handleApprove(row)}>
            Approve
          </button>
          <button className="button secondary" type="button" onClick={() => handleReject(row)}>
            Reject
          </button>
        </div>
      )
    }
  ];

  const activeColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: row => formatRole(row.role) },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <button 
          className="button secondary" 
          type="button" 
          onClick={() => handleDisable(row)}
          style={{ color: '#dc2626' }}
        >
          Disable
        </button>
      )
    }
  ];

  const allColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: row => formatRole(row.role) },
    { key: 'status', label: 'Status', render: row => (
      <span style={{
        padding: '4px 8px',
        borderRadius: 6,
        fontSize: '0.85rem',
        fontWeight: 500,
        background: row.status === 'ACTIVE' ? '#dcfce7' : row.status === 'PENDING' ? '#fef08a' : '#fee2e2',
        color: row.status === 'ACTIVE' ? '#15803d' : row.status === 'PENDING' ? '#854d0e' : '#dc2626'
      }}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Settings" description="Manage user accounts, approvals, passwords, and system configuration." />

      {/* User Tabs */}
      <div className="panel" style={{ padding: 0, borderRadius: 0, borderBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', borderBottom: '1px solid #e2e8f0' }}>
          {canManageUsers(user?.role) && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                style={{
                  padding: '16px',
                  border: 'none',
                  background: activeTab === 'pending' ? '#f0f9ff' : 'transparent',
                  borderBottom: activeTab === 'pending' ? '3px solid #2563eb' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'pending' ? 600 : 400,
                  color: activeTab === 'pending' ? '#2563eb' : '#64748b'
                }}
              >
                Pending ({pendingUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                style={{
                  padding: '16px',
                  border: 'none',
                  background: activeTab === 'active' ? '#f0f9ff' : 'transparent',
                  borderBottom: activeTab === 'active' ? '3px solid #2563eb' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'active' ? 600 : 400,
                  color: activeTab === 'active' ? '#2563eb' : '#64748b'
                }}
              >
                Active ({activeUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '16px',
                  border: 'none',
                  background: activeTab === 'all' ? '#f0f9ff' : 'transparent',
                  borderBottom: activeTab === 'all' ? '3px solid #2563eb' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'all' ? 600 : 400,
                  color: activeTab === 'all' ? '#2563eb' : '#64748b'
                }}
              >
                All Users ({allUsers.length})
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            style={{
              padding: '16px',
              border: 'none',
              background: activeTab === 'password' ? '#f0f9ff' : 'transparent',
              borderBottom: activeTab === 'password' ? '3px solid #2563eb' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'password' ? 600 : 400,
              color: activeTab === 'password' ? '#2563eb' : '#64748b'
            }}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Pending Users Tab */}
      {activeTab === 'pending' && canManageUsers(user?.role) && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Pending Account Requests</h3>
          <p className="muted">Employees requesting access. Review and approve or reject their requests.</p>
          {usersStatus === 'loading' ? <p className="muted">Loading pending users...</p> : null}
          <DataTable columns={pendingColumns} rows={pendingUsers} emptyMessage="No pending account requests." />
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {/* Active Users Tab */}
      {activeTab === 'active' && canManageUsers(user?.role) && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Active Users</h3>
          <p className="muted">Approved and currently active staff accounts.</p>
          {usersStatus === 'loading' ? <p className="muted">Loading users...</p> : null}
          <DataTable columns={activeColumns} rows={activeUsers} emptyMessage="No active users." />
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {/* All Users Tab */}
      {activeTab === 'all' && canManageUsers(user?.role) && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>All Users</h3>
          <p className="muted">View all users with their current status.</p>
          {usersStatus === 'loading' ? <p className="muted">Loading users...</p> : null}
          <DataTable columns={allColumns} rows={allUsers} emptyMessage="No users found." />
        </div>
      )}

      {/* Create User Tab (visible to admins) */}
      {canManageUsers(user?.role) && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Create User</h3>
          <p className="muted">Super Admins and Business Admins can create approved staff accounts directly.</p>
          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <label className="field">
              <span>Full Name</span>
              <input {...register('fullName', { required: true })} />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" {...register('email', { required: true })} />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" {...register('password', { required: true })} />
            </label>
            <label className="field">
              <span>Role</span>
              <select {...register('role', { required: true })}>
                {assignableRoles.map(role => (
                  <option key={role} value={role}>
                    {formatRole(role)}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ alignSelf: 'end' }}>
              <button className="button" type="submit">
                Create User
              </button>
            </div>
          </form>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          <p className="muted">Update your account password to keep your account secure.</p>
          <form className="form-grid" onSubmit={handlePasswordSubmit(handleChangePassword)} style={{ maxWidth: '400px' }}>
            <label className="field">
              <span>Current Password *</span>
              <input
                type="password"
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
                autoComplete="current-password"
              />
              {passwordErrors.currentPassword && <p className="error-text">{passwordErrors.currentPassword.message}</p>}
            </label>
            <label className="field">
              <span>New Password *</span>
              <input
                type="password"
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                autoComplete="new-password"
              />
              {passwordErrors.newPassword && <p className="error-text">{passwordErrors.newPassword.message}</p>}
            </label>
            <label className="field">
              <span>Confirm New Password *</span>
              <input
                type="password"
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                autoComplete="new-password"
              />
              {passwordErrors.confirmPassword && <p className="error-text">{passwordErrors.confirmPassword.message}</p>}
            </label>
            <button className="button" type="submit" disabled={changePasswordSubmitting}>
              {changePasswordSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          {passwordMessage && <p className="success-text">{passwordMessage}</p>}
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>
      )}

      {/* Environment Config */}
      <div className="panel">
        <p className="muted" style={{ marginTop: 0 }}>
          Environment variables for this Vite frontend:
        </p>
        <pre style={{ background: '#0f172a', color: 'white', padding: 16, borderRadius: 16, overflowX: 'auto' }}>
{`VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws`}
        </pre>
      </div>
    </div>
  );
}
     const setMessage = (message) => {
      // Implementation for setting message
    };
     const reset = () => {
      // Implementation for resetting form
    };
    const loadPendingUsers = () => {
      // Implementation for loading pending users
    };

      try {
        const response = await createUser(userData);
        setMessage(
          response.status === 'ACTIVE'
            ? `${response.fullName} was created as ${formatRole(response.role)}.`
            : `${response.fullName}'s account request was submitted.`
        );
      } catch (requestError) {
      const setError = (error) => {
        // Implementation for setting error
      };
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be created.');
      };

  const handleApprove = async user => {
    setMessage('');
    setError('');
    try {
      const approved = await approveUser(user.id, user.role);
      setMessage(`${approved.fullName} was approved as ${formatRole(approved.role)}.`);
      setPendingUsers(current => current.filter(item => item.id !== user.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be approved.');
    }
  };

  const handleReject = async user => {
    setMessage('');
    setError('');
    try {
      const rejected = await rejectUser(user.id);
      setMessage(`${rejected.fullName}'s account request was rejected.`);
      setPendingUsers(current => current.filter(item => item.id !== user.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.error || 'User could not be rejected.');
    
  };

  const pendingColumns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Requested Role', render: row => formatRole(row.role) },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button" type="button" onClick={() => handleApprove(row)}>
            Approve
          </button>
          <button className="button secondary" type="button" onClick={() => handleReject(row)}>
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <SectionHeader title="Settings" description="Approve employee access, create staff users, and manage role-based access." />
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Pending Account Requests</h3>
        <p className="muted">Customers and suppliers are business records only. Only internal employee accounts appear here.</p>
        {usersStatus === 'loading' ? <p className="muted">Loading pending users...</p> : null}
        <DataTable columns={pendingColumns} rows={pendingUsers} emptyMessage="No pending account requests." />
      </div>
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Create User</h3>
        <p className="muted">Super Admins and Business Admins can create approved staff accounts directly.</p>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <label className="field">
            <span>Full Name</span>
            <input {...register('fullName', { required: true })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" {...register('email', { required: true })} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" {...register('password', { required: true })} />
          </label>
          <label className="field">
            <span>Role</span>
            <select {...register('role', { required: true })}>
              {assignableRoles.map(role => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </label>
          <div style={{ alignSelf: 'end' }}>
            <button className="button" type="submit">
              Create User
            </button>
          </div>
        </form>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </div>
      <div className="panel">
        <p className="muted" style={{ marginTop: 0 }}>
          Environment variables for this Vite frontend:
        </p>
        <pre style={{ background: '#0f172a', color: 'white', padding: 16, borderRadius: 16, overflowX: 'auto' }}>
{`VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws`}
        </pre>
      </div>
    </div>
  );
  }