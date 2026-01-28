import { Timestamp } from 'firebase/firestore';

export type NotificationType = 
  | 'event_created'
  | 'event_updated'
  | 'shift_reminder'
  | 'incident_reported'
  | 'incident_updated'
  | 'attendance_alert'
  | 'payment_required'
  | 'general_announcement';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationData {
  eventId?: string;
  shiftId?: string;
  incidentId?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority: NotificationPriority;
  read: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority?: NotificationPriority;
}

export interface NotificationPreferences {
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  eventUpdates: boolean;
  shiftReminders: boolean;
  incidentAlerts: boolean;
  generalAnnouncements: boolean;
}