import { useEffect, useState } from "react";
import { Incident } from "@/interfaces";
import { getUserIncidents } from "@/firebase/services/incidents";

export function useUserIncidents(userId?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    getUserIncidents(userId)
      .then(setIncidents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return { incidents, loading };
}
