import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
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
