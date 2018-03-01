/**
 * Rounds to two decimal places.
 * @param n number to round
 */
export function round(n: number): number {
    return Math.round(n * 100) / 100;
}