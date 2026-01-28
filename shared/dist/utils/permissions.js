"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.canCreateEvents = canCreateEvents;
exports.canManageEvents = canManageEvents;
exports.canViewAttendance = canViewAttendance;
exports.canManageIncidents = canManageIncidents;
exports.canManageOrganization = canManageOrganization;
exports.canManagePayments = canManagePayments;
exports.canInviteCollaborators = canInviteCollaborators;
exports.canJoinShifts = canJoinShifts;
exports.canCheckInOut = canCheckInOut;
exports.canReportIncidents = canReportIncidents;
exports.getRolePermissions = getRolePermissions;
exports.isCoordinatorOrHigher = isCoordinatorOrHigher;
exports.isOwner = isOwner;
exports.isVolunteer = isVolunteer;
exports.getHighestRole = getHighestRole;
const constants_1 = require("../constants");
/**
 * Check if a user role has a specific permission
 */
function hasPermission(role, permission) {
    const rolePermissions = constants_1.PERMISSIONS[role];
    return rolePermissions.includes(permission);
}
/**
 * Check if a user can create events
 */
function canCreateEvents(role) {
    return hasPermission(role, 'create_events');
}
/**
 * Check if a user can manage events
 */
function canManageEvents(role) {
    return hasPermission(role, 'manage_events');
}
/**
 * Check if a user can view attendance
 */
function canViewAttendance(role) {
    return hasPermission(role, 'view_attendance');
}
/**
 * Check if a user can manage incidents
 */
function canManageIncidents(role) {
    return hasPermission(role, 'manage_incidents');
}
/**
 * Check if a user can manage organization
 */
function canManageOrganization(role) {
    return hasPermission(role, 'manage_organization');
}
/**
 * Check if a user can manage payments
 */
function canManagePayments(role) {
    return hasPermission(role, 'manage_payments');
}
/**
 * Check if a user can invite collaborators
 */
function canInviteCollaborators(role) {
    return hasPermission(role, 'invite_collaborators');
}
/**
 * Check if a user can join shifts
 */
function canJoinShifts(role) {
    return hasPermission(role, 'join_shifts');
}
/**
 * Check if a user can check in/out
 */
function canCheckInOut(role) {
    return hasPermission(role, 'check_in_out');
}
/**
 * Check if a user can report incidents
 */
function canReportIncidents(role) {
    return hasPermission(role, 'report_incidents');
}
/**
 * Get all permissions for a role
 */
function getRolePermissions(role) {
    return [...constants_1.PERMISSIONS[role]];
}
/**
 * Check if a role is coordinator-level or higher
 */
function isCoordinatorOrHigher(role) {
    return ['coordinator', 'owner'].includes(role);
}
/**
 * Check if a role is owner
 */
function isOwner(role) {
    return role === 'owner';
}
/**
 * Check if a role is volunteer
 */
function isVolunteer(role) {
    return role === 'volunteer';
}
/**
 * Get the highest role from a list of roles
 */
function getHighestRole(roles) {
    const roleHierarchy = {
        volunteer: 1,
        collaborator: 2,
        coordinator: 3,
        owner: 4,
    };
    return roles.reduce((highest, current) => {
        return roleHierarchy[current] > roleHierarchy[highest] ? current : highest;
    }, roles[0]);
}
