/**
 * Remove duplicates from an array
 */
export declare function unique<T>(array: T[]): T[];
/**
 * Group array items by a key function
 */
export declare function groupBy<T, K extends string | number>(array: T[], keyFn: (item: T) => K): Record<K, T[]>;
/**
 * Sort array by a key function
 */
export declare function sortBy<T>(array: T[], keyFn: (item: T) => string | number, direction?: 'asc' | 'desc'): T[];
/**
 * Chunk array into smaller arrays of specified size
 */
export declare function chunk<T>(array: T[], size: number): T[][];
/**
 * Get random item from array
 */
export declare function randomItem<T>(array: T[]): T | undefined;
/**
 * Shuffle array randomly
 */
export declare function shuffle<T>(array: T[]): T[];
/**
 * Find item in array by predicate function
 */
export declare function findBy<T>(array: T[], predicate: (item: T) => boolean): T | undefined;
/**
 * Check if array contains item matching predicate
 */
export declare function some<T>(array: T[], predicate: (item: T) => boolean): boolean;
/**
 * Check if all items in array match predicate
 */
export declare function every<T>(array: T[], predicate: (item: T) => boolean): boolean;
/**
 * Get intersection of two arrays
 */
export declare function intersection<T>(array1: T[], array2: T[]): T[];
/**
 * Get difference between two arrays (items in first but not second)
 */
export declare function difference<T>(array1: T[], array2: T[]): T[];
/**
 * Flatten nested arrays
 */
export declare function flatten<T>(arrays: T[][]): T[];
/**
 * Create array of numbers in range
 */
export declare function range(start: number, end: number, step?: number): number[];
