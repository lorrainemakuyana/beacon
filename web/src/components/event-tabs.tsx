"use client";

import Link from "next/link";

interface Props {
  eventId: string;
  active: "shifts" | "volunteers" | "incidents";
  counts: { shifts: number; volunteers: number; incidents: number };
}

const tabs = [
  { key: "shifts", label: "Shifts", path: "shifts" },
  { key: "volunteers", label: "Volunteers", path: "volunteers" },
  { key: "incidents", label: "Incidents", path: "incidents" },
] as const;

export default function EventTabs({ eventId, active, counts }: Props) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Link
            key={tab.key}
            href={`/events/${eventId}/${tab.path}`}
            className={[
              "pb-2 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}{" "}
            <span className="text-xs ml-1 bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
              {counts[tab.key]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
