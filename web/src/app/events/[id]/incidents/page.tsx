"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth";
import { getEventById } from "@/firebase/services/events";
import { getShiftsByEventId } from "@/firebase/services/shifts";
import { getIncidentsByEventId } from "@/firebase/services/incidents";
import { Event, Incident, Shift } from "@/interfaces";
import Breadcrumb from "@/components/breadcrumb";
import Badge from "@/components/badge";
import EmptyState from "@/components/empty-state";
import EventTabs from "@/components/event-tabs";
import { formatDate, getStatusVariant, getSeverityVariant } from "@/lib/utils";

export default function EventIncidentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([getEventById(id), getShiftsByEventId(id), getIncidentsByEventId(id)])
      .then(([evt, shfts, incs]) => {
        setEvent(evt);
        setShifts(shfts);
        setIncidents(incs);
      })
      .finally(() => setDataLoading(false));
  }, [user, id]);

  const volunteerIds = Array.from(new Set(shifts.flatMap((s) => s.assignedVolunteers ?? [])));

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <Breadcrumb
        items={[
          { label: "Events", href: "/events" },
          { label: dataLoading ? "..." : (event?.title ?? "Event"), href: `/events/${id}` },
          { label: "Incidents" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        {event && <p className="text-gray-500 text-sm mt-1">{event.title}</p>}
      </div>

      <EventTabs
        eventId={id}
        active="incidents"
        counts={{ shifts: shifts.length, volunteers: volunteerIds.length, incidents: incidents.length }}
      />

      {dataLoading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading incidents...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {incidents.length === 0 ? (
            <EmptyState
              message="No incidents reported"
              description="Incidents for this event will appear here."
            />
          ) : (
            incidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">{incident.title}</span>
                  <span className="text-xs text-gray-400">{formatDate(incident.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Badge label={incident.severity} variant={getSeverityVariant(incident.severity)} />
                  <Badge label={incident.status} variant={getStatusVariant(incident.status)} />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
