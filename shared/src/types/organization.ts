import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  contactEmail: string;
  ownerId: string;
  members: string[]; // User UIDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  website?: string;
  contactEmail: string;
  ownerId: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  members?: string[];
}