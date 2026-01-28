import { Timestamp, GeoPoint } from 'firebase/firestore';

export type AttendanceStatus = 'checked-in' | 'checked-out' | 'no-show';
export type CheckInMethod = 'manual' | 'qr' | 'geofence';

export interface CheckInData {
  timestamp: Timestamp;
  location?: GeoPoint;
  method: CheckInMethod;
}

export interface CheckOutData {
  timestamp: Timestamp;
  location?: GeoPoint;
  method: CheckInMethod;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  shiftId: string;
  volunteerId: string;
  checkIn: CheckInData;
  checkOut?: CheckOutData;
  status: AttendanceStatus;
}

export interface CreateAttendanceData {
  eventId: string;
  shiftId: string;
  volunteerId: string;
  checkIn: CheckInData;
}

export interface UpdateAttendanceData {
  checkOut?: CheckOutData;
  status?: AttendanceStatus;
}