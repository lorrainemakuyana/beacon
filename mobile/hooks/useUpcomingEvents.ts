import { useState, useEffect } from "react";
import { Event } from "@/interfaces";
import { getUpcomingEvents } from "@/firebase/services/events";
import { useLoading } from "@/context/LoadingContext";

interface UseUpcomingEventsResult {
  events: Event[];
  error: string | null;
}

export function useUpcomingEvents(): UseUpcomingEventsResult {
  const { setLoading } = useLoading();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUpcomingEvents()
      .then((data) => { if (!cancelled) setEvents(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? "Failed to load events"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { events, error };
}
