import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Shift, COLLECTIONS } from "@/interfaces";

export async function getShiftById(shiftId: string): Promise<Shift | null> {
  const snap = await getDoc(doc(firestore, COLLECTIONS.SHIFTS, shiftId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Shift) : null;
}

export async function getShiftsForUser(userId: string): Promise<Shift[]> {
  const q = query(
    collection(firestore, COLLECTIONS.SHIFTS),
    where("assignedVolunteers", "array-contains", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Shift);
}
