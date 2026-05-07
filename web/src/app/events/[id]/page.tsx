"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { getEventById } from "@/firebase/services/events";
import { getShiftsByEventId } from "@/firebase/services/shifts";
import { Event, Shift } from "@/interfaces";
import Breadcrumb from "@/components/breadcrumb";
import Badge from "@/components/badge";
import EmptyState from "@/components/empty-state";
import { formatDate, getStatusVariant } from "@/lib/utils";

export default function EventDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([getEventById(id), getShiftsByEventId(id)])
      .then(([evt, shfts]) => {
        setEvent(evt);
        setShifts(shfts);
      })
      .finally(() => setDataLoading(false));
  }, [user, id]);

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (!dataLoading && !event) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-gray-500 text-sm">Event not found.</p>
        <Link href="/events" className="text-primary text-sm hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Events", href: "/events" },
          { label: dataLoading ? "..." : (event?.title ?? "Event") },
        ]}
      />

      {dataLoading ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading event...
        </div>
      ) : event ? (
        <>
          {/* Event header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
              <Badge
                label={event.status}
                variant={getStatusVariant(event.status)}
              />
            </div>

            {event.description && (
              <p className="text-sm text-gray-600">{event.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">
                  Date
                </span>
                <span className="text-gray-900">{formatDate(event.date)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">
                  Time
                </span>
                <span className="text-gray-900">
                  {event.startTime} – {event.endTime}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">
                  Location
                </span>
                <span className="text-gray-900">{event.location}</span>
              </div>
              {event.address && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">
                    Address
                  </span>
                  <span className="text-gray-900">{event.address}</span>
                </div>
              )}
              {event.eventCode && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">
                    Event Code
                  </span>
                  <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {event.eventCode}
                  </span>
                </div>
              )}
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="border-t border-gray-100 pt-4">
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-2">
                  Organizer
                </span>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {event.organizer.name}
                  </p>
                  {event.organizer.title && (
                    <p className="text-gray-500">{event.organizer.title}</p>
                  )}
                  {event.organizer.email && (
                    <p className="text-gray-400 text-xs">
                      {event.organizer.email}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${id}/shifts`}
              className="px-4 py-2 text-sm font-medium border border-gray-200 bg-white rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Shifts ({shifts.length})
            </Link>
            <Link
              href={`/events/${id}/volunteers`}
              className="px-4 py-2 text-sm font-medium border border-gray-200 bg-white rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Volunteers
            </Link>
          </div>

          {/* Shifts preview */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Shifts
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {shifts.length === 0 ? (
                <EmptyState
                  message="No shifts for this event"
                  description="Shifts will appear here once they are added."
                />
              ) : (
                shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        {shift.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {shift.assignedVolunteers?.length ?? 0} /{" "}
                        {shift.requiredVolunteers} volunteers
                      </span>
                    </div>
                    <Badge
                      label={shift.status}
                      variant={getStatusVariant(shift.status)}
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
