// App configuration constants
export const APP_CONFIG = {
  name: 'Beacon',
  version: '1.0.0',
  description: 'Volunteer operations platform',
  supportEmail: 'support@beacon.app',
  websiteUrl: 'https://beacon.app',
} as const;

// API endpoints and limits
export const API_LIMITS = {
  MAX_EVENTS_PER_PAGE: 20,
  MAX_VOLUNTEERS_PER_EVENT: 300,
  MAX_SHIFTS_PER_EVENT: 50,
  MAX_INCIDENT_PHOTOS: 5,
  MAX_FILE_SIZE_MB: 10,
  INCIDENT_REPORT_TIMEOUT_SECONDS: 30,
  REAL_TIME_SYNC_TIMEOUT_SECONDS: 5,
} as const;

// User role permissions
export const PERMISSIONS = {
  volunteer: [
    'view_events',
    'join_shifts',
    'check_in_out',
    'report_incidents',
    'view_own_data',
  ] as const,
  coordinator: [
    'create_events',
    'manage_events',
    'view_attendance',
    'manage_incidents',
    'invite_collaborators',
  ] as const,
  collaborator: [
    'view_assigned_events',
    'manage_shifts',
    'view_attendance',
    'manage_incidents',
  ] as const,
  owner: [
    'manage_organization',
    'manage_payments',
    'manage_users',
    'view_analytics',
  ] as const,
} as const;

// Notification settings
export const NOTIFICATION_TYPES = {
  EVENT_CREATED: 'event_created',
  EVENT_UPDATED: 'event_updated',
  SHIFT_REMINDER: 'shift_reminder',
  INCIDENT_REPORTED: 'incident_reported',
  INCIDENT_UPDATED: 'incident_updated',
  ATTENDANCE_ALERT: 'attendance_alert',
  PAYMENT_REQUIRED: 'payment_required',
  GENERAL_ANNOUNCEMENT: 'general_announcement',
} as const;

// Time constants
export const TIME_CONSTANTS = {
  SHIFT_REMINDER_HOURS: 2,
  CHECK_IN_WINDOW_MINUTES: 15,
  NO_SHOW_THRESHOLD_MINUTES: 30,
  SESSION_TIMEOUT_MINUTES: 60,
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_EVENT_TITLE_LENGTH: 100,
  MAX_EVENT_DESCRIPTION_LENGTH: 1000,
  MAX_INCIDENT_TITLE_LENGTH: 100,
  MAX_INCIDENT_DESCRIPTION_LENGTH: 500,
  MAX_FILE_SIZE_MB: 10,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;