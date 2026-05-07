"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { getAllEvents } from "@/firebase/services/events";
import { getAllIncidents } from "@/firebase/services/incidents";
import { getAllShifts } from "@/firebase/services/shifts";
import { getAllUsers } from "@/firebase/services/users";
import { Event, Incident } from "@/interfaces";
import StatCard from "@/components/stat-card";
import Badge from "@/components/badge";
import EmptyState from "@/components/empty-state";
import { formatDate, getStatusVariant, getSeverityVariant } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [shiftCount, setShiftCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [evts, incs, shifts, users] = await Promise.all([
          getAllEvents(),
          getAllIncidents(),
          getAllShifts(),
          getAllUsers(),
        ]);
        setEvents(evts);
        setIncidents(incs);
        setShiftCount(shifts.length);
        setVolunteerCount(users.filter((u) => u.role === "volunteer").length);
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  const activeIncidents = incidents.filter(
    (i) => i.status === "open" || i.status === "investigating"
  );

  const recentEvents = events.slice(0, 5);
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of events, volunteers, and incidents.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Events"
          value={dataLoading ? "—" : events.length}
          icon="📅"
        />
        <StatCard
          label="Active Incidents"
          value={dataLoading ? "—" : activeIncidents.length}
          icon="⚠️"
        />
        <StatCard
          label="Total Volunteers"
          value={dataLoading ? "—" : volunteerCount}
          icon="👥"
        />
        <StatCard
          label="Total Shifts"
          value={dataLoading ? "—" : shiftCount}
          icon="🗓️"
        />
      </div>

      {/* Recent Events */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Events
          </h2>
          <Link
            href="/events"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {dataLoading ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : recentEvents.length === 0 ? (
            <EmptyState message="No events yet" />
          ) : (
            recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(event.date)} · {event.location}
                  </span>
                </div>
                <Badge
                  label={event.status}
                  variant={getStatusVariant(event.status)}
                />
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Recent Incidents */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Incidents
          </h2>
          <Link
            href="/incidents"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {dataLoading ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : recentIncidents.length === 0 ? (
            <EmptyState message="No incidents reported" />
          ) : (
            recentIncidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {incident.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(incident.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    label={incident.severity}
                    variant={getSeverityVariant(incident.severity)}
                  />
                  <Badge
                    label={incident.status}
                    variant={getStatusVariant(incident.status)}
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
