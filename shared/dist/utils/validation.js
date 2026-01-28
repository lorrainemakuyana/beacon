"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidPhone = isValidPhone;
exports.isValidPassword = isValidPassword;
exports.isValidEventTitle = isValidEventTitle;
exports.isValidEventDescription = isValidEventDescription;
exports.isValidIncidentTitle = isValidIncidentTitle;
exports.isValidIncidentDescription = isValidIncidentDescription;
exports.isRequiredString = isRequiredString;
exports.hasMinLength = hasMinLength;
exports.isInRange = isInRange;
exports.isValidUrl = isValidUrl;
exports.sanitizeString = sanitizeString;
exports.isValidFileSize = isValidFileSize;
exports.getPasswordValidationError = getPasswordValidationError;
exports.getEmailValidationError = getEmailValidationError;
const constants_1 = require("../constants");
/**
 * Validate email address format
 */
function isValidEmail(email) {
    return constants_1.VALIDATION.EMAIL_REGEX.test(email.trim());
}
/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    return constants_1.VALIDATION.PHONE_REGEX.test(phone.trim());
}
/**
 * Validate password strength
 */
function isValidPassword(password) {
    return password.length >= constants_1.VALIDATION.MIN_PASSWORD_LENGTH;
}
/**
 * Validate event title length
 */
function isValidEventTitle(title) {
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= constants_1.VALIDATION.MAX_EVENT_TITLE_LENGTH;
}
/**
 * Validate event description length
 */
function isValidEventDescription(description) {
    return description.trim().length <= constants_1.VALIDATION.MAX_EVENT_DESCRIPTION_LENGTH;
}
/**
 * Validate incident title length
 */
function isValidIncidentTitle(title) {
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= constants_1.VALIDATION.MAX_INCIDENT_TITLE_LENGTH;
}
/**
 * Validate incident description length
 */
function isValidIncidentDescription(description) {
    return description.trim().length <= constants_1.VALIDATION.MAX_INCIDENT_DESCRIPTION_LENGTH;
}
/**
 * Validate required string field
 */
function isRequiredString(value) {
    return value.trim().length > 0;
}
/**
 * Validate array has minimum length
 */
function hasMinLength(array, minLength) {
    return array.length >= minLength;
}
/**
 * Validate number is within range
 */
function isInRange(value, min, max) {
    return value >= min && value <= max;
}
/**
 * Validate URL format
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Sanitize string input by trimming whitespace
 */
function sanitizeString(input) {
    return input.trim();
}
/**
 * Validate file size in bytes
 */
function isValidFileSize(sizeBytes) {
    const maxSizeBytes = constants_1.VALIDATION.MAX_FILE_SIZE_MB * 1024 * 1024;
    return sizeBytes <= maxSizeBytes;
}
/**
 * Get validation error message for password
 */
function getPasswordValidationError(password) {
    if (!isValidPassword(password)) {
        return `Password must be at least ${constants_1.VALIDATION.MIN_PASSWORD_LENGTH} characters long`;
    }
    return null;
}
/**
 * Get validation error message for email
 */
function getEmailValidationError(email) {
    if (!email.trim()) {
        return 'Email is required';
    }
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}
