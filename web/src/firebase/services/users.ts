import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { User, COLLECTIONS } from "@/interfaces";

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(firestore, COLLECTIONS.USERS));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as User);
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(firestore, COLLECTIONS.USERS, uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as User) : null;
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  const results: User[] = [];
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    const q = query(
      collection(firestore, COLLECTIONS.USERS),
      where(documentId(), "in", chunk)
    );
    const snap = await getDocs(q);
    snap.docs.forEach((d) => results.push({ uid: d.id, ...d.data() } as User));
  }
  return results;
}
