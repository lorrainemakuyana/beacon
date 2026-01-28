import { Timestamp } from 'firebase/firestore';
/**
 * Format a timestamp to a human-readable date string
 */
export declare function formatDate(timestamp: Timestamp, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format a timestamp to a human-readable time string
 */
export declare function formatTime(timestamp: Timestamp, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format a timestamp to a human-readable date and time string
 */
export declare function formatDateTime(timestamp: Timestamp): string;
/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export declare function getRelativeTime(timestamp: Timestamp): string;
/**
 * Calculate duration between two timestamps in minutes
 */
export declare function calculateDurationMinutes(start: Timestamp, end: Timestamp): number;
/**
 * Format duration in minutes to human-readable string
 */
export declare function formatDuration(minutes: number): string;
/**
 * Check if a timestamp is in the past
 */
export declare function isPast(timestamp: Timestamp): boolean;
/**
 * Check if a timestamp is in the future
 */
export declare function isFuture(timestamp: Timestamp): boolean;
/**
 * Check if two timestamps are on the same day
 */
export declare function isSameDay(timestamp1: Timestamp, timestamp2: Timestamp): boolean;
/**
 * Create a Timestamp from a Date object
 */
export declare function createTimestamp(date: Date): Timestamp;
/**
 * Create a Timestamp for the current moment
 */
export declare function now(): Timestamp;
