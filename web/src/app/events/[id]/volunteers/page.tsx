"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { getEventById } from "@/firebase/services/events";
import { getShiftsByEventId } from "@/firebase/services/shifts";
import { getUsersByIds } from "@/firebase/services/users";
import { Event, User } from "@/interfaces";
import Breadcrumb from "@/components/breadcrumb";
import EmptyState from "@/components/empty-state";

export default function EventVolunteersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    async function load() {
      try {
        const [evt, shifts] = await Promise.all([
          getEventById(id),
          getShiftsByEventId(id),
        ]);
        setEvent(evt);

        // Collect all unique volunteer IDs across all shifts
        const volunteerIds = Array.from(
          new Set(shifts.flatMap((s) => s.assignedVolunteers ?? []))
        );
        const vols = await getUsersByIds(volunteerIds);
        setVolunteers(vols);
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [user, id]);

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Events", href: "/events" },
          {
            label: dataLoading ? "..." : (event?.title ?? "Event"),
            href: `/events/${id}`,
          },
          { label: "Volunteers" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
        {event && (
          <p className="text-gray-500 text-sm mt-1">{event.title}</p>
        )}
      </div>

      {dataLoading ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading volunteers...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {volunteers.length === 0 ? (
            <EmptyState
              message="No volunteers assigned"
              description="Volunteers will appear here once they sign up for shifts."
            />
          ) : (
            volunteers.map((vol) => (
              <div
                key={vol.uid}
                className="px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-primary-subtle border border-primary-subtle-border flex items-center justify-center shrink-0">
                    <span className="text-primary text-sm font-semibold">
                      {vol.displayName?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {vol.displayName}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {vol.email}
                    </span>
                  </div>
                </div>
                {vol.skills && vol.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-end ml-4 max-w-xs">
                    {vol.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {vol.skills.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{vol.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
