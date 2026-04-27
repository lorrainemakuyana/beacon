import { Event } from "@/interfaces";

// Helpers to build dates relative to today
function daysFromNow(days: number, hour = 9): Date {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function dateStr(days: number): string {
  return daysFromNow(days).toISOString().split("T")[0];
}

function ms(days: number, hour = 0): number {
  return daysFromNow(days, hour).getTime();
}

const now = Date.now();

export const dummyEvents: Event[] = [
  // ── Today ────────────────────────────────────────────────────────────────
  {
    id: "evt_001",
    organizationId: "org_greenearth",
    title: "City Park Cleanup",
    description: "Community effort to clean litter and restore the park.",
    location: "Central City Park, North Gate",
    date: dateStr(0),
    startTime: "09:00",
    endTime: "13:00",
    shifts: ["shf_001"],
    coordinators: ["user_001"],
    collaborators: ["user_002", "user_003"],
    status: "active",
    createdAt: ms(-10),
    updatedAt: ms(-1),
  },

  // ── Future ───────────────────────────────────────────────────────────────
  {
    id: "evt_002",
    organizationId: "org_greenearth",
    title: "Beach Plastic Sweep",
    description: "Remove plastic waste from the shoreline.",
    location: "Sunset Beach",
    date: dateStr(5),
    startTime: "08:00",
    endTime: "12:00",
    shifts: ["shf_002"],
    coordinators: ["user_004"],
    collaborators: [],
    status: "published",
    createdAt: ms(-8),
    updatedAt: ms(-2),
  },
  {
    id: "evt_006",
    organizationId: "org_greenearth",
    title: "River Restoration Day",
    description: "Remove debris and restore riverbanks.",
    location: "Bluewater River",
    date: dateStr(10),
    startTime: "07:00",
    endTime: "11:00",
    shifts: ["shf_006"],
    coordinators: ["user_010"],
    collaborators: [],
    status: "published",
    createdAt: ms(-5),
    updatedAt: ms(-1),
  },
  {
    id: "evt_007",
    organizationId: "org_eduhelp",
    title: "After School Tutoring",
    description: "Provide tutoring support for students.",
    location: "Lincoln Community Center",
    date: dateStr(14),
    startTime: "15:00",
    endTime: "18:00",
    shifts: ["shf_007"],
    coordinators: ["user_011"],
    collaborators: ["user_012"],
    status: "published",
    createdAt: ms(-6),
    updatedAt: ms(-1),
  },
  {
    id: "evt_008",
    organizationId: "org_healthfirst",
    title: "Community Health Fair",
    description: "Assist with booths and registration.",
    location: "Downtown Civic Plaza",
    date: dateStr(21),
    startTime: "09:00",
    endTime: "17:00",
    shifts: ["shf_008"],
    coordinators: ["user_013"],
    collaborators: [],
    status: "published",
    createdAt: ms(-4),
    updatedAt: ms(-1),
  },
  {
    id: "evt_009",
    organizationId: "org_citycare",
    title: "Winter Coat Drive",
    description: "Collect and sort donated winter coats.",
    location: "City Hall Lobby",
    date: dateStr(30),
    startTime: "10:00",
    endTime: "14:00",
    shifts: ["shf_009"],
    coordinators: ["user_014"],
    collaborators: [],
    status: "draft",
    createdAt: ms(-3),
    updatedAt: ms(-1),
  },

  // ── Past ─────────────────────────────────────────────────────────────────
  {
    id: "evt_003",
    organizationId: "org_foodbank",
    title: "Food Bank Sorting Day",
    description: "Sort and package donated food items.",
    location: "Metro Food Bank Warehouse",
    date: dateStr(-7),
    startTime: "10:00",
    endTime: "14:00",
    shifts: ["shf_003"],
    coordinators: ["user_005"],
    collaborators: ["user_006"],
    status: "completed",
    createdAt: ms(-20),
    updatedAt: ms(-7),
  },
  {
    id: "evt_004",
    organizationId: "org_animalaid",
    title: "Animal Shelter Support",
    description: "Help feed and care for shelter animals.",
    location: "Happy Paws Shelter",
    date: dateStr(-14),
    startTime: "09:00",
    endTime: "13:00",
    shifts: ["shf_004"],
    coordinators: ["user_007"],
    collaborators: [],
    status: "completed",
    createdAt: ms(-30),
    updatedAt: ms(-14),
  },
  {
    id: "evt_005",
    organizationId: "org_citycare",
    title: "Neighborhood Tree Planting",
    description: "Plant new trees across the neighborhood.",
    location: "Maple Street District",
    date: dateStr(-21),
    startTime: "08:00",
    endTime: "12:00",
    shifts: ["shf_005"],
    coordinators: ["user_008"],
    collaborators: ["user_009"],
    status: "cancelled",
    createdAt: ms(-40),
    updatedAt: ms(-21),
  },
  {
    id: "evt_010",
    organizationId: "org_greenearth",
    title: "Urban Garden Build",
    description: "Build raised beds for community garden.",
    location: "Eastside Community Garden",
    date: dateStr(-60),
    startTime: "08:00",
    endTime: "12:00",
    shifts: ["shf_010"],
    coordinators: ["user_015"],
    collaborators: [],
    status: "completed",
    createdAt: ms(-75),
    updatedAt: ms(-60),
  },
];
