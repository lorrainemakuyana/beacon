"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = unique;
exports.groupBy = groupBy;
exports.sortBy = sortBy;
exports.chunk = chunk;
exports.randomItem = randomItem;
exports.shuffle = shuffle;
exports.findBy = findBy;
exports.some = some;
exports.every = every;
exports.intersection = intersection;
exports.difference = difference;
exports.flatten = flatten;
exports.range = range;
/**
 * Remove duplicates from an array
 */
function unique(array) {
    return [...new Set(array)];
}
/**
 * Group array items by a key function
 */
function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}
/**
 * Sort array by a key function
 */
function sortBy(array, keyFn, direction = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);
        if (direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
}
/**
 * Chunk array into smaller arrays of specified size
 */
function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
/**
 * Get random item from array
 */
function randomItem(array) {
    if (array.length === 0)
        return undefined;
    return array[Math.floor(Math.random() * array.length)];
}
/**
 * Shuffle array randomly
 */
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
/**
 * Find item in array by predicate function
 */
function findBy(array, predicate) {
    return array.find(predicate);
}
/**
 * Check if array contains item matching predicate
 */
function some(array, predicate) {
    return array.some(predicate);
}
/**
 * Check if all items in array match predicate
 */
function every(array, predicate) {
    return array.every(predicate);
}
/**
 * Get intersection of two arrays
 */
function intersection(array1, array2) {
    return array1.filter(item => array2.includes(item));
}
/**
 * Get difference between two arrays (items in first but not second)
 */
function difference(array1, array2) {
    return array1.filter(item => !array2.includes(item));
}
/**
 * Flatten nested arrays
 */
function flatten(arrays) {
    return arrays.flat();
}
/**
 * Create array of numbers in range
 */
function range(start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}
