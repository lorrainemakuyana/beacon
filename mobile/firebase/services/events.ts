import { collection, doc, getDoc, getDocs, query, where, documentId } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Event, COLLECTIONS } from "@/interfaces";

export async function getEventById(eventId: string): Promise<Event | null> {
  const snap = await getDoc(doc(firestore, COLLECTIONS.EVENTS, eventId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Event) : null;
}

export async function getEventsByIds(ids: string[]): Promise<Event[]> {
  if (ids.length === 0) return [];
  const results: Event[] = [];
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    const q = query(
      collection(firestore, COLLECTIONS.EVENTS),
      where(documentId(), "in", chunk),
    );
    const snap = await getDocs(q);
    snap.docs.forEach((d) => results.push({ id: d.id, ...d.data() } as Event));
  }
  return results;
}
