/**
 * RBAC (Role-Based Access Control) Configuration
 * 
 * Defines all user roles and their associated permissions.
 * Used by authorization middleware to enforce access control.
 */

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  CUSTOMS_OFFICER = 'CUSTOMS_OFFICER',
}

/**
 * Permission Codes
 */
export enum Permission {
  // Authentication & User Management
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_REFRESH_TOKEN = 'AUTH_REFRESH_TOKEN',
  
  // File Operations
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_DELETE = 'FILE_DELETE',
  FILE_VIEW = 'FILE_VIEW',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  
  // DUA Report Operations
  REPORT_CREATE = 'REPORT_CREATE',
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_DOWNLOAD = 'REPORT_DOWNLOAD',
  REPORT_DELETE = 'REPORT_DELETE',
  REPORT_VIEW_ALL = 'REPORT_VIEW_ALL', // View all users' reports
  
  // Template Management
  TEMPLATE_CREATE = 'TEMPLATE_CREATE',
  TEMPLATE_UPDATE = 'TEMPLATE_UPDATE',
  TEMPLATE_DELETE = 'TEMPLATE_DELETE',
  TEMPLATE_VIEW = 'TEMPLATE_VIEW',
  
  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_VIEW = 'USER_VIEW',
  USER_VIEW_ALL = 'USER_VIEW_ALL',
  
  // System Monitoring
  MONITOR_PROCESSES = 'MONITOR_PROCESSES',
  MONITOR_METRICS = 'MONITOR_METRICS',
  MONITOR_LOGS = 'MONITOR_LOGS',
  
  // Support Operations
  SUPPORT_VIEW_TICKETS = 'SUPPORT_VIEW_TICKETS',
  SUPPORT_RESPOND = 'SUPPORT_RESPOND',
  
  // System Administration
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
}

/**
 * Role Permission Matrix
 * 
 * Defines which permissions are granted to each role
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  /**
   * ADMIN Role
   * - Full system access
   * - Manages users and templates
   * - Monitors all processes and system health
   * - Can perform system configuration
   */
  [UserRole.ADMIN]: [
    // Authentication
    Permission.AUTH_LOGIN,
    Permission.AUTH_LOGOUT,
    Permission.AUTH_REFRESH_TOKEN,
    
    // Files
    Permission.FILE_UPLOAD,
    Permission.FILE_DELETE,
    Permission.FILE_VIEW,
    Permission.FILE_DOWNLOAD,
    
    // Reports (all users)
    Permission.REPORT_CREATE,
    Permission.REPORT_VIEW,
    Permission.REPORT_DOWNLOAD,
    Permission.REPORT_DELETE,
    Permission.REPORT_VIEW_ALL,
    
    // Templates
    Permission.TEMPLATE_CREATE,
    Permission.TEMPLATE_UPDATE,
    Permission.TEMPLATE_DELETE,
    Permission.TEMPLATE_VIEW,
    
    // User Management
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_VIEW,
    Permission.USER_VIEW_ALL,
    
    // Monitoring
    Permission.MONITOR_PROCESSES,
    Permission.MONITOR_METRICS,
    Permission.MONITOR_LOGS,
    
    // Support
    Permission.SUPPORT_VIEW_TICKETS,
    Permission.SUPPORT_RESPOND,
    
    // System
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_MAINTENANCE,
  ],

  /**
   * SUPPORT Role
   * - Available to answer user questions
   * - Can view user reports to provide assistance
   * - Can view system logs for troubleshooting
   * - Limited modification capabilities
   */
  [UserRole.SUPPORT]: [
    // Authentication
    Permission.AUTH_LOGIN,
    Permission.AUTH_LOGOUT,
    Permission.AUTH_REFRESH_TOKEN,
    
    // Files (view only)
    Permission.FILE_VIEW,
    Permission.FILE_DOWNLOAD,
    
    // Reports (view all for support)
    Permission.REPORT_VIEW,
    Permission.REPORT_VIEW_ALL,
    Permission.REPORT_DOWNLOAD,
    
    // Templates (view only)
    Permission.TEMPLATE_VIEW,
    
    // Users (view only)
    Permission.USER_VIEW,
    Permission.USER_VIEW_ALL,
    
    // Monitoring (limited)
    Permission.MONITOR_PROCESSES,
    Permission.MONITOR_LOGS,
    
    // Support tickets
    Permission.SUPPORT_VIEW_TICKETS,
    Permission.SUPPORT_RESPOND,
  ],

  /**
   * CUSTOMS_OFFICER Role
   * - Generate DUA reports
   * - Upload and manage own files
   * - View and download own reports
   * - No administrative capabilities
   */
  [UserRole.CUSTOMS_OFFICER]: [
    // Authentication
    Permission.AUTH_LOGIN,
    Permission.AUTH_LOGOUT,
    Permission.AUTH_REFRESH_TOKEN,
    
    // Files (own only)
    Permission.FILE_UPLOAD,
    Permission.FILE_DELETE,
    Permission.FILE_VIEW,
    Permission.FILE_DOWNLOAD,
    
    // Reports (own only)
    Permission.REPORT_CREATE,
    Permission.REPORT_VIEW,
    Permission.REPORT_DOWNLOAD,
    Permission.REPORT_DELETE,
    
    // Templates (view only)
    Permission.TEMPLATE_VIEW,
    
    // Users (view own profile)
    Permission.USER_VIEW,
  ],
};

/**
 * Permission Descriptions
 * Human-readable descriptions for each permission
 */
export const PermissionDescriptions: Record<Permission, string> = {
  // Authentication
  [Permission.AUTH_LOGIN]: 'Login to the system',
  [Permission.AUTH_LOGOUT]: 'Logout from the system',
  [Permission.AUTH_REFRESH_TOKEN]: 'Refresh authentication token',
  
  // Files
  [Permission.FILE_UPLOAD]: 'Upload files for processing',
  [Permission.FILE_DELETE]: 'Delete uploaded files',
  [Permission.FILE_VIEW]: 'View uploaded files',
  [Permission.FILE_DOWNLOAD]: 'Download files',
  
  // Reports
  [Permission.REPORT_CREATE]: 'Create new DUA reports',
  [Permission.REPORT_VIEW]: 'View DUA reports',
  [Permission.REPORT_DOWNLOAD]: 'Download DUA reports',
  [Permission.REPORT_DELETE]: 'Delete DUA reports',
  [Permission.REPORT_VIEW_ALL]: 'View all users\' reports',
  
  // Templates
  [Permission.TEMPLATE_CREATE]: 'Create new DUA templates',
  [Permission.TEMPLATE_UPDATE]: 'Update existing templates',
  [Permission.TEMPLATE_DELETE]: 'Delete templates',
  [Permission.TEMPLATE_VIEW]: 'View DUA templates',
  
  // Users
  [Permission.USER_CREATE]: 'Create new user accounts',
  [Permission.USER_UPDATE]: 'Update user accounts',
  [Permission.USER_DELETE]: 'Delete user accounts',
  [Permission.USER_VIEW]: 'View user profile',
  [Permission.USER_VIEW_ALL]: 'View all user profiles',
  
  // Monitoring
  [Permission.MONITOR_PROCESSES]: 'Monitor active processes',
  [Permission.MONITOR_METRICS]: 'View system metrics',
  [Permission.MONITOR_LOGS]: 'Access system logs',
  
  // Support
  [Permission.SUPPORT_VIEW_TICKETS]: 'View support tickets',
  [Permission.SUPPORT_RESPOND]: 'Respond to support tickets',
  
  // System
  [Permission.SYSTEM_CONFIG]: 'Configure system settings',
  [Permission.SYSTEM_MAINTENANCE]: 'Perform system maintenance',
};

/**
 * Role Descriptions
 */
export const RoleDescriptions: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'System administrator with full access to manage users, templates, and monitor all processes',
  [UserRole.SUPPORT]: 'Technical support staff available to assist users with questions and troubleshooting',
  [UserRole.CUSTOMS_OFFICER]: 'Customs specialist who generates and manages DUA reports',
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return RolePermissions[role] ?? [];
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role);
  return permissions.some(permission => rolePermissions.includes(permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role);
  return permissions.every(permission => rolePermissions.includes(permission));
}
