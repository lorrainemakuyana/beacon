import { Timestamp } from 'firebase/firestore';
export type UserRole = 'volunteer' | 'coordinator' | 'collaborator' | 'owner';
export interface UserProfile {
    phone?: string;
    emergencyContact?: string;
    skills: string[];
    availability: string[];
}
export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    organizationId?: string;
    profile: UserProfile;
    createdAt: Timestamp;
    lastActive: Timestamp;
}
export interface CreateUserData {
    email: string;
    displayName: string;
    role?: UserRole;
    organizationId?: string;
    profile?: Partial<UserProfile>;
}
export interface UpdateUserData {
    displayName?: string;
    role?: UserRole;
    organizationId?: string;
    profile?: Partial<UserProfile>;
}
