/**
 * Cannot clone object that contains function
 *
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function convertStyleUnitPxToNumber(stylePx: string) {
  const groups = stylePx.match(/^([0-9\.]*)px$/);
  if (groups) return Number(groups[1]);
  return null;
}
