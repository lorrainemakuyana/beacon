import { Timestamp, GeoPoint } from 'firebase/firestore';

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