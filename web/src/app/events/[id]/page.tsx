"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { Archive } from "lucide-react";
import { useAuth } from "@/context/auth";
import { getEventById, archiveEvent, addCollaboratorToEvent } from "@/firebase/services/events";
import { getShiftsByEventId } from "@/firebase/services/shifts";
import { getIncidentsByEventId } from "@/firebase/services/incidents";
import { getUsersByIds } from "@/firebase/services/users";
import { Event, Shift, User } from "@/interfaces";
import Breadcrumb from "@/components/breadcrumb";
import Badge from "@/components/badge";
import EmptyState from "@/components/empty-state";
import EventTabs from "@/components/event-tabs";
import { formatDate, getStatusVariant } from "@/lib/utils";

export default function EventDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [incidentCount, setIncidentCount] = useState(0);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Archive state
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Collaborator add state
  const [collabEmail, setCollabEmail] = useState("");
  const [collabMsg, setCollabMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [addingCollab, setAddingCollab] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    async function load() {
      try {
        const [evt, shfts, incidents] = await Promise.all([
          getEventById(id),
          getShiftsByEventId(id),
          getIncidentsByEventId(id),
        ]);
        setEvent(evt);
        setShifts(shfts);
        setIncidentCount(incidents.length);

        if (evt && evt.collaborators?.length) {
          const collabs = await getUsersByIds(evt.collaborators);
          setCollaborators(collabs);
        }
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [user, id]);

  // volunteer count across shifts
  const volunteerIds = Array.from(new Set(shifts.flatMap((s) => s.assignedVolunteers ?? [])));

  async function handleArchive() {
    if (!archiveConfirm) {
      setArchiveConfirm(true);
      return;
    }
    setArchiving(true);
    try {
      await archiveEvent(id);
      router.push("/events");
    } catch {
      setArchiving(false);
      setArchiveConfirm(false);
    }
  }

  async function handleAddCollaborator() {
    if (!collabEmail.trim()) return;
    setAddingCollab(true);
    setCollabMsg(null);
    try {
      const result = await addCollaboratorToEvent(id, collabEmail.trim());
      setCollabMsg({ ok: result.success, text: result.message });
      if (result.success) {
        setCollabEmail("");
        // Refresh event to get updated collaborators
        const evt = await getEventById(id);
        if (evt?.collaborators?.length) {
          const collabs = await getUsersByIds(evt.collaborators);
          setCollaborators(collabs);
        }
      }
    } catch {
      setCollabMsg({ ok: false, text: "Something went wrong." });
    } finally {
      setAddingCollab(false);
    }
  }

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
    <div
      className="flex flex-col gap-6"
    >
      <Breadcrumb
        items={[
          { label: "Events", href: "/events" },
          { label: dataLoading ? "..." : (event?.title ?? "Event") },
        ]}
      />

      {dataLoading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading event...</div>
      ) : event ? (
        <>
          {/* Event header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <Badge label={event.status} variant={getStatusVariant(event.status)} />
                {event.status !== "archived" && (
                  <div className="flex items-center gap-2">
                    {archiveConfirm ? (
                      <>
                        <span className="text-sm text-gray-600">Confirm archive?</span>
                        <button
                          onClick={handleArchive}
                          disabled={archiving}
                          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setArchiveConfirm(false)}
                          className="text-sm font-medium text-gray-500 hover:underline"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleArchive}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archive
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <p className="text-sm text-gray-600">{event.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Date</span>
                <span className="text-gray-900">{formatDate(event.date)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Time</span>
                <span className="text-gray-900">{event.startTime} – {event.endTime}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Location</span>
                <span className="text-gray-900">{event.location}</span>
              </div>
              {event.address && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Address</span>
                  <span className="text-gray-900">{event.address}</span>
                </div>
              )}
              {event.eventCode && (
                <div>
                  <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Event Code</span>
                  <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{event.eventCode}</span>
                </div>
              )}
            </div>

            {event.organizer && (
              <div className="border-t border-gray-100 pt-4">
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-2">Organizer</span>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                  {event.organizer.title && <p className="text-gray-500">{event.organizer.title}</p>}
                  {event.organizer.email && <p className="text-gray-400 text-xs">{event.organizer.email}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <EventTabs
            eventId={id}
            active="shifts"
            counts={{ shifts: shifts.length, volunteers: volunteerIds.length, incidents: incidentCount }}
          />

          {/* Shifts list */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Shifts</h2>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {shifts.length === 0 ? (
                <EmptyState message="No shifts for this event" description="Shifts will appear here once they are added." />
              ) : (
                shifts.map((shift) => (
                  <Link
                    key={shift.id}
                    href={`/events/${id}/shifts/${shift.id}`}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">{shift.title}</span>
                      <span className="text-xs text-gray-400">
                        {shift.assignedVolunteers?.length ?? 0} / {shift.requiredVolunteers} volunteers
                      </span>
                    </div>
                    <Badge label={shift.status} variant={getStatusVariant(shift.status)} />
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Collaborators */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Collaborators</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
              {collaborators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {collaborators.map((c) => (
                    <span
                      key={c.uid}
                      className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-semibold">
                        {c.displayName?.[0]?.toUpperCase() ?? "?"}
                      </span>
                      {c.displayName ?? c.email}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No collaborators yet.</p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  placeholder="Add collaborator by email"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
                <button
                  onClick={handleAddCollaborator}
                  disabled={addingCollab || !collabEmail.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addingCollab ? "Adding..." : "Add"}
                </button>
              </div>

              {collabMsg && (
                <p className={`text-sm ${collabMsg.ok ? "text-green-600" : "text-danger"}`}>
                  {collabMsg.text}
                </p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
