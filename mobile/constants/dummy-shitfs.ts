import { Shift } from "@/interfaces";
import { Timestamp } from 'firebase/firestore';

function toTimestamp(
  value: { seconds: number; nanoseconds: number }
): Timestamp {
  return new Timestamp(value.seconds, value.nanoseconds);
}

function hydrateShift(raw: any): Shift {
  return {
    ...raw,
    timeSlot: {
      start: toTimestamp(raw.timeSlot.start),
      end: toTimestamp(raw.timeSlot.end),
    },
  };
}

const shifts: any[] = [
  {
    id: "shf_001",
    eventId: "evt_001",
    title: "Morning Cleanup Crew",
    description: "Lead litter pickup teams.",
    timeSlot: {
      start: { seconds: 1760516400, nanoseconds: 0 },
      end: { seconds: 1760530800, nanoseconds: 0 },
    },
    requiredVolunteers: 10,
    assignedVolunteers: ["user_020", "user_021"],
    role: {
      title: "Team Lead",
      description: "Coordinate volunteers in the field.",
      count: 2,
      assignedTo: ["user_020"],
    },
    status: "open",
  },
  {
    id: "shf_002",
    eventId: "evt_002",
    title: "Beach Sweep Team",
    description: "Collect shoreline plastic.",
    timeSlot: {
      start: { seconds: 1761210000, nanoseconds: 0 },
      end: { seconds: 1761224400, nanoseconds: 0 },
    },
    requiredVolunteers: 20,
    assignedVolunteers: [],
    role: {
      title: "Volunteer",
      description: "General cleanup support.",
      count: 20,
    },
    status: "open",
  },
  {
    id: "shf_003",
    eventId: "evt_003",
    title: "Food Sorting Line",
    description: "Sort donated food.",
    timeSlot: {
      start: { seconds: 1759010000, nanoseconds: 0 },
      end: { seconds: 1759024400, nanoseconds: 0 },
    },
    requiredVolunteers: 15,
    assignedVolunteers: ["user_022", "user_023", "user_024"],
    role: {
      title: "Sorter",
      description: "Sort and package food.",
      count: 15,
      assignedTo: ["user_022"],
    },
    status: "active",
  },
  {
    id: "shf_004",
    eventId: "evt_004",
    title: "Animal Care Shift",
    description: "Feed and clean animal areas.",
    timeSlot: {
      start: { seconds: 1756010000, nanoseconds: 0 },
      end: { seconds: 1756024400, nanoseconds: 0 },
    },
    requiredVolunteers: 8,
    assignedVolunteers: ["user_025"],
    role: {
      title: "Animal Helper",
      description: "Assist shelter staff.",
      count: 8,
      assignedTo: ["user_025"],
    },
    status: "completed",
  },
  {
    id: "shf_005",
    eventId: "evt_005",
    title: "Tree Planting Crew",
    description: "Plant and stake trees.",
    timeSlot: {
      start: { seconds: 1762010000, nanoseconds: 0 },
      end: { seconds: 1762024400, nanoseconds: 0 },
    },
    requiredVolunteers: 25,
    assignedVolunteers: [],
    role: {
      title: "Planter",
      description: "Plant young trees.",
      count: 25,
    },
    status: "full",
  },
  {
    id: "shf_006",
    eventId: "evt_006",
    title: "River Debris Team",
    description: "Remove debris from riverbank.",
    timeSlot: {
      start: { seconds: 1762610000, nanoseconds: 0 },
      end: { seconds: 1762624400, nanoseconds: 0 },
    },
    requiredVolunteers: 12,
    assignedVolunteers: ["user_026"],
    role: {
      title: "Cleanup Volunteer",
      description: "General river cleanup.",
      count: 12,
      assignedTo: ["user_026"],
    },
    status: "open",
  },
  {
    id: "shf_007",
    eventId: "evt_007",
    title: "Math Tutors",
    description: "Help students with math.",
    timeSlot: {
      start: { seconds: 1763010000, nanoseconds: 0 },
      end: { seconds: 1763024400, nanoseconds: 0 },
    },
    requiredVolunteers: 6,
    assignedVolunteers: ["user_027", "user_028"],
    role: {
      title: "Tutor",
      description: "Provide tutoring.",
      count: 6,
      assignedTo: ["user_027"],
    },
    status: "active",
  },
  {
    id: "shf_008",
    eventId: "evt_008",
    title: "Registration Desk",
    description: "Check in attendees.",
    timeSlot: {
      start: { seconds: 1763410000, nanoseconds: 0 },
      end: { seconds: 1763424400, nanoseconds: 0 },
    },
    requiredVolunteers: 5,
    assignedVolunteers: ["user_029"],
    role: {
      title: "Registrar",
      description: "Manage check-ins.",
      count: 5,
      assignedTo: ["user_029"],
    },
    status: "open",
  },
  {
    id: "shf_009",
    eventId: "evt_009",
    title: "Coat Sorting Team",
    description: "Sort donated coats.",
    timeSlot: {
      start: { seconds: 1763810000, nanoseconds: 0 },
      end: { seconds: 1763824400, nanoseconds: 0 },
    },
    requiredVolunteers: 10,
    assignedVolunteers: [],
    role: {
      title: "Sorter",
      description: "Organize coats.",
      count: 10,
    },
    status: "open",
  },
  {
    id: "shf_010",
    eventId: "evt_010",
    title: "Garden Build Crew",
    description: "Construct garden beds.",
    timeSlot: {
      start: { seconds: 1754010000, nanoseconds: 0 },
      end: { seconds: 1754024400, nanoseconds: 0 },
    },
    requiredVolunteers: 18,
    assignedVolunteers: ["user_030"],
    role: {
      title: "Builder",
      description: "Build raised beds.",
      count: 18,
      assignedTo: ["user_030"],
    },
    status: "completed",
  },
];

export const dummyShifts: Shift[] = shifts.map(hydrateShift);