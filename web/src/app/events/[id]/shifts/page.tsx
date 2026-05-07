"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth";
import { getEventById } from "@/firebase/services/events";
import { getShiftsByEventId } from "@/firebase/services/shifts";
import { getIncidentsByEventId } from "@/firebase/services/incidents";
import { Event, Shift } from "@/interfaces";
import Breadcrumb from "@/components/breadcrumb";
import Badge from "@/components/badge";
import EmptyState from "@/components/empty-state";
import EventTabs from "@/components/event-tabs";
import { getStatusVariant } from "@/lib/utils";

function formatTimestamp(ts: { toDate?: () => Date; seconds?: number } | undefined): string {
  if (!ts) return "—";
  try {
    const date = typeof ts.toDate === "function" ? ts.toDate() : new Date((ts.seconds ?? 0) * 1000);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function EventShiftsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [incidentCount, setIncidentCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([getEventById(id), getShiftsByEventId(id), getIncidentsByEventId(id)])
      .then(([evt, shfts, incidents]) => {
        setEvent(evt);
        setShifts(shfts);
        setIncidentCount(incidents.length);
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
          { label: "Shifts" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shifts</h1>
        {event && <p className="text-gray-500 text-sm mt-1">{event.title}</p>}
      </div>

      <EventTabs
        eventId={id}
        active="shifts"
        counts={{ shifts: shifts.length, volunteers: volunteerIds.length, incidents: incidentCount }}
      />

      {dataLoading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading shifts...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {shifts.length === 0 ? (
            <EmptyState message="No shifts found" description="Shifts will appear here once they are created." />
          ) : (
            <motion.div initial="hidden" animate="visible" variants={listVariants}>
              {shifts.map((shift) => (
                <motion.div key={shift.id} variants={itemVariants} transition={{ duration: 0.2 }}>
                  <Link
                    href={`/events/${id}/shifts/${shift.id}`}
                    className="block px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900">{shift.title}</span>
                        {shift.role?.title && (
                          <span className="text-xs text-gray-500">Role: {shift.role.title}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(shift.timeSlot?.start as Parameters<typeof formatTimestamp>[0])} –{" "}
                          {formatTimestamp(shift.timeSlot?.end as Parameters<typeof formatTimestamp>[0])}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          <span className="font-medium text-gray-700">{shift.assignedVolunteers?.length ?? 0}</span>{" "}
                          / {shift.requiredVolunteers} volunteers
                        </span>
                        {shift.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{shift.description}</p>
                        )}
                      </div>
                      <Badge label={shift.status} variant={getStatusVariant(shift.status)} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
