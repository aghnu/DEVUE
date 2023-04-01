/**
 * Cannot clone object that contains function
 * 
 */
export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}