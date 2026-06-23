import { useSelector } from 'react-redux';
import { hasPermission, canManageUsers, canApproveUsers, canAccessPage } from '../auth/roles';

export function usePermissions() {
  const user = useSelector(state => state.auth.user);
  const userRole = user?.role;

  return {
    hasPermission: (permission) => hasPermission(userRole, permission),
    canManageUsers: () => canManageUsers(userRole),
    canApproveUsers: () => canApproveUsers(userRole),
    canAccessPage: (pageName) => canAccessPage(userRole, pageName),
    userRole
  };
}
