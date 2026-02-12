import { Timestamp, GeoPoint, FieldValue } from 'firebase/firestore';

export type EventStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface EventLocation {
  address: string;
  coordinates: GeoPoint;
}

export interface EventDateRange {
  start: Timestamp;
  end: Timestamp;
}

export interface EventPricing {
  basePrice: number;
  volunteerTiers: Array<{
    count: number;
    price: number;
  }>;
}

export interface Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: EventLocation;
  dateRange: EventDateRange;
  shifts: string[]; // Shift IDs
  coordinators: string[]; // User UIDs
  collaborators: string[]; // User UIDs
  status: EventStatus;
  pricing: EventPricing;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface CreateEventData {
  title: string;
  description: string;
  location: EventLocation;
  dateRange: EventDateRange;
  coordinators?: string[];
  collaborators?: string[];
  pricing?: EventPricing;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: EventLocation;
  dateRange?: EventDateRange;
  coordinators?: string[];
  collaborators?: string[];
  status?: EventStatus;
  pricing?: EventPricing;
}