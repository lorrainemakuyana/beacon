import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Incident, COLLECTIONS } from "@/interfaces";

export async function reportIncident(
  data: Omit<Incident, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(firestore, COLLECTIONS.INCIDENTS), {
    ...data,
    status: "open",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}
