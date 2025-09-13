type RolePermissions = {
  pages: string[];
  canCreate: string[];
  canEdit: string[];
  canDelete: string[];
};

type UserRole = 'admin' | 'compliance_officer' | 'qa_manager' | 'developer' | 'qa_engineer';

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    pages: ['dashboard', 'test-cases', 'tickets', 'automation', 'documents', 'analytics', 'users'],
    canCreate: ['test-cases', 'tickets', 'users'],
    canEdit: ['test-cases', 'tickets', 'users'],
    canDelete: ['test-cases', 'tickets', 'users']
  },
  compliance_officer: {
    pages: ['dashboard', 'test-cases', 'tickets', 'analytics'],
    canCreate: [],
    canEdit: [],
    canDelete: []
  },
  qa_manager: {
    pages: ['dashboard', 'test-cases', 'tickets', 'automation', 'documents', 'analytics'],
    canCreate: ['test-cases', 'tickets'],
    canEdit: ['test-cases', 'tickets'],
    canDelete: ['tickets']
  },
  developer: {
    pages: ['dashboard', 'test-cases', 'tickets', 'documents', 'analytics', 'users'],
    canCreate: ['tickets', 'documents'],
    canEdit: ['tickets', 'documents'],
    canDelete: []
  },
  qa_engineer: {
    pages: ['dashboard', 'test-cases', 'tickets', 'automation', 'documents', 'analytics'],  // Added automation, analytics
    canCreate: ['tickets'],
    canEdit: ['test-cases', 'tickets'],  // Added test-cases
    canDelete: []
  }
};


export const hasPageAccess = (userRole: string, page: string): boolean => {
  console.log('=== PERMISSION CHECK ===');
  console.log('User Role:', userRole, 'Type:', typeof userRole);
  console.log('Page:', page, 'Type:', typeof page);
  const role = userRole as UserRole;
  console.log('Role permissions object:', rolePermissions[role]);
  if (rolePermissions[role]) {
    console.log('Allowed pages:', rolePermissions[role].pages);
    console.log('Page includes check:', rolePermissions[role].pages.includes(page));
  }
  const hasAccess = rolePermissions[role]?.pages.includes(page) || false;
  console.log('Final result:', hasAccess);
  console.log('========================');
  return hasAccess;
};

export const canPerformAction = (userRole: string, action: 'create' | 'edit' | 'delete', resource: string): boolean => {
  const role = userRole as UserRole;
  const permissions = rolePermissions[role];
  if (!permissions) return false;

  const actionKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof RolePermissions;
  return (permissions[actionKey] as string[]).includes(resource);
};
