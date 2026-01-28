/**
 * Format a number as currency
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * Format a number with thousand separators
 */
export declare function formatNumber(num: number): string;
/**
 * Capitalize the first letter of a string
 */
export declare function capitalize(str: string): string;
/**
 * Convert string to title case
 */
export declare function toTitleCase(str: string): string;
/**
 * Truncate text to specified length with ellipsis
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Format phone number for display
 */
export declare function formatPhoneNumber(phone: string): string;
/**
 * Generate initials from a name
 */
export declare function getInitials(name: string): string;
/**
 * Format file size in human-readable format
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Create a slug from a string (URL-friendly)
 */
export declare function createSlug(text: string): string;
/**
 * Format percentage with specified decimal places
 */
export declare function formatPercentage(value: number, decimals?: number): string;
/**
 * Generate a random ID string
 */
export declare function generateId(length?: number): string;
