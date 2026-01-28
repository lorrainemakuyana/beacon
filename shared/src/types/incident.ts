import { Timestamp, GeoPoint } from 'firebase/firestore';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentCategory = 'safety' | 'equipment' | 'volunteer' | 'other';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';

export interface Incident {
  id: string;
  eventId: string;
  shiftId?: string;
  reporterId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  location?: GeoPoint;
  photos?: string[]; // Storage URLs
  status: IncidentStatus;
  assignedTo?: string; // Coordinator UID
  resolution?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateIncidentData {
  eventId: string;
  shiftId?: string;
  reporterId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  category: IncidentCategory;
  location?: GeoPoint;
  photos?: string[];
}

export interface UpdateIncidentData {
  title?: string;
  description?: string;
  severity?: IncidentSeverity;
  category?: IncidentCategory;
  status?: IncidentStatus;
  assignedTo?: string;
  resolution?: string;
}