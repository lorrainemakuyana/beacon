import { Timestamp } from 'firebase/firestore';

/**
 * Format a timestamp to a human-readable date string
 */
export function formatDate(timestamp: Timestamp, options?: Intl.DateTimeFormatOptions): string {
  const date = timestamp.toDate();
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format a timestamp to a human-readable time string
 */
export function formatTime(timestamp: Timestamp, options?: Intl.DateTimeFormatOptions): string {
  const date = timestamp.toDate();
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  return date.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format a timestamp to a human-readable date and time string
 */
export function formatDateTime(timestamp: Timestamp): string {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(timestamp: Timestamp): string {
  const now = new Date();
  const date = timestamp.toDate();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffMinutes) < 1) {
    return 'just now';
  } else if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 ? `in ${diffMinutes} minutes` : `${Math.abs(diffMinutes)} minutes ago`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
  } else if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  } else {
    return formatDate(timestamp);
  }
}

/**
 * Calculate duration between two timestamps in minutes
 */
export function calculateDurationMinutes(start: Timestamp, end: Timestamp): number {
  const startMs = start.toMillis();
  const endMs = end.toMillis();
  return Math.floor((endMs - startMs) / (1000 * 60));
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Check if a timestamp is in the past
 */
export function isPast(timestamp: Timestamp): boolean {
  return timestamp.toMillis() < Date.now();
}

/**
 * Check if a timestamp is in the future
 */
export function isFuture(timestamp: Timestamp): boolean {
  return timestamp.toMillis() > Date.now();
}

/**
 * Check if two timestamps are on the same day
 */
export function isSameDay(timestamp1: Timestamp, timestamp2: Timestamp): boolean {
  const date1 = timestamp1.toDate();
  const date2 = timestamp2.toDate();
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Create a Timestamp from a Date object
 */
export function createTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Create a Timestamp for the current moment
 */
export function now(): Timestamp {
  return Timestamp.now();
}