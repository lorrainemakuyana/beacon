import { VALIDATION } from '../constants';

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone.trim());
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
}

/**
 * Validate event title length
 */
export function isValidEventTitle(title: string): boolean {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= VALIDATION.MAX_EVENT_TITLE_LENGTH;
}

/**
 * Validate event description length
 */
export function isValidEventDescription(description: string): boolean {
  return description.trim().length <= VALIDATION.MAX_EVENT_DESCRIPTION_LENGTH;
}

/**
 * Validate incident title length
 */
export function isValidIncidentTitle(title: string): boolean {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= VALIDATION.MAX_INCIDENT_TITLE_LENGTH;
}

/**
 * Validate incident description length
 */
export function isValidIncidentDescription(description: string): boolean {
  return description.trim().length <= VALIDATION.MAX_INCIDENT_DESCRIPTION_LENGTH;
}

/**
 * Validate required string field
 */
export function isRequiredString(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate array has minimum length
 */
export function hasMinLength<T>(array: T[], minLength: number): boolean {
  return array.length >= minLength;
}

/**
 * Validate number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input by trimming whitespace
 */
export function sanitizeString(input: string): string {
  return input.trim();
}

/**
 * Validate file size in bytes
 */
export function isValidFileSize(sizeBytes: number): boolean {
  const maxSizeBytes = VALIDATION.MAX_FILE_SIZE_MB * 1024 * 1024;
  return sizeBytes <= maxSizeBytes;
}

/**
 * Get validation error message for password
 */
export function getPasswordValidationError(password: string): string | null {
  if (!isValidPassword(password)) {
    return `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`;
  }
  return null;
}

/**
 * Get validation error message for email
 */
export function getEmailValidationError(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}