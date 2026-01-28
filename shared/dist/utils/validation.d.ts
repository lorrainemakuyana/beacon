/**
 * Validate email address format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate phone number format
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Validate password strength
 */
export declare function isValidPassword(password: string): boolean;
/**
 * Validate event title length
 */
export declare function isValidEventTitle(title: string): boolean;
/**
 * Validate event description length
 */
export declare function isValidEventDescription(description: string): boolean;
/**
 * Validate incident title length
 */
export declare function isValidIncidentTitle(title: string): boolean;
/**
 * Validate incident description length
 */
export declare function isValidIncidentDescription(description: string): boolean;
/**
 * Validate required string field
 */
export declare function isRequiredString(value: string): boolean;
/**
 * Validate array has minimum length
 */
export declare function hasMinLength<T>(array: T[], minLength: number): boolean;
/**
 * Validate number is within range
 */
export declare function isInRange(value: number, min: number, max: number): boolean;
/**
 * Validate URL format
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Sanitize string input by trimming whitespace
 */
export declare function sanitizeString(input: string): string;
/**
 * Validate file size in bytes
 */
export declare function isValidFileSize(sizeBytes: number): boolean;
/**
 * Get validation error message for password
 */
export declare function getPasswordValidationError(password: string): string | null;
/**
 * Get validation error message for email
 */
export declare function getEmailValidationError(email: string): string | null;
