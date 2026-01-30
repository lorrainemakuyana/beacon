export declare const APP_CONFIG: {
    readonly name: "Beacon";
    readonly version: "1.0.0";
    readonly description: "Volunteer operations platform";
    readonly supportEmail: "support@beacon.app";
    readonly websiteUrl: "https://beacon.app";
};
export declare const API_LIMITS: {
    readonly MAX_EVENTS_PER_PAGE: 20;
    readonly MAX_VOLUNTEERS_PER_EVENT: 300;
    readonly MAX_SHIFTS_PER_EVENT: 50;
    readonly MAX_INCIDENT_PHOTOS: 5;
    readonly MAX_FILE_SIZE_MB: 10;
    readonly INCIDENT_REPORT_TIMEOUT_SECONDS: 30;
    readonly REAL_TIME_SYNC_TIMEOUT_SECONDS: 5;
};
export declare const PERMISSIONS: {
    readonly volunteer: readonly ["view_events", "join_shifts", "check_in_out", "report_incidents", "view_own_data"];
    readonly coordinator: readonly ["create_events", "manage_events", "view_attendance", "manage_incidents", "invite_collaborators"];
    readonly collaborator: readonly ["view_assigned_events", "manage_shifts", "view_attendance", "manage_incidents"];
    readonly owner: readonly ["manage_organization", "manage_payments", "manage_users", "view_analytics"];
};
export declare const NOTIFICATION_TYPES: {
    readonly EVENT_CREATED: "event_created";
    readonly EVENT_UPDATED: "event_updated";
    readonly SHIFT_REMINDER: "shift_reminder";
    readonly INCIDENT_REPORTED: "incident_reported";
    readonly INCIDENT_UPDATED: "incident_updated";
    readonly ATTENDANCE_ALERT: "attendance_alert";
    readonly PAYMENT_REQUIRED: "payment_required";
    readonly GENERAL_ANNOUNCEMENT: "general_announcement";
};
export declare const TIME_CONSTANTS: {
    readonly SHIFT_REMINDER_HOURS: 2;
    readonly CHECK_IN_WINDOW_MINUTES: 15;
    readonly NO_SHOW_THRESHOLD_MINUTES: 30;
    readonly SESSION_TIMEOUT_MINUTES: 60;
};
export declare const VALIDATION: {
    readonly MIN_PASSWORD_LENGTH: 8;
    readonly MAX_EVENT_TITLE_LENGTH: 100;
    readonly MAX_EVENT_DESCRIPTION_LENGTH: 1000;
    readonly MAX_INCIDENT_TITLE_LENGTH: 100;
    readonly MAX_INCIDENT_DESCRIPTION_LENGTH: 500;
    readonly MAX_FILE_SIZE_MB: 10;
    readonly PHONE_REGEX: RegExp;
    readonly EMAIL_REGEX: RegExp;
};
