"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusColors = exports.colors = void 0;
exports.colors = {
    // Primary brand colors
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    // Secondary colors
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b', // Main secondary
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },
    // Status colors
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // Main success
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b', // Main warning
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Main error
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    // Neutral grays
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
    // Special colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
};
// Status-specific color mappings
exports.statusColors = {
    // Event status colors
    event: {
        draft: exports.colors.gray[500],
        published: exports.colors.primary[500],
        active: exports.colors.success[500],
        completed: exports.colors.gray[600],
        cancelled: exports.colors.error[500],
    },
    // Shift status colors
    shift: {
        open: exports.colors.success[500],
        full: exports.colors.warning[500],
        active: exports.colors.primary[500],
        completed: exports.colors.gray[600],
    },
    // Attendance status colors
    attendance: {
        'checked-in': exports.colors.success[500],
        'checked-out': exports.colors.gray[600],
        'no-show': exports.colors.error[500],
    },
    // Incident severity colors
    incident: {
        low: exports.colors.gray[500],
        medium: exports.colors.warning[500],
        high: exports.colors.warning[600],
        critical: exports.colors.error[500],
    },
    // User role colors
    role: {
        volunteer: exports.colors.primary[500],
        coordinator: exports.colors.secondary[600],
        collaborator: exports.colors.secondary[500],
        owner: exports.colors.secondary[700],
    },
};
