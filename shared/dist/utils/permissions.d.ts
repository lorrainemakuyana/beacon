import { UserRole } from '../types';
/**
 * Check if a user role has a specific permission
 */
export declare function hasPermission(role: UserRole, permission: string): boolean;
/**
 * Check if a user can create events
 */
export declare function canCreateEvents(role: UserRole): boolean;
/**
 * Check if a user can manage events
 */
export declare function canManageEvents(role: UserRole): boolean;
/**
 * Check if a user can view attendance
 */
export declare function canViewAttendance(role: UserRole): boolean;
/**
 * Check if a user can manage incidents
 */
export declare function canManageIncidents(role: UserRole): boolean;
/**
 * Check if a user can manage organization
 */
export declare function canManageOrganization(role: UserRole): boolean;
/**
 * Check if a user can manage payments
 */
export declare function canManagePayments(role: UserRole): boolean;
/**
 * Check if a user can invite collaborators
 */
export declare function canInviteCollaborators(role: UserRole): boolean;
/**
 * Check if a user can join shifts
 */
export declare function canJoinShifts(role: UserRole): boolean;
/**
 * Check if a user can check in/out
 */
export declare function canCheckInOut(role: UserRole): boolean;
/**
 * Check if a user can report incidents
 */
export declare function canReportIncidents(role: UserRole): boolean;
/**
 * Get all permissions for a role
 */
export declare function getRolePermissions(role: UserRole): string[];
/**
 * Check if a role is coordinator-level or higher
 */
export declare function isCoordinatorOrHigher(role: UserRole): boolean;
/**
 * Check if a role is owner
 */
export declare function isOwner(role: UserRole): boolean;
/**
 * Check if a role is volunteer
 */
export declare function isVolunteer(role: UserRole): boolean;
/**
 * Get the highest role from a list of roles
 */
export declare function getHighestRole(roles: UserRole[]): UserRole;
