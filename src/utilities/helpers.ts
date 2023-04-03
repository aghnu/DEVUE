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

/**
 * Ensure an render dependent action execution
 * Not a prefered way
 *
 */
export function repeatActionForSetFrames(
  action: () => void,
  repeatNum: number = 1
) {
  if (repeatNum <= 0) return;
  window.requestAnimationFrame(() => {
    action();
    repeatActionForSetFrames(action, repeatNum - 1);
  });
}

export function convertStyleColorToRGBA(styleColor: string) {
  const rgbGroup = styleColor.match(/^rgb\((\d+),\s(\d+),\s(\d+)\)$/);
  if (rgbGroup) return [rgbGroup[1], rgbGroup[2], rgbGroup[3], 1];

  const rgbaGroup = styleColor.match(/^rgba\((\d+),\s(\d+),\s(\d+),\s(\d+)\)$/);
  if (rgbaGroup)
    return [rgbaGroup[1], rgbaGroup[2], rgbaGroup[3], rgbaGroup[4]];

  return null;
}
