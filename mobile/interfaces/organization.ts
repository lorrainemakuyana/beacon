import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id: string;
  name: string;
  description: string;
  ownerId: string; // User UID
  coordinators: string[]; // User UIDs
  settings: {
    allowPublicEvents: boolean;
    requireApproval: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateOrganizationData {
  name: string;
  description: string;
  ownerId: string;
  settings?: {
    allowPublicEvents?: boolean;
    requireApproval?: boolean;
  };
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  coordinators?: string[];
  settings?: {
    allowPublicEvents?: boolean;
    requireApproval?: boolean;
  };
}