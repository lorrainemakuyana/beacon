/**
 * Client-side implementations of business logic
 * to replace Firebase Cloud Functions.
 */

import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  writeBatch,
  GeoPoint,
} from "firebase/firestore";
import {
  Event,
  User,
  AttendanceRecord,
  Incident,
  Notification,
  COLLECTIONS,
} from "../types";
import { getFirebaseServices } from "../config";


const { firestore, auth } = getFirebaseServices();

// User Management (replaces auth Cloud Functions)
export const createUserDocument = async (user: Partial<User>) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const userDoc = doc(firestore, COLLECTIONS.USERS, auth.currentUser.uid);
  await setDoc(userDoc, {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    displayName: auth.currentUser.displayName || "",
    role: "volunteer",
    profile: {
      skills: [],
      availability: [],
    },
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    ...user,
  });

  return auth.currentUser.uid;
};

// Event Management (replaces event Cloud Functions)
export const createEvent = async (eventData: Partial<Event>) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const eventRef = doc(collection(firestore, COLLECTIONS.EVENTS));
  const event: Partial<Event> = {
    ...eventData,
    coordinators: [auth.currentUser.uid],
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(eventRef, event);
  return eventRef.id;
};

export const updateEvent = async (eventId: string, updates: Partial<Event>) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
  await updateDoc(eventRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return eventId;
};

export const publishEvent = async (eventId: string) => {
  return updateEvent(eventId, { status: "published" });
};

// Attendance Management (replaces attendance Cloud Functions)
export const processCheckIn = async (
  eventId: string,
  shiftId: string,
  location?: { latitude: number; longitude: number },
) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const attendanceRef = doc(collection(firestore, COLLECTIONS.ATTENDANCE));
  const attendanceRecord: Partial<AttendanceRecord> = {
    eventId,
    shiftId,
    volunteerId: auth.currentUser.uid,
    checkIn: {
      timestamp: serverTimestamp(),
      method: "manual",
      location: location
        ? new GeoPoint(location.latitude, location.longitude)
        : undefined,
    },
    status: "checked-in",
  };

  await setDoc(attendanceRef, attendanceRecord);
  return attendanceRef.id;
};

export const processCheckOut = async (attendanceId: string) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const attendanceRef = doc(firestore, COLLECTIONS.ATTENDANCE, attendanceId);
  await updateDoc(attendanceRef, {
    checkOut: {
      timestamp: serverTimestamp(),
      method: "manual",
    },
    status: "checked-out",
  });

  return attendanceId;
};

// Incident Management (replaces incident Cloud Functions)
export const reportIncident = async (incidentData: Partial<Incident>) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const incidentRef = doc(collection(firestore, COLLECTIONS.INCIDENTS));
  const incident: Partial<Incident> = {
    ...incidentData,
    reporterId: auth.currentUser.uid,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(incidentRef, incident);

  // TODO: Add client-side notification to coordinators
  // This could be done via Firestore triggers or direct messaging

  return incidentRef.id;
};

export const updateIncidentStatus = async (
  incidentId: string,
  status: string,
  resolution?: string,
) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const incidentRef = doc(firestore, COLLECTIONS.INCIDENTS, incidentId);
  const updates: any = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (resolution) {
    updates.resolution = resolution;
  }

  await updateDoc(incidentRef, updates);
  return incidentId;
};

// Notification Management (replaces notification Cloud Functions)
export const createNotification = async (
  userId: string,
  notification: Partial<Notification>,
) => {
  const notificationRef = doc(collection(firestore, COLLECTIONS.NOTIFICATIONS));
  await setDoc(notificationRef, {
    ...notification,
    userId,
    read: false,
    createdAt: serverTimestamp(),
  });

  return notificationRef.id;
};

export const sendEventNotifications = async (
  eventId: string,
  message: string,
  title: string,
) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  // Get all volunteers for the event
  const eventDoc = doc(firestore, COLLECTIONS.EVENTS, eventId);
  // This would need to be implemented based on how volunteers are associated with events

  // For now, return success - full implementation would require
  // querying volunteer assignments and creating notifications
  return { success: true, notificationsSent: 0 };
};

// Shift Management
export const joinShift = async (eventId: string, shiftId: string) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const batch = writeBatch(firestore);

  // Update event to add volunteer to shift
  const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);

  // Note: In a real implementation, you'd need to:
  // 1. Get the current event document
  // 2. Find the specific shift in the shifts array
  // 3. Add the user to that shift's assignedVolunteers array
  // 4. Update the document with the modified shifts array

  // For now, this is a placeholder that would need proper array manipulation
  console.log(
    `User ${auth.currentUser.uid} joining shift ${shiftId} in event ${eventId}`,
  );

  await batch.commit();
  return shiftId;
};

export const leaveShift = async (eventId: string, shiftId: string) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const batch = writeBatch(firestore);

  // Update event to remove volunteer from shift
  const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);

  // Similar to joinShift, this would need proper array manipulation
  console.log(
    `User ${auth.currentUser.uid} leaving shift ${shiftId} in event ${eventId}`,
  );

  await batch.commit();
  return shiftId;
};

// Utility function to check if user has permission for an event
export const checkEventPermission = async (
  eventId: string,
): Promise<boolean> => {
  if (!auth.currentUser) return false;

  const eventDoc = doc(firestore, COLLECTIONS.EVENTS, eventId);
  const eventSnap = await getDocs(
    query(
      collection(firestore, COLLECTIONS.EVENTS),
      where("__name__", "==", eventId),
    ),
  );

  if (eventSnap.empty) return false;

  const eventData = eventSnap.docs[0].data() as Event;
  return (
    eventData.coordinators.includes(auth.currentUser.uid) ||
    eventData.collaborators.includes(auth.currentUser.uid)
  );
};

// Error handling utility
export const handleClientError = (error: any, operation: string) => {
  console.error(`Client operation ${operation} failed:`, error);

  // Map common Firestore errors to user-friendly messages
  if (error.code === "permission-denied") {
    throw new Error("You do not have permission to perform this action.");
  } else if (error.code === "not-found") {
    throw new Error("The requested resource was not found.");
  } else if (error.code === "unauthenticated") {
    throw new Error("You must be logged in to perform this action.");
  } else {
    throw new Error(`An error occurred: ${error.message}`);
  }
};
