import { Timestamp } from 'firebase/firestore';

export type ShiftStatus = 'open' | 'full' | 'active' | 'completed';

export interface ShiftTimeSlot {
  start: Timestamp;
  end: Timestamp;
}

export interface ShiftRole {
  title: string;
  description: string;
  count: number;
  assignedTo?: string[]; // User UIDs
}

export interface Shift {
  id: string;
  eventId: string;
  title: string;
  description: string;
  timeSlot: ShiftTimeSlot;
  requiredVolunteers: number;
  assignedVolunteers: string[]; // User UIDs
  role: ShiftRole;
  status: ShiftStatus;
}

export interface CreateShiftData {
  eventId: string;
  title: string;
  description: string;
  timeSlot: ShiftTimeSlot;
  requiredVolunteers: number;
  role?: ShiftRole;
}

export interface UpdateShiftData {
  title?: string;
  description?: string;
  timeSlot?: ShiftTimeSlot;
  requiredVolunteers?: number;
  assignedVolunteers?: string[];
  role?: ShiftRole;
  status?: ShiftStatus;
}