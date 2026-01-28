import { UserRole } from '../types';
import { PERMISSIONS } from '../constants';

type Permission = typeof PERMISSIONS[UserRole][number];

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const rolePermissions = PERMISSIONS[role] as readonly string[];
  return rolePermissions.includes(permission);
}

/**
 * Check if a user can create events
 */
export function canCreateEvents(role: UserRole): boolean {
  return hasPermission(role, 'create_events');
}

/**
 * Check if a user can manage events
 */
export function canManageEvents(role: UserRole): boolean {
  return hasPermission(role, 'manage_events');
}

/**
 * Check if a user can view attendance
 */
export function canViewAttendance(role: UserRole): boolean {
  return hasPermission(role, 'view_attendance');
}

/**
 * Check if a user can manage incidents
 */
export function canManageIncidents(role: UserRole): boolean {
  return hasPermission(role, 'manage_incidents');
}

/**
 * Check if a user can manage organization
 */
export function canManageOrganization(role: UserRole): boolean {
  return hasPermission(role, 'manage_organization');
}

/**
 * Check if a user can manage payments
 */
export function canManagePayments(role: UserRole): boolean {
  return hasPermission(role, 'manage_payments');
}

/**
 * Check if a user can invite collaborators
 */
export function canInviteCollaborators(role: UserRole): boolean {
  return hasPermission(role, 'invite_collaborators');
}

/**
 * Check if a user can join shifts
 */
export function canJoinShifts(role: UserRole): boolean {
  return hasPermission(role, 'join_shifts');
}

/**
 * Check if a user can check in/out
 */
export function canCheckInOut(role: UserRole): boolean {
  return hasPermission(role, 'check_in_out');
}

/**
 * Check if a user can report incidents
 */
export function canReportIncidents(role: UserRole): boolean {
  return hasPermission(role, 'report_incidents');
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return [...PERMISSIONS[role]] as string[];
}

/**
 * Check if a role is coordinator-level or higher
 */
export function isCoordinatorOrHigher(role: UserRole): boolean {
  return ['coordinator', 'owner'].includes(role);
}

/**
 * Check if a role is owner
 */
export function isOwner(role: UserRole): boolean {
  return role === 'owner';
}

/**
 * Check if a role is volunteer
 */
export function isVolunteer(role: UserRole): boolean {
  return role === 'volunteer';
}

/**
 * Get the highest role from a list of roles
 */
export function getHighestRole(roles: UserRole[]): UserRole {
  const roleHierarchy: Record<UserRole, number> = {
    volunteer: 1,
    collaborator: 2,
    coordinator: 3,
    owner: 4,
  };

  return roles.reduce((highest, current) => {
    return roleHierarchy[current] > roleHierarchy[highest] ? current : highest;
  }, roles[0]);
}