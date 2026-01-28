import { Timestamp, GeoPoint } from 'firebase/firestore';

// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'volunteer' | 'coordinator' | 'collaborator' | 'owner';
  organizationId?: string;
  profile: {
    phone?: string;
    emergencyContact?: string;
    skills: string[];
    availability: string[];
  };
  createdAt: Timestamp;
  lastActive: Timestamp;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  settings: {
    defaultEventSettings: Partial<Event>;
    notificationPreferences: NotificationPreferences;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Event types
export interface Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: GeoPoint;
  };
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
  shifts: Shift[];
  coordinators: string[]; // User UIDs
  collaborators: string[]; // User UIDs
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  pricing: {
    basePrice: number;
    volunteerTiers: { count: number; price: number }[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Shift types
export interface Shift {
  id: string;
  eventId: string;
  title: string;
  description: string;
  timeSlot: {
    start: Timestamp;
    end: Timestamp;
  };
  requiredVolunteers: number;
  assignedVolunteers: string[]; // User UIDs
  roles: {
    title: string;
    description: string;
    count: number;
    assignedTo: string[]; // User UIDs
  }[];
  status: 'open' | 'full' | 'active' | 'completed';
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  eventId: string;
  shiftId: string;
  volunteerId: string;
  checkIn: {
    timestamp: Timestamp;
    location?: GeoPoint;
    method: 'manual' | 'qr' | 'geofence';
  };
  checkOut?: {
    timestamp: Timestamp;
    location?: GeoPoint;
    method: 'manual' | 'qr' | 'geofence';
  };
  status: 'checked-in' | 'checked-out' | 'no-show';
}

// Incident types
export interface Incident {
  id: string;
  eventId: string;
  shiftId?: string;
  reporterId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'safety' | 'equipment' | 'volunteer' | 'other';
  location?: GeoPoint;
  photos?: string[]; // Storage URLs
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo?: string; // Coordinator UID
  resolution?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  eventId?: string;
  type: 'event_update' | 'shift_reminder' | 'incident_alert' | 'system_message';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Timestamp;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  shiftReminders: boolean;
  eventUpdates: boolean;
  incidentAlerts: boolean;
  systemMessages: boolean;
}

// Payment types
export interface Payment {
  id: string;
  organizationId: string;
  eventId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  stripePaymentIntentId?: string;
  metadata: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  EVENTS: 'events',
  SHIFTS: 'shifts',
  ATTENDANCE: 'attendance',
  INCIDENTS: 'incidents',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
} as const;