import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Event, EventStatus, COLLECTIONS } from "@/interfaces";

export async function getAllEvents(): Promise<Event[]> {
  const q = query(
    collection(firestore, COLLECTIONS.EVENTS),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Event);
}

export async function getEventById(id: string): Promise<Event | null> {
  const snap = await getDoc(doc(firestore, COLLECTIONS.EVENTS, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Event) : null;
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  const q = query(
    collection(firestore, COLLECTIONS.EVENTS),
    where("date", ">=", today),
    orderBy("date", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Event);
}

export async function updateEventStatus(
  id: string,
  status: EventStatus
): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.EVENTS, id), {
    status,
    updatedAt: Date.now(),
  });
}

export async function createEvent(
  data: Omit<Event, "id" | "createdAt" | "updatedAt" | "shifts">,
  shiftDefs: Array<{ title: string; requiredVolunteers: number }>
): Promise<string> {
  const eventRef = await addDoc(collection(firestore, COLLECTIONS.EVENTS), {
    ...data,
    shifts: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const startDateTime = new Date(`${data.date}T${data.startTime}`);
  const endDateTime = new Date(`${data.date}T${data.endTime}`);

  const shiftIds: string[] = [];
  for (const shiftDef of shiftDefs) {
    const shiftRef = await addDoc(collection(firestore, COLLECTIONS.SHIFTS), {
      eventId: eventRef.id,
      title: shiftDef.title,
      description: "",
      role: { title: shiftDef.title },
      timeSlot: {
        start: Timestamp.fromDate(startDateTime),
        end: Timestamp.fromDate(endDateTime),
      },
      requiredVolunteers: shiftDef.requiredVolunteers,
      assignedVolunteers: [],
      status: "open",
    });
    shiftIds.push(shiftRef.id);
  }

  await updateDoc(eventRef, { shifts: shiftIds });
  return eventRef.id;
}

export async function deleteEvent(id: string): Promise<void> {
  const eventSnap = await getDoc(doc(firestore, COLLECTIONS.EVENTS, id));
  if (!eventSnap.exists()) return;
  const eventData = eventSnap.data() as Event;

  const [shiftsSnap, incidentsSnap] = await Promise.all([
    getDocs(query(collection(firestore, COLLECTIONS.SHIFTS), where("eventId", "==", id))),
    getDocs(query(collection(firestore, COLLECTIONS.INCIDENTS), where("eventId", "==", id))),
  ]);

  const batch = writeBatch(firestore);
  batch.delete(doc(firestore, COLLECTIONS.EVENTS, id));
  shiftsSnap.docs.forEach((d) => batch.delete(d.ref));
  incidentsSnap.docs.forEach((d) => batch.delete(d.ref));

  // Remove this event from each collaborator's user doc
  const collaborators: string[] = eventData.collaborators ?? [];
  collaborators.forEach((uid) => {
    batch.update(doc(firestore, COLLECTIONS.USERS, uid), {
      events: arrayRemove(id),
    });
  });

  await batch.commit();
}

export async function archiveEvent(id: string): Promise<void> {
  const [shiftsSnap, incidentsSnap] = await Promise.all([
    getDocs(query(collection(firestore, COLLECTIONS.SHIFTS), where("eventId", "==", id))),
    getDocs(query(collection(firestore, COLLECTIONS.INCIDENTS), where("eventId", "==", id))),
  ]);

  const batch = writeBatch(firestore);
  batch.update(doc(firestore, COLLECTIONS.EVENTS, id), { status: "archived", updatedAt: Date.now() });
  shiftsSnap.docs.forEach((d) => batch.update(d.ref, { status: "archived" }));
  incidentsSnap.docs.forEach((d) => batch.update(d.ref, { status: "archived", updatedAt: Date.now() }));
  await batch.commit();
}

export async function unarchiveEvent(id: string): Promise<void> {
  const [shiftsSnap, incidentsSnap] = await Promise.all([
    getDocs(query(collection(firestore, COLLECTIONS.SHIFTS), where("eventId", "==", id), where("status", "==", "archived"))),
    getDocs(query(collection(firestore, COLLECTIONS.INCIDENTS), where("eventId", "==", id), where("status", "==", "archived"))),
  ]);

  const batch = writeBatch(firestore);
  batch.update(doc(firestore, COLLECTIONS.EVENTS, id), { status: "published", updatedAt: Date.now() });
  shiftsSnap.docs.forEach((d) => batch.update(d.ref, { status: "open" }));
  incidentsSnap.docs.forEach((d) => batch.update(d.ref, { status: "open", updatedAt: Date.now() }));
  await batch.commit();
}

export async function getManagerEvents(userId: string): Promise<Event[]> {
  // Query events where user is coordinator OR collaborator
  // Firestore doesn't support OR across fields, so run two queries and merge
  const [coordSnap, collabSnap] = await Promise.all([
    getDocs(query(
      collection(firestore, COLLECTIONS.EVENTS),
      where("coordinators", "array-contains", userId),
      orderBy("date", "desc")
    )),
    getDocs(query(
      collection(firestore, COLLECTIONS.EVENTS),
      where("collaborators", "array-contains", userId),
      orderBy("date", "desc")
    )),
  ]);
  const seen = new Set<string>();
  const results: Event[] = [];
  for (const snap of [coordSnap, collabSnap]) {
    for (const d of snap.docs) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        results.push({ id: d.id, ...d.data() } as Event);
      }
    }
  }
  return results.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function addCollaboratorToEvent(
  eventId: string,
  email: string
): Promise<{ success: boolean; message: string }> {
  const q = query(
    collection(firestore, COLLECTIONS.USERS),
    where("email", "==", email),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return { success: false, message: "No user found with that email" };
  }
  const userDoc = snap.docs[0];
  await updateDoc(doc(firestore, COLLECTIONS.EVENTS, eventId), {
    collaborators: arrayUnion(userDoc.id),
  });
  await updateDoc(doc(firestore, COLLECTIONS.USERS, userDoc.id), {
    events: arrayUnion(eventId),
  });
  return { success: true, message: "Collaborator added" };
}
