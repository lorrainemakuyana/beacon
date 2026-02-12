import { Timestamp } from 'firebase/firestore';

export type NotificationType = 
  | 'shift_reminder' 
  | 'shift_change' 
  | 'event_update' 
  | 'incident_alert' 
  | 'announcement'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>; // Additional data for navigation
  createdAt: Timestamp;
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}