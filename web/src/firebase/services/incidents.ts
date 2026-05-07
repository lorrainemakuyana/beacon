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
import { Incident, IncidentStatus, COLLECTIONS } from "@/interfaces";

export async function getAllIncidents(): Promise<Incident[]> {
  const q = query(
    collection(firestore, COLLECTIONS.INCIDENTS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Incident);
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const snap = await getDoc(doc(firestore, COLLECTIONS.INCIDENTS, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Incident) : null;
}

export async function getIncidentsByEventId(
  eventId: string
): Promise<Incident[]> {
  const q = query(
    collection(firestore, COLLECTIONS.INCIDENTS),
    where("eventId", "==", eventId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Incident);
}

export async function updateIncidentStatus(
  id: string,
  status: IncidentStatus
): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.INCIDENTS, id), {
    status,
    updatedAt: Date.now(),
  });
}
